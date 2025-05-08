import { Response } from "express";
interface IResponse<I> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: I;
}

const sendResponse = <I>(res: Response, data: IResponse<I>) => {
  const { statusCode, success, message, data: responseData } = data;
  res.status(statusCode).send({
    success,
    message,
    data: responseData,
  });
};

export default sendResponse;
