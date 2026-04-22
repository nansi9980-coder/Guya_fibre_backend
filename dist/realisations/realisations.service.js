"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealisationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const activity_log_service_1 = require("../logs/activity-log.service");
let RealisationsService = class RealisationsService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async create(createDto, userId, ipAddress) {
        const existing = await this.prisma.realisation.findUnique({
            where: { slug: createDto.slug },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Le slug "${createDto.slug}" existe déjà`);
        }
        const maxOrder = await this.prisma.realisation.aggregate({
            _max: { order: true },
        });
        const realisation = await this.prisma.realisation.create({
            data: {
                slug: createDto.slug,
                titleFr: createDto.titleFr,
                titleEn: createDto.titleEn,
                location: createDto.location,
                date: createDto.date,
                scope: createDto.scope,
                descFr: createDto.descFr,
                descEn: createDto.descEn,
                tags: createDto.tags,
                images: createDto.images,
                client: createDto.client,
                isFeatured: createDto.isFeatured || false,
                order: (maxOrder._max.order || 0) + 1,
            },
        });
        await this.activityLog.log({
            action: 'CREATE',
            entity: 'Realisation',
            entityId: realisation.id,
            description: `Réalisation "${realisation.titleFr}" créée`,
            userId,
            ipAddress,
        });
        return realisation;
    }
    async findAll(query) {
        const { page = 1, limit = 20, isActive, isFeatured, tag, location } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (isActive !== undefined)
            where.isActive = isActive;
        if (isFeatured !== undefined)
            where.isFeatured = isFeatured;
        if (tag)
            where.tags = { has: tag };
        if (location)
            where.location = { contains: location, mode: 'insensitive' };
        const [realisations, total] = await Promise.all([
            this.prisma.realisation.findMany({
                where,
                skip,
                take: limit,
                orderBy: { order: 'asc' },
            }),
            this.prisma.realisation.count({ where }),
        ]);
        return {
            data: realisations,
            meta: { total, page, perPage: limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const realisation = await this.prisma.realisation.findUnique({
            where: { id },
        });
        if (!realisation) {
            throw new common_1.NotFoundException(`Réalisation ${id} non trouvée`);
        }
        return realisation;
    }
    async findBySlug(slug) {
        const realisation = await this.prisma.realisation.findUnique({
            where: { slug },
        });
        if (!realisation) {
            throw new common_1.NotFoundException(`Réalisation ${slug} non trouvée`);
        }
        return realisation;
    }
    async update(id, updateDto, userId, ipAddress) {
        const realisation = await this.prisma.realisation.findUnique({ where: { id } });
        if (!realisation) {
            throw new common_1.NotFoundException(`Réalisation ${id} non trouvée`);
        }
        if (updateDto.slug && updateDto.slug !== realisation.slug) {
            const existing = await this.prisma.realisation.findUnique({
                where: { slug: updateDto.slug },
            });
            if (existing) {
                throw new common_1.BadRequestException(`Le slug "${updateDto.slug}" existe déjà`);
            }
        }
        const updated = await this.prisma.realisation.update({
            where: { id },
            data: updateDto,
        });
        await this.activityLog.log({
            action: 'UPDATE',
            entity: 'Realisation',
            entityId: id,
            description: `Réalisation "${updated.titleFr}" mise à jour`,
            userId,
            ipAddress,
        });
        return updated;
    }
    async remove(id, userId, ipAddress) {
        const realisation = await this.prisma.realisation.findUnique({ where: { id } });
        if (!realisation) {
            throw new common_1.NotFoundException(`Réalisation ${id} non trouvée`);
        }
        await this.prisma.realisation.delete({ where: { id } });
        await this.activityLog.log({
            action: 'DELETE',
            entity: 'Realisation',
            entityId: id,
            description: `Réalisation "${realisation.titleFr}" supprimée`,
            userId,
            ipAddress,
        });
        return { message: 'Réalisation supprimée avec succès' };
    }
    async toggle(id, userId, ipAddress) {
        const realisation = await this.prisma.realisation.findUnique({ where: { id } });
        if (!realisation) {
            throw new common_1.NotFoundException(`Réalisation ${id} non trouvée`);
        }
        const updated = await this.prisma.realisation.update({
            where: { id },
            data: { isActive: !realisation.isActive },
        });
        await this.activityLog.log({
            action: 'TOGGLE',
            entity: 'Realisation',
            entityId: id,
            description: `Réalisation "${updated.titleFr}" ${updated.isActive ? 'activée' : 'désactivée'}`,
            userId,
            ipAddress,
        });
        return updated;
    }
    async toggleFeatured(id, userId, ipAddress) {
        const realisation = await this.prisma.realisation.findUnique({ where: { id } });
        if (!realisation) {
            throw new common_1.NotFoundException(`Réalisation ${id} non trouvée`);
        }
        const updated = await this.prisma.realisation.update({
            where: { id },
            data: { isFeatured: !realisation.isFeatured },
        });
        await this.activityLog.log({
            action: 'FEATURED_TOGGLE',
            entity: 'Realisation',
            entityId: id,
            description: `Réalisation "${updated.titleFr}" ${updated.isFeatured ? 'mise en avant' : 'retirée de la une'}`,
            userId,
            ipAddress,
        });
        return updated;
    }
};
exports.RealisationsService = RealisationsService;
exports.RealisationsService = RealisationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], RealisationsService);
//# sourceMappingURL=realisations.service.js.map