const DEFAULT_TIMEOUT_MS = 20000;

export async function fetchBackend(input: string, init: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Backend request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
