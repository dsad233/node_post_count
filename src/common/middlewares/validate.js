import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
export const validate = function (validations) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors });
  };
};
