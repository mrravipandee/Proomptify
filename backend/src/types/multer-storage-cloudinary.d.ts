declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";
  import { v2 as cloudinary } from "cloudinary";

  interface CloudinaryStorageOptions {
    cloudinary: typeof cloudinary;
    params?: 
      | {
          folder?: string;
          format?: string;
          public_id?: string;
          allowed_formats?: string[];
          transformation?: any[];
          [key: string]: any;
        }
      | ((req: any, file: any) => Promise<{
          folder?: string;
          format?: string;
          public_id?: string;
          allowed_formats?: string[];
          transformation?: any[];
          [key: string]: any;
        }>);
  }

  class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(req: any, file: any, callback: (error?: any, info?: any) => void): void;
    _removeFile(req: any, file: any, callback: (error: Error | null) => void): void;
  }

  export = CloudinaryStorage;
}
