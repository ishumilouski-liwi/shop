import { apiGatewayProxyEventTemplate } from "@libs/lambda";
import httpError from "http-errors";
import products from "@services/products.json";

import { main as getAllProducts } from "./handler";
import { ProductService } from "@services/ProductService";

describe("getAllProducts", () => {
  it("returns all products when request is valid", async () => {
    const response = await getAllProducts(apiGatewayProxyEventTemplate);

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(products),
    });
  });

  it("throws an internal server error if products were not loaded correctly", async () => {
    jest
      .spyOn(ProductService.prototype, "getProducts")
      .mockImplementationOnce(() => Promise.reject(new Error("Unknown error")));

    await expect(getAllProducts(apiGatewayProxyEventTemplate)).rejects.toThrow(
      new httpError.InternalServerError()
    );
  });
});
