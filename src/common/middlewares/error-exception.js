import { StatusCodes } from 'http-status-codes';
export const ErrorHandlerMiddleware = function (err, req, res, next) {
  return res
    .status(err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
};
