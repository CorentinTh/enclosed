import { z } from 'zod';

export const configDefinition = {
  'instance-url': {
    description: 'Instance URL',
    schema: z.string().url(),
  },
} as const;
