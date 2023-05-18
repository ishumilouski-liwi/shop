import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class ImportService {
  private client = new S3Client({})

  async generateSignedURL(fileName: string) {
    const path = `uploaded/${fileName}`;

    console.log(`Generate Signed URL for Bucket: ${process.env.UPLOADED_FILES_BUCKET}`);

    const command = new PutObjectCommand({
      Bucket: process.env.UPLOADED_FILES_BUCKET,
      Key: path,
      ContentType: 'text/csv'
    });

    return await getSignedUrl(this.client, command, { expiresIn: 360 });
  }
}
