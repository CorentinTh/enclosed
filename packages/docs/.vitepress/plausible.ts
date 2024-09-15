import type { HeadConfig } from 'vitepress';
import process from 'node:process';

const isPlausibleEnabled = process.env.VITE_IS_PLAUSIBLE_ENABLED === 'true';
const plausibleDomain = String(process.env.VITE_PLAUSIBLE_DOMAIN);
const plausibleScriptSrc = String(process.env.VITE_PLAUSIBLE_SCRIPT_SRC);

export { getPlausibleScripts };

function getPlausibleScripts(): HeadConfig[] {
  if (!isPlausibleEnabled || !plausibleDomain) {
    return [];
  }

  return [
    ['script', { 'async': '', 'defer': '', 'data-domain': plausibleDomain, 'src': plausibleScriptSrc }],
  ];
}
