export const year = () => new Date().getFullYear();

export const sleep = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function wicopy(value: string) {
  const text = String(value ?? "");
  if (typeof navigator === "undefined") return false;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}
