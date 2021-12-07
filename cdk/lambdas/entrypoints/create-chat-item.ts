import { container } from "../container";
import TYPES from "../types";
import { IHandlerProps } from "../interfaces/i-handler-props";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { BadRequest, Ok } from "../models/api-responses";
import { ILoggerService } from "../interfaces/i-logger-service";
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();

export interface IChatItem {
  PK: string;
  SK: string;
  Type: string;
  CreatedByName: string;
  CreatedByEmail: string;
  Created: string;
  Content: string;
}

const buildParam = (item: IChatItem) => {
  return {
    TableName: "AwesomeService",
    /* Item properties will depend on your application concerns */
    Item: item
  };
};

const putItem = async (param: any) => {
  await docClient.put(param).promise();
};

const init = async (): Promise<IHandlerProps> => {
  container.bind<string>(TYPES.LambdaName).toConstantValue("create-chat-item");

  return new Promise<IHandlerProps>((resolve) => {
    resolve({
      logger: container.get<ILoggerService>(TYPES.ILoggerService).logger
    });
  });
};

const initPromise = init();

export const postChatItem = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const handlerProps: IHandlerProps = await initPromise;

  const data = JSON.parse(event.body as string);
  if (!data) {
    return BadRequest();
  }

  const timestamp = new Date(Date.now()).toISOString();

  await putItem(
    buildParam({
      PK: `CHAT#${data.chatId}`,
      SK: timestamp,
      Type: "chatItem",
      CreatedByName: data.createdByName,
      CreatedByEmail: data.createdByEmail,
      Created: timestamp,
      Content: data.content
    })
  );
  handlerProps.logger.info(`Put Item. ${event}`);
  return Ok();
};
