import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
  private uploadDir: string;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {
    this.uploadDir = this.config.get('UPLOAD_DIR') || './uploads';
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: any, folder: string = 'general', userId: string, ipAddress?: string) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non autorisé: ${file.mimetype}. Types acceptés: images, vidéos, PDF, documents, archives.`
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('Fichier trop volumineux. Taille max: 100MB');
    }

    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    // Thumbnail uniquement pour les images
    const isImage = file.mimetype.startsWith('image/');
    const thumbnailUrl = isImage ? `/api/medias/file/${filename}` : null;

    const media = await this.prisma.media.create({
      data: {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/api/medias/file/${filename}`,
        thumbnailUrl,
        folder,
        uploadedById: userId,
      },
    });

    await this.activityLog.log({
      action: 'UPLOAD',
      entity: 'Media',
      entityId: media.id,
      description: `Fichier "${file.originalname}" uploadé (${file.mimetype})`,
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
    const { page = 1, limit = 50, folder, search, mimeType } = query;
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

  async getFile(filename: string): Promise<{ stream: fs.ReadStream; mimeType: string }> {
    const filepath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filepath)) {
      throw new NotFoundException('Fichier non trouvé');
    }

    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      // Images
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      // Vidéos
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.webm': 'video/webm',
      '.mkv': 'video/x-matroska',
      '.3gp': 'video/3gpp',
      // Documents
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Archives
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      // Audio
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      // Texte
      '.txt': 'text/plain',
      '.csv': 'text/csv',
    };

    return {
      stream: fs.createReadStream(filepath),
      mimeType: mimeTypes[ext] || 'application/octet-stream',
    };
  }

  async remove(id: string, userId: string, userRole: string, ipAddress?: string) {
    if (userRole !== 'SUPER_ADMIN') {
      throw new BadRequestException('Seuls les SUPER_ADMIN peuvent supprimer des médias');
    }

    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Média ${id} non trouvé`);
    }

    const filepath = path.join(this.uploadDir, media.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

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