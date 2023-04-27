import { apiGatewayProxyEventTemplate } from "@libs/lambda";
import httpError from "http-errors";
import products from "@services/products.json";
import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { getProductInStock } from "./handler";

const ddbMock = mockClient(DynamoDBDocumentClient);

describe("getProductInStock", () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it("returns a product in stock object if found", async () => {
    const product = products[1];
    const productInStock = {
      productId: product.id,
      count: 3,
    };

    ddbMock.on(QueryCommand).resolves({
      Items: [product],
    });

    ddbMock.on(ScanCommand).resolves({
      Items: [productInStock],
    });

    const response = await getProductInStock({
      ...apiGatewayProxyEventTemplate,
      pathParameters: {
        id: product.id,
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        ...product,
        count: productInStock.count,
      }),
    });
  });

  it("throws a bad request error if id was not given", async () => {
    await expect(
      getProductInStock({
        ...apiGatewayProxyEventTemplate,
        pathParameters: {},
      })
    ).rejects.toThrow(new httpError.BadRequest("Product id was not provided"));
  });

  it("throws a not found error if product with given id not found", async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [],
    });

    await expect(
      getProductInStock({
        ...apiGatewayProxyEventTemplate,
        pathParameters: {
          id: 3,
        },
      })
    ).rejects.toThrow(new httpError.NotFound('Product with id "3" not found'));
  });

  it("throws a not found error if product with given id exists, but not found in stock", async () => {
    const [product] = products;

    ddbMock.on(QueryCommand).resolves({
      Items: [product],
    });

    ddbMock.on(ScanCommand).resolves({
      Items: [],
    });

    await expect(
      getProductInStock({
        ...apiGatewayProxyEventTemplate,
        pathParameters: {
          id: 3,
        },
      })
    ).rejects.toThrow(
      new httpError.NotFound(`Product with id "3" not found in the stock`)
    );
  });
});
