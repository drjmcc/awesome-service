import { container } from "../container";
import TYPES from "../types";
import { IHandlerProps } from "../interfaces/i-handler-props";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { BadRequest, NotFound, Ok } from "../models/api-responses";
import { ILoggerService } from "../interfaces/i-logger-service";
import * as AWS from "aws-sdk";
import { AttributeMap, ItemList } from "aws-sdk/clients/dynamodb";
import { IChatItem } from "./create-chat-item";

const docClient = new AWS.DynamoDB.DocumentClient();

export interface IChat {
  id: string;
  createdByName: string;
  createdByEmail: string;
  created: Date;
  content: string;
}

const query = async (id: string): Promise<ItemList> => {
  const pk = `CHAT#${id}`;
  const sk = "2021-10-01T13:25:00.000";
  const result = await docClient
    .query({
      TableName: "AwesomeService",
      KeyConditionExpression: "PK = :PK and SK >= :SK",
      Limit: 1,
      ExpressionAttributeValues: {
        ":PK": pk,
        ":SK": sk
      },
      ScanIndexForward: false
    })
    .promise();

  console.log(result.LastEvaluatedKey);
  if (!result.Items || result.Items.length === 0) {
    throw new Error("Item not found");
  }
  return result.Items;
};

const init = async (): Promise<IHandlerProps> => {
  container.bind<string>(TYPES.LambdaName).toConstantValue("get-chat-item");

  return new Promise<IHandlerProps>((resolve) => {
    resolve({
      logger: container.get<ILoggerService>(TYPES.ILoggerService).logger
    });
  });
};

const initPromise = init();

const mapItemToChat = (item: AttributeMap): IChat => {
  const chatItem = item as unknown as IChatItem;

  const chat: IChat = {
    id: chatItem.PK.replace("CHAT#", ""),
    content: chatItem.Content,
    created: new Date(Date.parse(chatItem.Created)),
    createdByEmail: chatItem.CreatedByEmail,
    createdByName: chatItem.CreatedByName
  };
  return chat;
};

export const getChatItem = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const handlerProps: IHandlerProps = await initPromise;

  const id = event.pathParameters?.id;

  if (!id) {
    return BadRequest();
  }
  handlerProps.logger.info(id);

  try {
    const items = await query(id);
    if (items.length) {
      const chats = items.map(mapItemToChat);
      return Ok(chats);
    } else {
      return NotFound();
    }
  } catch (error) {
    handlerProps.logger.info(JSON.stringify(error));
    return BadRequest();
  }
};
