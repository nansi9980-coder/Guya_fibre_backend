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
exports.RapportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const activity_log_service_1 = require("../logs/activity-log.service");
let RapportsService = class RapportsService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async generateReference() {
        const year = new Date().getFullYear();
        const last = await this.prisma.rapport.findFirst({
            where: { reference: { startsWith: `RPT-${year}` } },
            orderBy: { reference: 'desc' },
        });
        let next = 1;
        if (last) {
            const parts = last.reference.split('-');
            next = parseInt(parts[2]) + 1;
        }
        return `RPT-${year}-${next.toString().padStart(3, '0')}`;
    }
    async create(dto, userId, ipAddress) {
        const reference = await this.generateReference();
        const rapport = await this.prisma.rapport.create({
            data: {
                reference,
                title: dto.title,
                typeSupport: dto.typeSupport,
                status: 'DRAFT',
                authorId: userId,
                devisId: dto.devisId ?? null,
                batiment: dto.batiment,
                batimentChoix: dto.batimentChoix,
                hall: dto.hall,
                appartement: dto.appartement,
                localTechnique: dto.localTechnique,
                localTechniqueLocalisation: dto.localTechniqueLocalisation,
                photoLocalTechniqueUrl: dto.photoLocalTechniqueUrl,
                photoPavillonUrl: dto.photoPavillonUrl,
                gpsLat: dto.gpsLat,
                gpsLng: dto.gpsLng,
                notes: dto.notes,
            },
            include: {
                author: { select: { id: true, firstName: true, lastName: true, email: true } },
                devis: { select: { id: true, reference: true, clientName: true } },
            },
        });
        await this.activityLog.log({
            action: 'CREATE',
            entity: 'Rapport',
            entityId: rapport.id,
            description: `Rapport ${reference} créé`,
            userId,
            ipAddress,
        });
        return rapport;
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.authorId)
            where.authorId = query.authorId;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { reference: { contains: query.search, mode: 'insensitive' } },
                { batiment: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query.startDate || query.endDate) {
            where.createdAt = {};
            if (query.startDate)
                where.createdAt.gte = new Date(query.startDate);
            if (query.endDate)
                where.createdAt.lte = new Date(query.endDate);
        }
        const [data, total] = await Promise.all([
            this.prisma.rapport.findMany({
                where, skip, take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: { select: { id: true, firstName: true, lastName: true } },
                    devis: { select: { id: true, reference: true, clientName: true } },
                },
            }),
            this.prisma.rapport.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const rapport = await this.prisma.rapport.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, firstName: true, lastName: true, email: true } },
                devis: { select: { id: true, reference: true, clientName: true, clientPhone: true, location: true } },
            },
        });
        if (!rapport)
            throw new common_1.NotFoundException(`Rapport ${id} introuvable`);
        return rapport;
    }
    async update(id, dto, userId, ipAddress) {
        await this.findOne(id);
        const rapport = await this.prisma.rapport.update({
            where: { id },
            data: {
                ...dto,
                updatedAt: new Date(),
            },
            include: {
                author: { select: { id: true, firstName: true, lastName: true } },
                devis: { select: { id: true, reference: true, clientName: true } },
            },
        });
        await this.activityLog.log({
            action: 'UPDATE',
            entity: 'Rapport',
            entityId: id,
            description: `Rapport ${rapport.reference} mis à jour`,
            userId,
            ipAddress,
        });
        return rapport;
    }
    async sign(id, dto, userId, ipAddress) {
        const existing = await this.findOne(id);
        if (existing.status === 'ARCHIVED') {
            throw new common_1.ForbiddenException('Impossible de signer un rapport archivé');
        }
        const rapport = await this.prisma.rapport.update({
            where: { id },
            data: {
                signatureTechnicien: dto.signatureTechnicien,
                signatureClient: dto.signatureClient ?? null,
                status: 'SIGNED',
                signedAt: new Date(),
            },
            include: {
                author: { select: { id: true, firstName: true, lastName: true } },
            },
        });
        await this.activityLog.log({
            action: 'UPDATE',
            entity: 'Rapport',
            entityId: id,
            description: `Rapport ${rapport.reference} signé`,
            userId,
            ipAddress,
        });
        return rapport;
    }
    async archive(id, userId, ipAddress) {
        const existing = await this.findOne(id);
        const rapport = await this.prisma.rapport.update({
            where: { id },
            data: { status: 'ARCHIVED' },
        });
        await this.activityLog.log({
            action: 'UPDATE',
            entity: 'Rapport',
            entityId: id,
            description: `Rapport ${existing.reference} archivé`,
            userId,
            ipAddress,
        });
        return rapport;
    }
    async remove(id, userId, role, ipAddress) {
        const existing = await this.findOne(id);
        if (role !== 'SUPER_ADMIN' && existing.authorId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez supprimer que vos propres rapports');
        }
        await this.prisma.rapport.delete({ where: { id } });
        await this.activityLog.log({
            action: 'DELETE',
            entity: 'Rapport',
            entityId: id,
            description: `Rapport ${existing.reference} supprimé`,
            userId,
            ipAddress,
        });
        return { success: true };
    }
    async getStats() {
        const [total, draft, signed, archived, thisMonth] = await Promise.all([
            this.prisma.rapport.count(),
            this.prisma.rapport.count({ where: { status: 'DRAFT' } }),
            this.prisma.rapport.count({ where: { status: 'SIGNED' } }),
            this.prisma.rapport.count({ where: { status: 'ARCHIVED' } }),
            this.prisma.rapport.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
        ]);
        return { total, draft, signed, archived, thisMonth };
    }
};
exports.RapportsService = RapportsService;
exports.RapportsService = RapportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], RapportsService);
//# sourceMappingURL=rapports.service.js.map