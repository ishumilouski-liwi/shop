import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Product } from "@models/Product";
import { GET } from "@libs/lambda";
import httpError, { HttpError } from "http-errors";
import { ProductStockService } from "@services/ProductStockService";

export const getProductInStock = GET(
  async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult | HttpError> => {
    console.log("[Lambda invocation event]", JSON.stringify(event));

    const { id } = event.pathParameters;

    if (!id) {
      const error = "Product id was not provided";
      console.log("[Lambda invocation failed]: ", error);

      throw new httpError.BadRequest(error);
    }

    const productStockService = new ProductStockService();

    const product = await productStockService.getProduct(id);

    if (!product) {
      throw new httpError.NotFound(`Product with id '${id}' not found`);
    }

    const response = formatJSONResponse<Product>(200, product);
    console.log("[Lambda invocation result]: ", JSON.stringify(response));

    return response;
  }
);
