export type ModelKey = 'openai' | 'anthropic' | 'gemini'

export type JudgeVerdict = {
  judge: ModelKey
  winner: 'affirmative' | 'negative' | 'tie' | 'openai' | 'anthropic' | 'gemini'
  reasoning: string
}

export type Message = {
  role: 'affirmative' | 'negative' | 'moderator'
  model: ModelKey
  text: string
  round: number
  reactions?: MessageReactions
}

export type MessageReactions = {
  fire: number
  thinking: number
  clap: number
}

export type DiscussionMessage = {
  model: ModelKey
  text: string
  messageNumber: number
  reactions?: MessageReactions
}

export type DebateResultV2 = {
  id?: string
  topic: string
  affirmativeModel: ModelKey
  negativeModel: ModelKey
  messages: Message[]
  verdicts: JudgeVerdict[]
  timestamp?: number
  rounds?: number
  temperature?: number
}

export type DiscussionResult = {
  id?: string
  topic: string
  messages: DiscussionMessage[]
  consensus: string | null
  requiredJudging: boolean
  verdicts?: JudgeVerdict[]
  timestamp?: number
}

export type Mode = 'debate' | 'discussion'

export type SavedDebate = {
  id: string
  mode: Mode
  debateResult?: DebateResultV2
  discussionResult?: DiscussionResult
  timestamp: number
}

export type ModelStats = {
  model: ModelKey
  wins: number
  losses: number
  ties: number
  totalDebates: number
}

export type DebateTopic = {
  id: string
  title: string
  category: 'philosophy' | 'technology' | 'ethics' | 'science' | 'politics' | 'culture'
  difficulty: 'easy' | 'medium' | 'hard'
}
