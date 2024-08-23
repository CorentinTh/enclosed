export { attempt, asyncAttempt, promiseAttempt };

function castError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function attempt<T>(fn: () => T): [T, null] | [null, Error] {
  try {
    return [fn(), null];
  } catch (error) {
    return [null, castError(error)];
  }
}

async function asyncAttempt<T>(fn: () => Promise<T>): Promise<[T, null] | [null, Error]> {
  try {
    return [await fn(), null];
  } catch (error) {
    return [null, castError(error)];
  }
}
async function promiseAttempt<T>(fn: Promise<T>): Promise<[T, null] | [null, Error]> {
  try {
    return [await fn, null];
  } catch (error) {
    return [null, castError(error)];
  }
}
