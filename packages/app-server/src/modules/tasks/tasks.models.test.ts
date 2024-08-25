import { describe, expect, test } from 'vitest';
import { createTestLogger } from '../shared/logger/logger.test-utils';
import { defineTask } from './tasks.models';

function createHandler() {
  const handlerArgs: unknown[] = [];

  return {
    handler: async (...args: unknown[]) => {
      handlerArgs.push(args);
    },
    getHandlerArgs: () => handlerArgs,
  };
}

describe('tasks models', () => {
  describe('defineTask', () => {
    test('create a task definition with a log context', async () => {
      const { logger, getLoggerArgs } = createTestLogger();
      const { handler, getHandlerArgs } = createHandler();

      const { run, taskName } = defineTask({ name: 'foo', handler, logger, cronSchedule: '0 0 * * *', isEnabled: true });

      expect(taskName).to.eql('foo');

      await run({
        storage: { foo: 'bar' } as any,
        config: { bar: 'baz' } as any,
        getNow: () => new Date('2021-01-01T00:00:00Z'),
      });

      expect(getHandlerArgs()).to.eql([
        [{ storage: { foo: 'bar' }, config: { bar: 'baz' }, logger, now: new Date('2021-01-01T00:00:00Z') }],
      ]);

      expect(getLoggerArgs()).to.eql({
        info: [
          [{ taskName: 'foo', startedAt: new Date('2021-01-01T00:00:00.000Z') }, 'Task started'],
          [{ taskName: 'foo', durationMs: 0, startedAt: new Date('2021-01-01T00:00:00.000Z') }, 'Task completed'],
        ],
      });
    });

    test('if the task fails, the error is logged', async () => {
      const { logger, getLoggerArgs } = createTestLogger();

      const { run } = defineTask({
        name: 'foo',
        cronSchedule: '0 0 * * *',
        isEnabled: true,
        handler: async () => {
          throw new Error('foo');
        },
        logger,
      });

      await run({
        storage: { foo: 'bar' } as any,
        config: { bar: 'baz' } as any,
        getNow: () => new Date('2021-01-01T00:00:00Z'),
      });

      expect(getLoggerArgs()).to.eql({
        error: [
          [{ error: new Error('foo'), taskName: 'foo', startedAt: new Date('2021-01-01T00:00:00.000Z') }, 'Task failed'],
        ],
        info: [
          [{ taskName: 'foo', startedAt: new Date('2021-01-01T00:00:00.000Z') }, 'Task started'],
        ],
      });
    });
  });
});
