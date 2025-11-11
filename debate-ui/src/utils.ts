import type {
  SavedDebate,
  ModelStats,
  ModelKey,
  DebateResultV2,
  DiscussionResult,
  Mode,
} from "./types";

// LocalStorage utilities
export const STORAGE_KEYS = {
  DEBATES: "debate_history",
  STATS: "model_stats",
  THEME: "theme_preference",
  SETTINGS: "user_settings",
};

export function saveDebate(
  mode: Mode,
  result: DebateResultV2 | DiscussionResult,
): string {
  const debates = getSavedDebates();
  const id = crypto.randomUUID();
  const timestamp = Date.now();

  const savedDebate: SavedDebate = {
    id,
    mode,
    timestamp,
    ...(mode === "debate"
      ? { debateResult: { ...(result as DebateResultV2), id, timestamp } }
      : {
          discussionResult: { ...(result as DiscussionResult), id, timestamp },
        }),
  };

  debates.unshift(savedDebate);

  // Keep only last 50 debates
  if (debates.length > 50) {
    debates.splice(50);
  }

  localStorage.setItem(STORAGE_KEYS.DEBATES, JSON.stringify(debates));

  // Update stats if it's a debate
  if (mode === "debate") {
    updateStats(result as DebateResultV2);
  }

  return id;
}

export function getSavedDebates(): SavedDebate[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DEBATES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getDebateById(id: string): SavedDebate | null {
  const debates = getSavedDebates();
  return debates.find((d) => d.id === id) || null;
}

export function deleteDebate(id: string): void {
  const debates = getSavedDebates();
  const filtered = debates.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DEBATES, JSON.stringify(filtered));
}

export function clearAllDebates(): void {
  localStorage.removeItem(STORAGE_KEYS.DEBATES);
}

// Stats utilities
export function updateStats(result: DebateResultV2): void {
  const stats = getModelStats();

  const affModel = result.affirmativeModel;
  const negModel = result.negativeModel;

  // Don't count stats when AI debates itself
  if (affModel === negModel) {
    console.log("📊 Skipping stats - same model debate");
    return;
  }

  // Count votes for each model
  const voteCounts: Record<string, number> = {
    affirmative: 0,
    negative: 0,
    tie: 0,
  };

  result.verdicts.forEach((v) => {
    if (v.winner in voteCounts) {
      voteCounts[v.winner]++;
    }
  });

  // Determine winner
  if (voteCounts.affirmative > voteCounts.negative) {
    stats[affModel].wins++;
    stats[negModel].losses++;
  } else if (voteCounts.negative > voteCounts.affirmative) {
    stats[negModel].wins++;
    stats[affModel].losses++;
  } else {
    stats[affModel].ties++;
    stats[negModel].ties++;
  }

  stats[affModel].totalDebates++;
  stats[negModel].totalDebates++;

  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

export function getModelStats(): Record<ModelKey, ModelStats> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (data) {
      return JSON.parse(data);
    }
  } catch {}

  return {
    openai: { model: "openai", wins: 0, losses: 0, ties: 0, totalDebates: 0 },
    anthropic: {
      model: "anthropic",
      wins: 0,
      losses: 0,
      ties: 0,
      totalDebates: 0,
    },
    gemini: { model: "gemini", wins: 0, losses: 0, ties: 0, totalDebates: 0 },
  };
}

export function clearStats(): void {
  localStorage.removeItem(STORAGE_KEYS.STATS);
}

// Theme utilities
export function getTheme(): "light" | "dark" {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function setTheme(theme: "light" | "dark"): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// Export utilities
export function exportAsMarkdown(debate: SavedDebate): string {
  if (debate.mode === "debate" && debate.debateResult) {
    const result = debate.debateResult;
    let md = `# Debate: ${result.topic}\n\n`;
    md += `**Affirmative:** ${result.affirmativeModel}\n`;
    md += `**Negative:** ${result.negativeModel}\n`;
    md += `**Date:** ${new Date(debate.timestamp).toLocaleDateString()}\n\n`;
    md += `---\n\n`;

    result.messages.forEach((msg) => {
      md += `## ${msg.role.toUpperCase()} (${msg.model}) - Round ${msg.round}\n\n`;
      md += `${msg.text}\n\n`;
    });

    md += `---\n\n## Judge Verdicts\n\n`;
    result.verdicts.forEach((v) => {
      md += `**${v.judge}:** ${v.winner.toUpperCase()}\n`;
      md += `> ${v.reasoning}\n\n`;
    });

    return md;
  } else if (debate.mode === "discussion" && debate.discussionResult) {
    const result = debate.discussionResult;
    let md = `# Discussion: ${result.topic}\n\n`;
    md += `**Date:** ${new Date(debate.timestamp).toLocaleDateString()}\n\n`;
    md += `---\n\n`;

    result.messages.forEach((msg) => {
      md += `## ${msg.model.toUpperCase()} - Message #${msg.messageNumber}\n\n`;
      md += `${msg.text}\n\n`;
    });

    if (result.consensus) {
      md += `---\n\n## Consensus\n\n${result.consensus}\n\n`;
    }

    return md;
  }

  return "";
}

export function downloadFile(
  content: string,
  filename: string,
  type: string = "text/markdown",
): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Format date/time
export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}
