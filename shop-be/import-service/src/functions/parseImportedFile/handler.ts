import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { formatJSONResponse } from "@libs/api-gateway";
import { S3Event } from "aws-lambda";
import csvParser from "csv-parser";
import { Readable } from "stream";

export const parseImportedFile = async (event: S3Event) => {
  console.log("[Lambda invocation event]", JSON.stringify(event));

  const client = new S3Client({});

  try {
    for (const record of event.Records) {
      const command = new GetObjectCommand({
        Bucket: process.env.UPLOADED_FILES_BUCKET,
        Key: record.s3.object.key,
      });

      const response = await client.send(command);

      await new Promise(resolve => {
        (response.Body as Readable).pipe(csvParser()).on('data', data => {
          console.log("[Lambda Event]: Read data from CSV file: ", data)
        }).on('end', () => {
          console.log(`[Lambda Event]: Finished parsing ${record.s3.object.key}`);
          resolve(null);
        });
      })

      const fileName = record.s3.object.key.replace(`${process.env.UPLOADED_FILES_FOLDER}/`, '');

      try {
        const copyCommand = new CopyObjectCommand({
          CopySource: `${process.env.UPLOADED_FILES_BUCKET}/${record.s3.object.key}`,
          Bucket: process.env.PARSED_FILES_BUCKET,
          Key: `${process.env.PARSED_FILES_FOLDER}/${fileName}`,
        });

        console.log(`[Lambda Event]: Attempt to copy ${record.s3.object.key} to ${process.env.PARSED_FILES_FOLDER}/${fileName}`);

        await client.send(copyCommand);
        console.log(`[Lambda Event]: File ${record.s3.object.key} copied to ${process.env.PARSED_FILES_FOLDER}/${fileName}`);
      } catch (err) {
        console.log(`[Lambda Event]: failed to copy ${record.s3.object.key}`);
      }

      try {
        console.log(`[Lambda Event]: Attempt to delete file ${record.s3.object.key} from bucket ${process.env.UPLOADED_FILES_BUCKET}`);
        
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.UPLOADED_FILES_BUCKET,
          Key: record.s3.object.key
        })
  
        await client.send(deleteCommand);
  
        console.log(`[Lambda Event]: File ${record.s3.object.key} was deleted from bucket ${process.env.UPLOADED_FILES_BUCKET}`);
      } catch (err) {
        console.log(`[Lambda Event]: failed to delete ${record.s3.object.key}`);
      }

      return formatJSONResponse(200, {
        ok: true
      });
    }
  } catch (err) {
    console.log(`[Lambda Invokation failed]: ${err}`);

    return formatJSONResponse(500, {
      ok: false,
      error: err
    })
  }
};
