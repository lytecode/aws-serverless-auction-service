import AWS from "aws-sdk";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from "@middy/http-event-normalizer";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;

  try {
    const result = await dynamodb
      .scan({ TableName: process.env.AUCTIONS_TABLE_NAME })
      .promise();

    auctions = result.Items;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(
      "Unable to get autions at this time, try again later"
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middy(getAuctions)
  .use(jsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
