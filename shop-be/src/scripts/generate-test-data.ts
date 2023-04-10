import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@libs/ddbClient";
import { faker } from "@faker-js/faker";

const recordsCount = faker.datatype.number({
  min: 1,
  max: 20,
});

const randomProducts = [];

for (let i = 0; i < recordsCount; i += 1) {
  randomProducts.push({
    id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.datatype.number(),
    count: faker.datatype.number(),
  });
}

console.log(randomProducts);
const command = new BatchWriteCommand({
  RequestItems: {
    products: randomProducts.map((product) => ({
      PutRequest: {
        Item: {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
        },
      },
    })),
    stock: randomProducts.map((product) => ({
      PutRequest: {
        Item: {
          productId: product.id,
          count: product.count,
        },
      },
    })),
  },
});

ddbDocClient.send(command);
