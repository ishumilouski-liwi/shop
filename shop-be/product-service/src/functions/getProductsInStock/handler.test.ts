import { apiGatewayProxyEventTemplate } from "@libs/lambda";
import products from "@services/products.json";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import httpError from "http-errors";

import { getProductsInStock } from "./handler";

const ddbMock = mockClient(DynamoDBDocumentClient);

describe("getProductsInStock", () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it("returns all products in stocks objects", async () => {
    const productsInStock = [
      {
        productId: products[0].id,
        count: 5,
      },
      {
        productId: products[1].id,
        count: 7,
      },
    ];

    ddbMock
      .on(ScanCommand)
      .resolvesOnce({
        Items: productsInStock,
      })
      .resolvesOnce({
        Items: products,
      });

    const response = await getProductsInStock(apiGatewayProxyEventTemplate);

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify([
        {
          ...products[0],
          count: productsInStock[0].count,
        },
        {
          ...products[1],
          count: productsInStock[1].count,
        },
      ]),
    });
  });

  it("throws an internal server error if products were not loaded correctly", async () => {
    ddbMock.on(ScanCommand).rejects("Something went wrong");

    try {
      await getProductsInStock(apiGatewayProxyEventTemplate);
    } catch (err) {
      expect(err).toEqual(new httpError.InternalServerError());
    }
  });
});
