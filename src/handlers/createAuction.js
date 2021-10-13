import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from "@middy/http-event-normalizer";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title, description } = event.body;
  const date = new Date();

  const auction = {
    id: uuid(),
    title,
    description,
    status: "OPEN",
    createAt: date.toISOString(),
    modifiedAt: date.toISOString(),
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(
      `Request failed, please try again later`
    );
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction)
  .use(jsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
