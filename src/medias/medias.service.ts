import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/bmp',
  'image/tiff',
  // Vidéos
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/ogg',
  'video/x-matroska',
  'video/3gpp',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-zip-compressed',
  // Audio
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  // Texte
  'text/plain',
  'text/csv',
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

@Injectable()
export class MediasService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
    private cloudinary: CloudinaryService,
  ) {}

  async upload(file: any, folder: string = 'general', userId: string, ipAddress?: string) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non autorisé: ${file.mimetype}. Types acceptés: images, vidéos, PDF, documents, archives.`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('Fichier trop volumineux. Taille max: 100MB');
    }

    // ✅ Upload sur Cloudinary (stockage persistant + CDN)
    const uploaded = await this.cloudinary.uploadFile(
      { buffer: file.buffer, mimetype: file.mimetype, originalname: file.originalname },
      folder,
    );

    const isImage = file.mimetype.startsWith('image/');

    const media = await this.prisma.media.create({
      data: {
        filename: uploaded.publicId, // on stocke le publicId Cloudinary
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: uploaded.url, // URL absolue Cloudinary (https://res.cloudinary.com/...)
        thumbnailUrl: isImage ? uploaded.url : null,
        folder,
        uploadedById: userId,
      },
    });

    await this.activityLog.log({
      action: 'UPLOAD',
      entity: 'Media',
      entityId: media.id,
      description: `Fichier "${file.originalname}" uploadé sur Cloudinary (${file.mimetype})`,
      userId,
      ipAddress,
    });

    return media;
  }

  async uploadMultiple(files: any[], folder: string = 'general', userId: string, ipAddress?: string) {
    const results = [];
    for (const file of files) {
      try {
        const media = await this.upload(file, folder, userId, ipAddress);
        results.push(media);
      } catch (error) {
        console.error(`Error uploading file ${file.originalname}:`, error);
      }
    }
    return results;
  }

  async findAll(query: { page?: number; limit?: number; folder?: string; search?: string; mimeType?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
    const { folder, search, mimeType } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (folder) where.folder = folder;
    if (mimeType) where.mimeType = { contains: mimeType };
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { filename: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [medias, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data: medias,
      meta: { total, page, perPage: limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!media) {
      throw new NotFoundException(`Média ${id} non trouvé`);
    }
    return media;
  }

  async remove(id: string, userId: string, userRole: string, ipAddress?: string) {
    if (userRole !== 'SUPER_ADMIN') {
      throw new BadRequestException('Seuls les SUPER_ADMIN peuvent supprimer des médias');
    }

    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Média ${id} non trouvé`);
    }

    // ✅ Supprimer sur Cloudinary aussi
    let resourceType: 'image' | 'video' | 'raw' = 'raw';
    if (media.mimeType.startsWith('image/')) resourceType = 'image';
    else if (media.mimeType.startsWith('video/')) resourceType = 'video';

    // filename contient le publicId Cloudinary
    await this.cloudinary.deleteFile(media.filename, resourceType);

    await this.prisma.media.delete({ where: { id } });

    await this.activityLog.log({
      action: 'DELETE',
      entity: 'Media',
      entityId: id,
      description: `Fichier "${media.originalName}" supprimé`,
      userId,
      ipAddress,
    });

    return { message: 'Média supprimé avec succès' };
  }
}