import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import DataURIParser = require('datauri/parser');
import * as path from 'path';

@Injectable()
export class CloudinaryConfigService {
  private Cloudinary: any;

  constructor(private configService: ConfigService) {
    this.Cloudinary = cloudinary.v2;
    this.Cloudinary.config({
      // eslint-disable-next-line @typescript-eslint/camelcase
      cloud_name: configService.get('CLOUDINARY_NAME'),
      // eslint-disable-next-line @typescript-eslint/camelcase
      api_key: configService.get('CLOUDINARY_KEY'),
      // eslint-disable-next-line @typescript-eslint/camelcase
      api_secret: configService.get('CLOUDINARY_SECRET'),
    });
  }

  async uploadBase64File(file, filename, folder = ''): Promise<{ fileUrl: string, fileId: string }> {
    const parser = new DataURIParser();
    const fileData = parser.format(path.extname(filename).toString(), file).content;
    const res = await this.Cloudinary.uploader.upload(fileData, {
      folder,
      // eslint-disable-next-line @typescript-eslint/camelcase
      resource_type: 'auto',
      // eslint-disable-next-line @typescript-eslint/camelcase
      use_filename: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      public_id: this.formatFileName(filename),
      overwrite: false,
    });
    return { fileUrl: res['secure_url'], fileId: res['public_id'] };
  }

  deleteFile(fileId: string) {
    return this.Cloudinary.uploader.destroy(fileId);
  }

  formatFileName(name) {
    const dotIndex = name.lastIndexOf('.');
    const ext = name.substr(dotIndex + 1);
    return name
      .substr(0, dotIndex)
      .replace(/[^a-zA-Z0-9]/g, '-') + '-' + Date.now() + '.' + ext;
  };

}
