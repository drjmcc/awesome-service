import { container } from "../container";
import TYPES from "../types";
import { IHandlerProps } from "../interfaces/i-handler-props";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Ok } from "../models/api-responses";
import { ILoggerService } from "../interfaces/i-logger-service";

const init = async (): Promise<IHandlerProps> => {
  container.bind<string>(TYPES.LambdaName).toConstantValue("hello-world");

  return new Promise<IHandlerProps>((resolve) => {
    resolve({
      logger: container.get<ILoggerService>(TYPES.ILoggerService).logger
    });
  });
};

const initPromise = init();

export const helloWorld = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const handlerProps: IHandlerProps = await initPromise;
  handlerProps.logger.info(`Hello world. ${event}`);
  return Ok("Ok");
};
