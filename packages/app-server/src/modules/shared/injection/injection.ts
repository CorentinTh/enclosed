import { mapValues } from 'lodash-es';
import type { Dictionary, Expand, Subtract } from '../types';

export { injectArguments };

function injectArguments<Functions extends Dictionary<(args: any) => any>, InjectedArgs>(functions: Functions, injectedArgs: InjectedArgs) {
  return mapValues(functions, (fn) => {
    return (args: any) => fn({ ...args, ...injectedArgs });
  }) as {
    [K in keyof Functions]: Expand<Subtract<Parameters<Functions[K]>[0], InjectedArgs>> extends infer Args
      // eslint-disable-next-line ts/no-empty-object-type
      ? {} extends Args
          ? () => ReturnType<Functions[K]>
          : (args: Args) => ReturnType<Functions[K]>
      : never;
  };
}
