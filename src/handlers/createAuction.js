import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const LOG_KEY = "CREATE-AUCTION";

  const { title, description } = JSON.stringify(event.body);
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
        TableName: "AuctionsTable",
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.log(LOG_KEY, error);
    return {
      statusCode: 500,
      body: { error: "Could not create auction" },
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
