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
exports.ServicesContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const activity_log_service_1 = require("../logs/activity-log.service");
let ServicesContentService = class ServicesContentService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async create(createDto, userId, ipAddress) {
        const existing = await this.prisma.serviceContent.findUnique({
            where: { slug: createDto.slug },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Le slug "${createDto.slug}" existe déjà`);
        }
        const maxOrder = await this.prisma.serviceContent.aggregate({
            _max: { order: true },
        });
        const service = await this.prisma.serviceContent.create({
            data: {
                slug: createDto.slug,
                number: createDto.number,
                icon: createDto.icon,
                titleFr: createDto.titleFr,
                titleEn: createDto.titleEn,
                titleEs: createDto.titleEs,
                titlePt: createDto.titlePt,
                titleNl: createDto.titleNl,
                titleGcr: createDto.titleGcr,
                descFr: createDto.descFr,
                descEn: createDto.descEn,
                features: createDto.features,
                image: createDto.image,
                benefit: createDto.benefit,
                order: (maxOrder._max.order || 0) + 1,
            },
        });
        await this.activityLog.log({
            action: 'CREATE',
            entity: 'Service',
            entityId: service.id,
            description: `Service "${service.titleFr}" créé`,
            userId,
            ipAddress,
        });
        return service;
    }
    async findAll(isActive) {
        const where = {};
        if (isActive !== undefined)
            where.isActive = isActive;
        return this.prisma.serviceContent.findMany({
            where,
            orderBy: { order: 'asc' },
        });
    }
    async findOne(id) {
        const service = await this.prisma.serviceContent.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service ${id} non trouvé`);
        }
        return service;
    }
    async findBySlug(slug) {
        const service = await this.prisma.serviceContent.findUnique({
            where: { slug },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service ${slug} non trouvé`);
        }
        return service;
    }
    async update(id, updateDto, userId, ipAddress) {
        const service = await this.prisma.serviceContent.findUnique({ where: { id } });
        if (!service) {
            throw new common_1.NotFoundException(`Service ${id} non trouvé`);
        }
        if (updateDto.slug && updateDto.slug !== service.slug) {
            const existing = await this.prisma.serviceContent.findUnique({
                where: { slug: updateDto.slug },
            });
            if (existing) {
                throw new common_1.BadRequestException(`Le slug "${updateDto.slug}" existe déjà`);
            }
        }
        const updated = await this.prisma.serviceContent.update({
            where: { id },
            data: updateDto,
        });
        await this.activityLog.log({
            action: 'UPDATE',
            entity: 'Service',
            entityId: id,
            description: `Service "${updated.titleFr}" mis à jour`,
            userId,
            ipAddress,
        });
        return updated;
    }
    async remove(id, userId, ipAddress) {
        const service = await this.prisma.serviceContent.findUnique({ where: { id } });
        if (!service) {
            throw new common_1.NotFoundException(`Service ${id} non trouvé`);
        }
        await this.prisma.serviceContent.delete({ where: { id } });
        await this.activityLog.log({
            action: 'DELETE',
            entity: 'Service',
            entityId: id,
            description: `Service "${service.titleFr}" supprimé`,
            userId,
            ipAddress,
        });
        return { message: 'Service supprimé avec succès' };
    }
    async toggle(id, userId, ipAddress) {
        const service = await this.prisma.serviceContent.findUnique({ where: { id } });
        if (!service) {
            throw new common_1.NotFoundException(`Service ${id} non trouvé`);
        }
        const updated = await this.prisma.serviceContent.update({
            where: { id },
            data: { isActive: !service.isActive },
        });
        await this.activityLog.log({
            action: 'TOGGLE',
            entity: 'Service',
            entityId: id,
            description: `Service "${updated.titleFr}" ${updated.isActive ? 'activé' : 'désactivé'}`,
            userId,
            ipAddress,
        });
        return updated;
    }
    async reorder(reorderDto, userId, ipAddress) {
        const { items } = reorderDto;
        for (let i = 0; i < items.length; i++) {
            await this.prisma.serviceContent.update({
                where: { id: items[i].id },
                data: { order: i },
            });
        }
        await this.activityLog.log({
            action: 'REORDER',
            entity: 'Service',
            description: 'Services réordonnés',
            userId,
            ipAddress,
        });
        return { message: 'Ordre mis à jour' };
    }
};
exports.ServicesContentService = ServicesContentService;
exports.ServicesContentService = ServicesContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], ServicesContentService);
//# sourceMappingURL=services-content.service.js.map