import type { AWS } from "@serverless/typescript";

import getProductsInStock from "@functions/getProductsInStock";
import getProductInStock from "@functions/getProductInStock";
import createProductInStock from "@functions/createProductInStock";

const serverlessConfiguration: AWS = {
  service: "shop-be",
  frameworkVersion: "3",
  plugins: [
    "serverless-auto-swagger",
    "serverless-esbuild",
    "serverless-offline",
    "serverless-jest-plugin",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      DB_PRODUCTS_TABLE_NAME: "${ssm:/system/api/DB_PRODUCTS_TABLE_NAME}",
      DB_STOCK_TABLE_NAME: "${ssm:/system/api/DB_STOCK_TABLE_NAME}",
    },
  },
  // import the function via paths
  functions: { getProductsInStock, getProductInStock, createProductInStock },
  package: { individually: true },
  custom: {
    jest: {},
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
