export function resolveTemplate(
  template: string,
  context: Record<string, any>,
) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, expr) => {
    const keys = expr.trim().split(".");

    let value: any = context;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return "";
    }

    return typeof value === "object" ? JSON.stringify(value) : String(value);
  });
}
