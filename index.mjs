import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const SUPPORTED_FORMATS = {
  jpg: true,
  jpeg: true,
  png: true,
};

const S3 = new S3Client();
const THUMBNAIL_WIDTH = 200; // pixels

export const handler = async (event) => {
  const srcBucket = event.srcBucket;
  const srcKey = event.srcKey;
  const destBucket = event.destBucket || process.env.DEST_BUCKET;

  if (!srcBucket || !srcKey || !destBucket) {
    const errorMsg = "Missing required parameters: srcBucket, srcKey, or destBucket.";
    console.log(errorMsg);
    return { statusCode: 400, body: errorMsg };
  }

  const ext = srcKey.replace(/^.*\./, "").toLowerCase();
  const eventTime = new Date().toISOString();
  console.log(`${eventTime} - Processing ${srcBucket}/${srcKey}`);

  if (!SUPPORTED_FORMATS[ext]) {
    const error = `ERROR: Unsupported file type (${ext})`;
    console.log(error);
    return { statusCode: 400, body: error };
  }

  try {
    const { Body, ContentType } = await S3.send(
      new GetObjectCommand({ Bucket: srcBucket, Key: srcKey })
    );

    const image = await Body.transformToByteArray();

    const outputBuffer = await sharp(image)
      .resize(THUMBNAIL_WIDTH)
      .toBuffer();

    await S3.send(
      new PutObjectCommand({
        Bucket: destBucket,
        Key: srcKey,
        Body: outputBuffer,
        ContentType,
      })
    );

    const message = `Successfully resized ${srcBucket}/${srcKey} and uploaded to ${destBucket}/${srcKey}`;
    console.log(message);
    return { statusCode: 200, body: message };
  } catch (error) {
    console.error("Error processing image:", error);
    return { statusCode: 500, body: error.message || "Error processing image." };
  }
};
