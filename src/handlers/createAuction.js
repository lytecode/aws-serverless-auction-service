async function createAuction(event, context) {
  const { title, description } = JSON.stringify(event.body);
  const date = new Date();

  const auction = {
    title,
    description,
    status: "OPEN",
    createAt: date.toISOString(),
    modifiedAt: date.toISOString(),
  };

  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}

export const handler = createAuction;
