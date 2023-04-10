import { apiGatewayProxyEventTemplate } from "@libs/lambda";
import httpError from "http-errors";
import products from "@services/products.json";

import { main as getProduct } from "./handler";

describe("getProduct", () => {
  it("returns a product when id is given", async () => {
    const product = products[1];

    const response = await getProduct({
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
      body: JSON.stringify(product),
    });
  });

  it("throws a bad request error if id was not given", async () => {
    await expect(
      getProduct({
        ...apiGatewayProxyEventTemplate,
        pathParameters: {},
      })
    ).rejects.toThrow(new httpError.BadRequest("Product id was not provided"));
  });

  it("throws a not found error if product with given id not found", async () => {
    await expect(
      getProduct({
        ...apiGatewayProxyEventTemplate,
        pathParameters: {
          id: 3,
        },
      })
    ).rejects.toThrow(new httpError.NotFound("Product with id '3' not found"));
  });
});
