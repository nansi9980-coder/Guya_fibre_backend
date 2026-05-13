import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

@Injectable()
export class CloudinaryService {
  /**
   * Upload un fichier depuis un buffer mémoire vers Cloudinary.
   * Fonctionne pour images, vidéos et tout autre type (en mode "raw").
   */
  async uploadFile(
    file: { buffer: Buffer; mimetype: string; originalname: string },
    folder: string = 'general',
  ): Promise<CloudinaryUploadResult> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Cloudinary distingue 3 types : image, video, raw (le reste)
    let resourceType: 'image' | 'video' | 'raw' = 'raw';
    if (file.mimetype.startsWith('image/')) resourceType = 'image';
    else if (file.mimetype.startsWith('video/')) resourceType = 'video';

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `guya-fibre/${folder}`,
          resource_type: resourceType,
          // Génère un nom unique pour éviter les collisions
          use_filename: false,
          unique_filename: true,
          overwrite: false,
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(error || new Error('Upload Cloudinary échoué'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
          });
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Supprime un fichier sur Cloudinary à partir de son publicId.
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
      // On log mais on ne bloque pas : si le fichier n'existe plus côté Cloudinary,
      // il faut quand même pouvoir supprimer en DB.
      console.error('[Cloudinary] delete error:', err);
    }
  }
}