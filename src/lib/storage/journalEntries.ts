/**
 * Journal Entries Storage
 *
 * Manages journal entry persistence in localStorage with automatic pruning.
 */

const ENTRIES_KEY = "delve.journal.entries";
const USER_KEY = "delve.journal.userId";
const MAX_ENTRIES = 200;

export interface JournalEntry {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  status: "pending" | "submitted" | "error";
  tags?: string[];
}

function getStore(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ENTRIES_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as JournalEntry[];
  } catch {
    return [];
  }
}

function saveStore(entries: JournalEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // If storage is full, prune oldest entries and retry
    const pruned = entries.slice(-Math.floor(MAX_ENTRIES / 2));
    try {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(pruned));
    } catch {
      // Give up
    }
  }
}

export function getJournalEntries(): JournalEntry[] {
  return getStore();
}

export function addJournalEntry(entry: JournalEntry): void {
  const entries = getStore();
  entries.push(entry);
  // Prune if over limit
  if (entries.length > MAX_ENTRIES) {
    entries.splice(0, entries.length - MAX_ENTRIES);
  }
  saveStore(entries);
}

export function updateEntryStatus(
  id: string,
  status: JournalEntry["status"]
): void {
  const entries = getStore();
  const entry = entries.find((e) => e.id === id);
  if (entry) {
    entry.status = status;
    saveStore(entries);
  }
}

export function clearEntries(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ENTRIES_KEY);
  } catch {
    // Ignore
  }
}

export function getSavedUserId(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(USER_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveUserId(userId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_KEY, userId);
  } catch {
    // Ignore
  }
}
