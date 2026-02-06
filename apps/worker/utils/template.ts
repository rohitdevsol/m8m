export function resolveTemplate(
  template: string,
  context: Record<string, any>,
) {
  if (!template) return "";

  return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, path) => {
    const keys = path.split(".");
    let value: any = context;

    for (const key of keys) {
      value = value?.[key];
      if (value == null) return "";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  });
}
