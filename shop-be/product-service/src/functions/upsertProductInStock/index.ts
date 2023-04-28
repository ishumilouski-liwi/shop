import { handlerPath } from "@libs/handler-resolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.upsertProductInStock`,
  events: [
    {
      http: {
        method: "PUT",
        path: "product",
        cors: true,
        bodyType: 'PutUpsertProductInStockBody',
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};