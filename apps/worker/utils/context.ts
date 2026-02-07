// utils/context.ts

export type ExecutionContext = Record<string, any> & {
  last?: any;
  flat?: Record<string, any>;
  trigger?: any;
};

export function buildContext() {
  const context: ExecutionContext = {
    last: null,
    flat: {},
    trigger: null,
  };

  return {
    get() {
      return context;
    },
    addStep(name: string, output: any) {
      if (!name) return;
      context[name] = output;
      context.last = output;

      if (output && typeof output === "object") {
        for (const [k, v] of Object.entries(output)) {
          if (!(k in context.flat!)) {
            context.flat![k] = v;
          }
        }
      }
    },

    setTrigger(data: any) {
      context.trigger = data;
    },
  };
}
