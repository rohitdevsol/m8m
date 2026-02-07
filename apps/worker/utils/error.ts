export function serializeError(err: unknown) {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }

  if (typeof err === "string") {
    return {
      message: err,
    };
  }

  try {
    return JSON.parse(JSON.stringify(err));
  } catch {
    return {
      message: "Unknown error",
      raw: String(err),
    };
  }
}
