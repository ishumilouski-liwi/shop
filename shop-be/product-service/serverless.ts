import type { AWS } from "@serverless/typescript";

import getProductsInStock from "@functions/getProductsInStock";
import getProductInStock from "@functions/getProductInStock";
import upsertProductInStock from "@functions/upsertProductInStock";

const serverlessConfiguration: AWS = {
  service: "shop-product-service",
  frameworkVersion: "3",
  plugins: [
    "serverless-auto-swagger",
    "serverless-esbuild",
    "serverless-offline",
    "serverless-jest-plugin",
    "serverless-deployment-bucket"
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: 'us-east-1',
    deploymentBucket: {
      name: '${self:service}',
      serverSideEncryption: "AES256"
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Scan',
          'dynamodb:PutItem',
          'dynamodb:Query',
        ],
        Resource: [
          'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DB_PRODUCTS_TABLE_NAME}',
          'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DB_STOCK_TABLE_NAME}',
        ]
      },
    ],
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
  functions: { getProductsInStock, getProductInStock, upsertProductInStock },
  package: { individually: true },
  custom: {
    autoswagger: {
      typefiles: ['./src/models/Product.ts', './src/models/ProductInStock.ts', './src/models/Stock.ts', './src/api.types.ts']
    },
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
