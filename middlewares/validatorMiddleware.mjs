import { validationResult } from "express-validator";

// eslint-disable-next-line import/prefer-default-export
export function validatorMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
