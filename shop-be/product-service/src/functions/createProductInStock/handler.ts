import { formatJSONResponse } from "@libs/api-gateway";
import { PUT } from "@libs/lambda";
import schema from "./schema";
import { ProductService } from "@services/ProductService";
import { StockService } from "@services/StockService";
import crypto from "crypto";

export const createProductInStock = PUT<typeof schema>(async (event) => {
  console.log("[Lambda invocation event]", JSON.stringify(event));

  const productId = crypto.randomUUID();

  const productService = new ProductService();
  const stockService = new StockService();

  await Promise.all([
    productService.addProduct({
      id: productId,
      title: event.body.title,
      description: event.body.description,
      price: event.body.price,
    }),
    stockService.addItem(productId, event.body.count),
  ]);

  const response = formatJSONResponse(200, {});

  console.log("[Lambda invocation result]: ", JSON.stringify(response));

  return response;
});
