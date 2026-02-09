export type ExecutionContext = {
  last: any;
  flat: Record<string, any>;
  trigger: any;
  [key: string]: any;
};

export function buildContext() {
  const context: ExecutionContext = {
    last: null,
    flat: {},
    trigger: null,
  };

  function mergeToFlat(obj: any) {
    if (!obj || typeof obj !== "object") return;

    for (const [k, v] of Object.entries(obj)) {
      if (!(k in context.flat!)) {
        context.flat![k] = v;
      }
    }
  }

  return {
    get() {
      return context;
    },

    addStep(name: string, output: any) {
      if (!name) return;

      context[name] = output;
      context.last = output;

      mergeToFlat(output);
    },

    setTrigger(data: any, name = "trigger") {
      context.trigger = data;
      context[name] = data;
      context.last = data;

      mergeToFlat(data);
    },
  };
}
