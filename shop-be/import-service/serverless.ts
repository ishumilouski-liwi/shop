import type { AWS } from "@serverless/typescript";

import { importProductsFromFile } from './src/functions'

const serverlessConfiguration: AWS = {
  service: "shop-product-import-service",
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
      serverSideEncryption: "AES256",
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      UPLOADED_FILES_BUCKET: 'shop-uploaded-files-bucket'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [
          'arn:aws:s3:::${self:provider.environment.UPLOADED_FILES_BUCKET}/*'
        ]
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFromFile },
  package: { individually: true },
  resources: {
    Resources: {
      'S3Bucket': {
        Type: 'AWS::S3::Bucket',
        Properties: {
          PublicAccessBlockConfiguration: {
            BlockPublicPolicy: false,
          },
          BucketName: '${self:provider.environment.UPLOADED_FILES_BUCKET}',
          OwnershipControls: {
            Rules: [{
              ObjectOwnership: 'ObjectWriter'
            }]
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT'],
                AllowedOrigins: ['*']
              }
            ]
          }
        },
      },
      S3BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: {
            Ref: 'S3Bucket'
          },
          PolicyDocument: {
            Statement: [{
              Effect: 'Allow',
              Action: ['s3:*'],
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:aws:s3:::',
                    {
                      Ref: 'S3Bucket',
                    },
                    '/*'
                  ]
                ]
              },
              Principal: "*"
            }]
          },
        }
      },
    },
    Outputs: {
      BucketName: {
        Value: '!Ref S3Bucket'
      }
    }
  },
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
