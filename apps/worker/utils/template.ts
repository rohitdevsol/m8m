function resolveStringTemplate(template: string, context: Record<string, any>) {
  const exactMatch = template.match(/^\s*\{\{(.*?)\}\}\s*$/);
  if (exactMatch) {
    const path = exactMatch[1]!.trim();

    const keys = path.split(".");
    let value: any = context;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined || value === null) return null;
    }
    return value;
  }

  return template.replace(/\{\{(.*?)\}\}/g, (_, path) => {
    const keys = path.trim().split(".");
    let value: any = context;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined || value === null) return "";
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  });
}

export function resolveTemplate(value: any, context: Record<string, any>): any {
  if (typeof value === "string") {
    return resolveStringTemplate(value, context);
  }

  if (Array.isArray(value)) {
    return value.map((v) => resolveTemplate(v, context));
  }

  if (value && typeof value === "object") {
    const result: any = {};

    for (const [key, val] of Object.entries(value)) {
      result[key] = resolveTemplate(val, context);
    }

    return result;
  }

  return value;
}
