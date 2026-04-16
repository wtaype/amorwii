type Stored<T> = {
  value: T;
  expiry: number;
};

const HOUR_MS = 60 * 60 * 1000;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function savels<T>(key: string, value: T, hours = 24): boolean {
  if (!canUseStorage() || !key) return false;
  const payload: Stored<T> = {
    value,
    expiry: Date.now() + hours * HOUR_MS,
  };
  window.localStorage.setItem(key, JSON.stringify(payload));
  return true;
}

export function getls<T>(key: string): T | null {
  if (!canUseStorage() || !key) return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Stored<T> | T;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "expiry" in parsed &&
      "value" in parsed
    ) {
      if (Date.now() > Number(parsed.expiry)) {
        window.localStorage.removeItem(key);
        return null;
      }
      return parsed.value as T;
    }
    return parsed as T;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

export function removels(...keys: string[]) {
  if (!canUseStorage()) return;
  keys.flatMap((k) => k.split(/[,\s]+/)).forEach((k) => {
    if (k) window.localStorage.removeItem(k);
  });
}
