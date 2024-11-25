import { Injectable } from "@nestjs/common";
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class FileService {
    private s3Client: S3Client;
    static deleteFiles: unknown;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_S3_REGION,
            endpoint: process.env.AWS_Endpoint,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
        });
    }

    async deleteFiles(fileKeys: string[]): Promise<void> {

        const extractFileName = (url: string) => {
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            return path.substring(1);
        };

        const deletePromises = fileKeys.map((url: string) => {
            const fileName = extractFileName(url);
            
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