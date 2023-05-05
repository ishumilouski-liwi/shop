import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyResult, SQSEvent } from "aws-lambda";
import httpError, { HttpError } from "http-errors";
import { ProductStockService } from "@services/ProductStockService";
import { PublishCommand, SNS } from "@aws-sdk/client-sns";

/**
 * This handler creates products in stocks after receiving
 * messages from "CatalogBatchProcessQueue".
 */
export const catalogBatchProcess =
    async (
        event: SQSEvent
    ): Promise<APIGatewayProxyResult | HttpError> => {
        console.log("[Lambda invocation event]", JSON.stringify(event));

        const records = event.Records.map(record => JSON.parse(record.body));

        console.log("Received records: ", event.Records);

        const productStockService = new ProductStockService();

        try {
            const productsInStocks = await productStockService.batchCreateProductInStock(records);

            console.log("[Lambda Success]: Products were successfully processed");

            console.log('TOPIC ARN', process.env.CATALOG_BATCH_PROCESS_SNS_ARN)
            const sns = new SNS({});

            const messageCommand = new PublishCommand({
                Subject: 'New products were added to stock',
                Message: productsInStocks.map(item => item.title).join('\n'),
                TopicArn: process.env.CATALOG_BATCH_PROCESS_SNS_ARN,
                MessageAttributes: {
                    MessageScope: {
                        DataType: 'String',
                        StringValue: 'public'
                    }
                }
            })

            await sns.send(messageCommand);

            return formatJSONResponse(200, {});
        } catch (err) {
            console.log("[Lambda failed]: ", err);
            throw new httpError.InternalServerError();
        }
    }

