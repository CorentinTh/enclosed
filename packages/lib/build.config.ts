import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index.node',
    'src/index.web',
  ],

  declaration: true,
  sourcemap: true,
  rollup: {
    emitCJS: true,
  },
});
