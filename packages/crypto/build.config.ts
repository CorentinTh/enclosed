import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index.node',
    'src/index.web',
  ],
  clean: true,
  declaration: true,
  sourcemap: true,
  rollup: {
    emitCJS: true,
  },
});
