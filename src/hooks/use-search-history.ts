const MAX_HISTORY = 10;

const getKey = (toolId: string) => `search-history-${toolId}`;

export function getSearchHistory(toolId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(getKey(toolId)) || "[]");
  } catch {
    return [];
  }
}

export function addSearchHistory(toolId: string, query: string) {
  const history = getSearchHistory(toolId);
  const filtered = history.filter((h) => h !== query);
  filtered.unshift(query);
  localStorage.setItem(getKey(toolId), JSON.stringify(filtered.slice(0, MAX_HISTORY)));
}

export function removeSearchHistoryItem(toolId: string, query: string) {
  const history = getSearchHistory(toolId).filter((h) => h !== query);
  localStorage.setItem(getKey(toolId), JSON.stringify(history));
}

export function clearSearchHistory(toolId: string) {
  localStorage.removeItem(getKey(toolId));
}
