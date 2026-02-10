export function serializeError(err: unknown): {
  message: string;
  stack?: string | null;
  raw?: any;
} {
  // Normal Error
  if (err instanceof Error) {
    const msg = err.message;

    // Try parsing JSON inside message
    try {
      const parsed = JSON.parse(msg);

      if (parsed?.error?.message) {
        return {
          message: parsed.error.message,
          stack: err.stack,
          raw: parsed,
        };
      }
    } catch {
      // Not JSON → ignore
    }

    return {
      message: msg,
      stack: err.stack,
    };
  }

  // API object error
  if (typeof err === "object" && err !== null) {
    const anyErr = err as any;

    if (anyErr.error?.message) {
      return {
        message: anyErr.error.message,
        raw: anyErr,
      };
    }

    if (typeof anyErr.message === "string") {
      return {
        message: anyErr.message,
        raw: anyErr,
      };
    }

    return {
      message: "Unknown API error",
      raw: anyErr,
    };
  }

  if (typeof err === "string") {
    return {
      message: err,
    };
  }

  return {
    message: "Unknown error",
    raw: err,
  };
}
