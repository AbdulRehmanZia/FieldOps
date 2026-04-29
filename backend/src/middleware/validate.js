import { error } from '../utils/response.js';

export function validate(schema) {
  return (req, res, next) => {
    const { value, error: joiError } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (joiError) {
      const messages = joiError.details.map((err) => err.message).join(', ');
      return error(res, messages, 422);
    }

    req.validated = value;
    next();
  };
}
