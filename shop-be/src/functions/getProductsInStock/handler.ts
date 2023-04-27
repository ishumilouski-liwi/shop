import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyResult } from "aws-lambda";
import { Product } from "@models/Product";
import httpError, { HttpError } from "http-errors";
import { GET } from "@libs/lambda";
import { ProductStockService } from "@services/ProductStockService";

/**
 * Queries all products with their count in the stock
 */

export const getProductsInStock = GET(
  async (): Promise<APIGatewayProxyResult | HttpError> => {
    console.log("[Lambda invocation event]");

    try {
      const productStockService = new ProductStockService();

      const products = await productStockService.getProducts();

      const response = formatJSONResponse<Product[]>(200, products);
      console.log("[Lambda invocation result]: ", JSON.stringify(response));

      return response;
    } catch (err) {
      console.log("[Lambda invocation failed]: ", err.message);

      throw new httpError.InternalServerError();
    }
  }
);
