import type { Config } from './config.types';

export { injectPublicConfigInIndex };

function injectPublicConfigInIndex({ publicConfig, indexHtmlContent }: { publicConfig: Config['public']; indexHtmlContent: string }) {
  return indexHtmlContent.replace('</head>', `<script>window.__CONFIG__ = ${JSON.stringify(publicConfig)}</script></head>`);
}
