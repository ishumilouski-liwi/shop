import { formatJSONResponse } from "@libs/api-gateway";
import { PUT } from "@libs/lambda";
import schema from "./schema";
import crypto from "crypto";
import { ProductStockService } from "@services/ProductStockService";

export const upsertProductInStock = PUT<typeof schema>(async (event) => {
  console.log("[Lambda invocation event]", JSON.stringify(event));

  const productId = crypto.randomUUID();

  const productStockService = new ProductStockService();

  await productStockService.createProductInStock(
    {
      id: productId,
      title: event.body.title,
      description: event.body.description,
      price: event.body.price,
    },
    {
      productId,
      count: event.body.count
    }
  )

  const response = formatJSONResponse(200, {});

  console.log("[Lambda invocation result]: ", JSON.stringify(response));

  return response;
});
