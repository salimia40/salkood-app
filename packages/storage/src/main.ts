import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class Storage {
  private readonly client: S3Client;
  constructor(
    endpoint: string,
    accessKeyId: string,
    secretAccessKey: string,
    private readonly bucket: string,
  ) {
    this.client = new S3Client({
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucket = bucket;
  }

  exists(key: string) {
    return this.client
      .send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      )
      .then(() => true)
      .catch(() => false);
  }

  get(key: string) {
    return this.client
      .send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      )
      .then((res) => res.Body);
  }

  put(key: string, body: Buffer) {
    return this.client
      .send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
        }),
      )
      .then(() => true);
  }

  delete(key: string) {
    return this.client
      .send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      )
      .then(() => true);
  }

  getSignedUrl(key: string) {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      {
        expiresIn: 3600,
      },
    );
  }
}
