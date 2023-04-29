import { formatJSONResponse } from "@libs/api-gateway";
import { GET } from "@libs/lambda";
import { ImportService } from "@services/ImportService";

export const importProductsFromFile = GET(async (event) => {
  console.log("[Lambda invocation event]", JSON.stringify(event));

  try {
    const { name } = event.queryStringParameters;

    const importService = new ImportService();

    const url = await importService.generateSignedURL(name);
    console.log(`Generate Presigned URL for Bucket: ${process.env.BUCKET_NAME}`);
    console.log("[Lambda invocation result]: ", JSON.stringify(url));

    return formatJSONResponse(200, url);
  } catch (err) {
    console.log("[Lambda invocation failed]: ", JSON.stringify(err));

    return formatJSONResponse(500, {
      ok: false
    })
  }
});
