/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export interface IResponse {
  statusCode: number;
  body: string;
  headers: { [header: string]: string | number | boolean };
}

export const BadRequest = (
  errors: string[] = [],
  message = "Bad request"
): IResponse => {
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: message,
      errors: errors ? errors : []
    }),
    headers: { "Content-Type": "application/json" }
  };
};

export const NotFound: IResponse = {
  statusCode: 404,
  body: JSON.stringify({ message: "Not Found" }),
  headers: { "Content-Type": "application/json" }
};

export const ServiceError: IResponse = {
  statusCode: 500,
  body: JSON.stringify({ message: "A service error occurred." }),
  headers: { "Content-Type": "application/json" }
};

export const Forbidden: IResponse = {
  statusCode: 403,
  body: JSON.stringify({ message: "Forbidden" }),
  headers: { "Content-Type": "application/json" }
};

export const Ok = (response: any = null): IResponse => {
  return {
    statusCode: 200,
    body: response ? JSON.stringify(response) : "",
    headers: { "Content-Type": "application/json" }
  };
};
