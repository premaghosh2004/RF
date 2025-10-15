import cloudinary, { uploadOptions } from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

export class CloudinaryService {
  static async uploadImage(
    buffer: Buffer,
    filename: string,
    type: 'images' | 'avatars' = 'images'
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          ...uploadOptions[type],
          public_id: `${Date.now()}-${filename.replace(/\.[^/.]+$/, "")}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );

      uploadStream.end(buffer);
    });
  }

  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  }

  static async uploadMultipleImages(
    files: { buffer: Buffer; originalname: string }[]
  ): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map(file =>
      this.uploadImage(file.buffer, file.originalname, 'images')
    );

    return Promise.all(uploadPromises);
  }
}
