import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.parseImportedFile`,
  events: [
    {
      s3: {
        bucket: '${self:provider.environment.UPLOADED_FILES_BUCKET}',
        event: 's3:ObjectCreated:*',
        rules: [{
          prefix: '${self:provider.environment.UPLOADED_FILES_FOLDER}/'
        }],
        existing: true
      },
    },
  ],
};
