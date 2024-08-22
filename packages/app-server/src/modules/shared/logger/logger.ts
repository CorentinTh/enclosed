import pino from 'pino';

export { createLogger };

const baseLogger = pino();

function createLogger({ namespace }: { namespace: string }) {
  return baseLogger.child({ namespace });
}
