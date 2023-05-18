import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductInStock`,
  events: [
    {
      http: {
        method: "get",
        path: "product/{id}",
      },
    },
  ],
};
