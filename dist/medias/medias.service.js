"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediasService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const activity_log_service_1 = require("../logs/activity-log.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    'video/ogg',
    'video/x-matroska',
    'video/3gpp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-zip-compressed',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'text/plain',
    'text/csv',
];
const MAX_FILE_SIZE = 100 * 1024 * 1024;
let MediasService = class MediasService {
    constructor(config, prisma, activityLog) {
        this.config = config;
        this.prisma = prisma;
        this.activityLog = activityLog;
        this.uploadDir = this.config.get('UPLOAD_DIR') || './uploads';
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async upload(file, folder = 'general', userId, ipAddress) {
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Type de fichier non autorisé: ${file.mimetype}. Types acceptés: images, vidéos, PDF, documents, archives.`);
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new common_1.BadRequestException('Fichier trop volumineux. Taille max: 100MB');
        }
        const ext = path.extname(file.originalname);
        const filename = `${(0, uuid_1.v4)()}${ext}`;
        const filepath = path.join(this.uploadDir, filename);
        fs.writeFileSync(filepath, file.buffer);
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
    async uploadMultiple(files, folder = 'general', userId, ipAddress) {
        const results = [];
        for (const file of files) {
            try {
                const media = await this.upload(file, folder, userId, ipAddress);
                results.push(media);
            }
            catch (error) {
                console.error(`Error uploading file ${file.originalname}:`, error);
            }
        }
        return results;
    }
    async findAll(query) {
        const { page = 1, limit = 50, folder, search, mimeType } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (folder)
            where.folder = folder;
        if (mimeType)
            where.mimeType = { contains: mimeType };
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
    async findOne(id) {
        const media = await this.prisma.media.findUnique({
            where: { id },
            include: {
                uploadedBy: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
        if (!media) {
            throw new common_1.NotFoundException(`Média ${id} non trouvé`);
        }
        return media;
    }
    async getFile(filename) {
        const filepath = path.join(this.uploadDir, filename);
        if (!fs.existsSync(filepath)) {
            throw new common_1.NotFoundException('Fichier non trouvé');
        }
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.gif': 'image/gif',
            '.bmp': 'image/bmp',
            '.mp4': 'video/mp4',
            '.mov': 'video/quicktime',
            '.avi': 'video/x-msvideo',
            '.webm': 'video/webm',
            '.mkv': 'video/x-matroska',
            '.3gp': 'video/3gpp',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.zip': 'application/zip',
            '.rar': 'application/x-rar-compressed',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.txt': 'text/plain',
            '.csv': 'text/csv',
        };
        return {
            stream: fs.createReadStream(filepath),
            mimeType: mimeTypes[ext] || 'application/octet-stream',
        };
    }
    async remove(id, userId, userRole, ipAddress) {
        if (userRole !== 'SUPER_ADMIN') {
            throw new common_1.BadRequestException('Seuls les SUPER_ADMIN peuvent supprimer des médias');
        }
        const media = await this.prisma.media.findUnique({ where: { id } });
        if (!media) {
            throw new common_1.NotFoundException(`Média ${id} non trouvé`);
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
};
exports.MediasService = MediasService;
exports.MediasService = MediasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], MediasService);
//# sourceMappingURL=medias.service.js.map