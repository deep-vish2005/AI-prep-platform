export function validateBody(schema) {
  return function bodyValidationMiddleware(request, response, next) {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return response.status(400).json({
        success: false,
        message: "Request validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    request.body = result.data;
    return next();
  };
}

export function validateParams(schema) {
  return function paramsValidationMiddleware(request, response, next) {
    const result = schema.safeParse(request.params);

    if (!result.success) {
      return response.status(400).json({
        success: false,
        message: "Invalid URL parameters",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    request.params = result.data;
    return next();
  };
}
