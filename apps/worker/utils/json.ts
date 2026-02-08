export function toJsonSafe(value: any): any {
  if (value === undefined) return null;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "object") {
    return JSON.parse(JSON.stringify(value));
  }

  return value;
}
