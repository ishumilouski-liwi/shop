import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFromFile`,
  events: [
    {
      http: {
        method: "GET",
        path: "import",
        cors: true,
        authorizer: {
          arn: 'arn:aws:lambda:us-east-1:871667619597:function:shop-authorization-service-dev-basicAuthorizer',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization'
        },
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        }
      },
    },
  ],
};
