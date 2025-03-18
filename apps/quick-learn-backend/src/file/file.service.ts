import { Injectable } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  private readonly s3Client: S3Client;
  private endPoint: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = this.createS3Client();
  }

  private createS3Client(): S3Client {
    const region = this.configService.getOrThrow('file.awsS3Region', {
      infer: true,
    });
     this.endPoint = this.configService.getOrThrow<string>('file.endPoint', {
      infer: true,
    });
    const accessKeyId = this.configService.getOrThrow('file.accessKeyId', {
      infer: true,
    });
    const secretAccessKey = this.configService.getOrThrow(
      'file.secretAccessKey',
      { infer: true },
    );

    return new S3Client({
      region,
      endpoint: this.endPoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  private extractFileName(url: string) {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1);
  }

  async deleteFiles(fileKeys: string[]): Promise<void> {
    const deletePromises = fileKeys.map((url: string) => {
      if (!(url.startsWith(this.endPoint))) return null;
      const fileName = this.extractFileName(url);

      const params = {
        Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
        Key: fileName,
      };

      const deleteCommand = new DeleteObjectCommand(params);
      return this.s3Client.send(deleteCommand);
    });

    try {
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting files:', error);
      throw error;
    }
  }
}
