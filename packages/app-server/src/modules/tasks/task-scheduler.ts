// import schedule from 'node-schedule';
import cron from 'node-cron';
import type { Storage } from '../storage/storage.types';
import type { Config } from '../app/config/config.types';
import { createLogger } from '../shared/logger/logger';
import type { TaskDefinition } from './tasks.types';

export { createTaskScheduler };

const logger = createLogger({ namespace: 'tasks:scheduler' });

function createTaskScheduler({
  config,
  taskDefinitions,
  tasksArgs,
}: {
  config: Config;
  taskDefinitions: TaskDefinition[];
  tasksArgs: { storage: Storage };
}) {
  const scheduledTasks = taskDefinitions.map((taskDefinition) => {
    const isEnabled = taskDefinition.getIsEnabled({ config });
    const cronSchedule = taskDefinition.getCronSchedule({ config });
    const runOnStartup = taskDefinition.getRunOnStartup({ config });

    if (!isEnabled) {
      return undefined;
    }

    const task = cron.schedule(cronSchedule, () => {
      taskDefinition.run({ ...tasksArgs, config });
    }, {
      scheduled: false,
      runOnInit: runOnStartup,
    });

    logger.info({ taskName: taskDefinition.taskName, cronSchedule }, 'Task registered');

    return { job: task, taskName: taskDefinition.taskName };
  }).filter(Boolean);

  return {
    scheduledTasks,
    start() {
      scheduledTasks.forEach(({ taskName, job }) => {
        job.start();
        logger.info({ taskName }, 'Task scheduled');
      });
    },
  };
}
