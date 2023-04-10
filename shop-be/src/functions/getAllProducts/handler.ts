import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyResult } from "aws-lambda";
import { Product } from "@models/Product";
import { productService } from "@services";
import httpError, { HttpError } from "http-errors";
import { GET } from "@libs/lambda";

/**
 * Fetches all available products
 */
const getAllProducts = async (): Promise<APIGatewayProxyResult | HttpError> => {
  console.log("[Lambda invocation event]");

  try {
    const products = await productService.getProducts();

    const response = formatJSONResponse<Product[]>(200, products);
    console.log("[Lambda invocation result]: ", JSON.stringify(response));

    return response;
  } catch (err) {
    console.log("[Lambda invocation failed]: ", err.message);

    throw new httpError.InternalServerError();
  }
};

export const main = GET(getAllProducts);
