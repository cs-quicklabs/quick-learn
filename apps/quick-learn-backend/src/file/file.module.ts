import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/config/config.type';
import multerS3 from 'multer-s3';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { S3Client } from '@aws-sdk/client-s3';
import { FileService } from './fileService.service';

function getS3Key(request, file) {
  const imagePath = request.query?.path;
  const path = imagePath ? imagePath : 'images';
  return `${path}/${randomStringGenerator()}.${file.originalname
    .split('.')
    .pop()
    ?.toLowerCase()}`;
}

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const s3 = new S3Client({
          endpoint: configService.get('file.endPoint', { infer: true }),
          forcePathStyle: false,
          region: configService.get('file.awsS3Region', { infer: true }),
          credentials: {
            accessKeyId: configService.getOrThrow('file.accessKeyId', {
              infer: true,
            }),
            secretAccessKey: configService.getOrThrow('file.secretAccessKey', {
              infer: true,
            }),
          },
        });

        return {
          fileFilter: (request, file, callback) => {
            const mime = file.mimetype;
            if (!mime || !mime.startsWith('image/')) {
              return callback(
                new UnprocessableEntityException({
                  statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                  error: 'File type is not allowed.',
                }),
                false,
              );
            }

            callback(null, true);
          },
          storage: multerS3({
            s3: s3,
            bucket: configService.get('file.awsDefaultS3Bucket', {
              infer: true,
            }),
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            metadata: function (req, file, cb) {
              cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
              const keyPath = getS3Key(req, file);
              cb(null, keyPath);
            },
          }),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [FileController],
  exports: [FileService],
  providers: [FileService],
})
export class FileModule {}
