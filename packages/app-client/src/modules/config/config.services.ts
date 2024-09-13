import type { RuntimeConfig } from './config.types';
import { apiClient } from '../shared/http/http-client';

export { fetchPublicConfig };

async function fetchPublicConfig() {
  const { config } = await apiClient<{
    config: RuntimeConfig;
  }>({
    method: 'GET',
    path: '/api/config',
  });

  return { config };
}
