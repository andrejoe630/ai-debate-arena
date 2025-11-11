import { askOpenAI } from '../ai/openai.js';
import { askClaude } from '../ai/anthropic.js';
import { askGemini } from '../ai/gemini.js';
import { runJudges } from './judging.js';
import type { ModelKey, JudgeVerdict } from './judging.types.js';

type Message = {
  role: 'affirmative' | 'negative' | 'moderator';
  model: ModelKey;
  text: string;
  round: number;
};

type DebateResultV2 = {
  topic: string;
  affirmativeModel: ModelKey;
  negativeModel: ModelKey;
  messages: Message[];
  verdicts: JudgeVerdict[];
};

const MODEL_MAP: Record<ModelKey, (prompt: string) => Promise<string>> = {
  openai: askOpenAI,
  anthropic: askClaude,
  gemini: askGemini,
};

type ProgressCallback = (status: string, data?: any) => void;

export async function runDebateWithModelsV2(
  topic: string,
  affirmativeModel: ModelKey,
  negativeModel: ModelKey,
  rounds: number = 2,
  onProgress?: ProgressCallback
): Promise<DebateResultV2> {
  const messages: Message[] = [];
  
  console.log('Starting multi-round debate:', topic);
  console.log('Rounds:', rounds);
  onProgress?.('Starting debate', { topic, rounds });

  onProgress?.('Round 1: Affirmative opening', { round: 1, stage: 'affirmative' });
  const affOpening = await MODEL_MAP[affirmativeModel](
    `You are debating the affirmative side of: "${topic}"

Write a brief opening statement (100-150 words) presenting your 2-3 strongest arguments.
Be clear and persuasive.`
  );
  
  messages.push({
    role: 'affirmative',
    model: affirmativeModel,
    text: affOpening,
    round: 1,
  });
  onProgress?.('message', messages[messages.length - 1]);

  onProgress?.('Round 1: Negative opening', { round: 1, stage: 'negative' });
  const negOpening = await MODEL_MAP[negativeModel](
    `You are debating the negative side of: "${topic}"

The affirmative just said:
"${affOpening}"

Write a brief opening (100-150 words) with 2-3 counter-arguments.`
  );
  
  messages.push({
    role: 'negative',
    model: negativeModel,
    text: negOpening,
    round: 1,
  });
  onProgress?.('message', messages[messages.length - 1]);

  // Helper function to check if moderator should intervene
  async function checkForIntervention(lastMessage: Message): Promise<string | null> {
    const checkPrompt = `You are a debate moderator. Analyze this argument for logical fallacies, bias, or misleading claims.

Argument: "${lastMessage.text}"

If you detect ANY of these issues, respond with "INTERVENE: [brief 30-50 word explanation]"
If the argument is sound, respond with "OK"`;

    const check = await askClaude(checkPrompt);
    if (check.startsWith('INTERVENE:')) {
      return check.substring(10).trim();
    }
    return null;
  }

  for (let round = 2; round <= rounds; round++) {
    console.log(`Round ${round}: Rebuttals`);
    
    onProgress?.(`Round ${round}: Affirmative rebuttal`, { round, stage: 'affirmative' });
    const lastNeg = messages.filter(m => m.role === 'negative').slice(-1)[0];
    const affRebuttal = await MODEL_MAP[affirmativeModel](
      `You are debating the affirmative side of: "${topic}"

The negative just argued:
"${lastNeg.text}"

Write a quick rebuttal (75-100 words). Address their key point and strengthen your case.`
    );
    
    messages.push({
      role: 'affirmative',
      model: affirmativeModel,
      text: affRebuttal,
      round,
    });
    onProgress?.('message', messages[messages.length - 1]);

    // Check if moderator should intervene after affirmative
    const affIntervention = await checkForIntervention(messages[messages.length - 1]);
    if (affIntervention) {
      onProgress?.('Moderator intervening', { round, stage: 'moderator' });
      messages.push({
        role: 'moderator',
        model: 'anthropic',
        text: `⚠️ MODERATOR INTERVENTION: ${affIntervention}`,
        round,
      });
      onProgress?.('message', messages[messages.length - 1]);
    }

    onProgress?.(`Round ${round}: Negative rebuttal`, { round, stage: 'negative' });
    const lastAff = messages.filter(m => m.role === 'affirmative').slice(-1)[0];
    const negRebuttal = await MODEL_MAP[negativeModel](
      `You are debating the negative side of: "${topic}"

The affirmative just argued:
"${lastAff.text}"

Write a quick rebuttal (75-100 words). Address their key point and strengthen your case.`
    );
    
    messages.push({
      role: 'negative',
      model: negativeModel,
      text: negRebuttal,
      round,
    });
    onProgress?.('message', messages[messages.length - 1]);

    // Check if moderator should intervene after negative
    const negIntervention = await checkForIntervention(messages[messages.length - 1]);
    if (negIntervention) {
      onProgress?.('Moderator intervening', { round, stage: 'moderator' });
      messages.push({
        role: 'moderator',
        model: 'anthropic',
        text: `⚠️ MODERATOR INTERVENTION: ${negIntervention}`,
        round,
      });
      onProgress?.('message', messages[messages.length - 1]);
    }
  }

  console.log('Final round: Closing statements');
  
  onProgress?.('Closing: Affirmative final statement', { stage: 'closing' });
  const affClosing = await MODEL_MAP[affirmativeModel](
    `You are debating the affirmative side of: "${topic}"

Final statement in 75-100 words: summarize your strongest point and why you win.`
  );
  
  messages.push({
    role: 'affirmative',
    model: affirmativeModel,
    text: affClosing,
    round: rounds + 1,
  });
  onProgress?.('message', messages[messages.length - 1]);

  onProgress?.('Closing: Negative final statement', { stage: 'closing' });
  const negClosing = await MODEL_MAP[negativeModel](
    `You are debating the negative side of: "${topic}"

Final statement in 75-100 words: summarize your strongest point and why you win.`
  );
  
  messages.push({
    role: 'negative',
    model: negativeModel,
    text: negClosing,
    round: rounds + 1,
  });
  onProgress?.('message', messages[messages.length - 1]);

  onProgress?.('Moderator analyzing debate', { stage: 'moderator' });
  console.log('Moderator analyzing debate');
  const fullTranscript = messages.map(m => `[${m.role.toUpperCase()} - Round ${m.round}]: ${m.text}`).join('\n\n');
  
  const moderatorSummary = await askClaude(
    `You are a neutral debate moderator analyzing this debate on: "${topic}"

Full transcript:
${fullTranscript}

Provide a brief analysis (150-200 words):
1. Key clash points
2. Strongest arguments from each side
3. Any logical gaps
DO NOT pick a winner.`
  );
  
  messages.push({
    role: 'moderator',
    model: 'anthropic',
    text: moderatorSummary,
    round: rounds + 1,
  });
  onProgress?.('message', messages[messages.length - 1]);

  onProgress?.('Judges deliberating', { stage: 'judging' });
  console.log('Judges deliberating');
  const affText = messages.filter(m => m.role === 'affirmative').map(m => m.text).join('\n\n');
  const negText = messages.filter(m => m.role === 'negative').map(m => m.text).join('\n\n');
  
  const verdicts = await runJudges({ 
    topic, 
    affirmativeText: affText, 
    negativeText: negText 
  });

  return {
    topic,
    affirmativeModel,
    negativeModel,
    messages,
    verdicts,
  };
}