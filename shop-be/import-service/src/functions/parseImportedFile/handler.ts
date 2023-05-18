import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GetQueueUrlCommand, SQS, SendMessageCommand } from "@aws-sdk/client-sqs";
import { formatJSONResponse } from "@libs/api-gateway";
import { S3Event, S3EventRecord } from "aws-lambda";
import csvParser from "csv-parser";
import { Readable } from "stream";

export const parseImportedFile = async (event: S3Event) => {
  console.log("[Lambda invocation event]", JSON.stringify(event));

  const client = new S3Client({});
  const sqs = new SQS({});

  const sendFileDataToMessageQueue = async (data: any) => {
    const { QueueUrl } = await sqs.send(new GetQueueUrlCommand({
      QueueName: process.env.CATALOG_BATCH_PROCESS_QUEUE,
    }));

    try {
      await sqs.send(new SendMessageCommand({
        QueueUrl,
        MessageBody: JSON.stringify(data)
      }))

      console.log(`Sent message containing "${JSON.stringify(data)}" to queue "${process.env.CATALOG_BATCH_PROCESS_QUEUE}"`)
    } catch (err) {
      console.log(`Failed to send message to queue "${process.env.CATALOG_BATCH_PROCESS_QUEUE}"`, err);
    }
  }

  const copyFileToProcessedFolder = async (record: S3EventRecord) => {
    try {
      const fileName = record.s3.object.key.replace(`${process.env.UPLOADED_FILES_FOLDER}/`, '');

      const copyCommand = new CopyObjectCommand({
        CopySource: `${process.env.UPLOADED_FILES_BUCKET}/${record.s3.object.key}`,
        Bucket: process.env.PARSED_FILES_BUCKET,
        Key: `${process.env.PARSED_FILES_FOLDER}/${fileName}`,
      });

      console.log(`Attempt to copy ${record.s3.object.key} to ${process.env.PARSED_FILES_FOLDER}/${fileName}`);

      await client.send(copyCommand);
      console.log(`File ${record.s3.object.key} copied to ${process.env.PARSED_FILES_FOLDER}/${fileName}`);
    } catch (err) {
      throw new Error(`Failed to copy ${record.s3.object.key}`)
    }
  }

  const deleteOriginalFile = async (record: S3EventRecord) => {
    try {
      console.log(`Attempt to delete file ${record.s3.object.key} from bucket ${process.env.UPLOADED_FILES_BUCKET}`);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.UPLOADED_FILES_BUCKET,
        Key: record.s3.object.key
      })

      await client.send(deleteCommand);

      console.log(`File ${record.s3.object.key} was deleted from bucket ${process.env.UPLOADED_FILES_BUCKET}`);
    } catch (err) {
      console.log(`[Failed to delete ${record.s3.object.key}`);
    }
  }

  try {
    for (const record of event.Records) {
      const command = new GetObjectCommand({
        Bucket: process.env.UPLOADED_FILES_BUCKET,
        Key: record.s3.object.key,
      });

      const response = await client.send(command);

      await new Promise(resolve => (response.Body as Readable).pipe(csvParser({
        separator: '\;'
      })).on('data', async data => {
        console.log("Read data from CSV file: ", data);

        await sendFileDataToMessageQueue(data);
      }).on('end', async () => {
        console.log(`Finished parsing ${record.s3.object.key}`);

        resolve(null);
      }));

      await copyFileToProcessedFolder(record);
      await deleteOriginalFile(record);

      return formatJSONResponse(200, {
        ok: true
      });
    }
  } catch (err) {
    console.log(`[Lambda Failed]: ${err}`);

    return formatJSONResponse(500, {
      ok: false,
      error: err.message
    })
  }
};
