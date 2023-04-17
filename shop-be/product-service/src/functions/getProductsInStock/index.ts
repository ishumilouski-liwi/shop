import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsInStock`,
  events: [
    {
      http: {
        method: "get",
        path: "product/available",
        cors: true,
      },
    },
  ],
};
