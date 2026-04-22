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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const activity_log_service_1 = require("../logs/activity-log.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async create(createDto, userId, ipAddress) {
        const existing = await this.prisma.user.findUnique({
            where: { email: createDto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException(`L'email "${createDto.email}" est déjà utilisé`);
        }
        const hashedPassword = await bcrypt.hash(createDto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: createDto.email,
                password: hashedPassword,
                firstName: createDto.firstName,
                lastName: createDto.lastName,
                role: createDto.role || 'EDITOR',
            },
        });
        await this.activityLog.log({
            action: 'CREATE',
            entity: 'User',
            entityId: user.id,
            description: `Utilisateur "${user.email}" créé`,
            userId,
            ipAddress,
        });
        const { password: _, refreshToken: __, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async findAll(query) {
        const { page = 1, limit = 20, role, isActive, search } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (role)
            where.role = role;
        if (isActive !== undefined)
            where.isActive = isActive;
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: users,
            meta: { total, page, perPage: limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur ${id} non trouvé`);
        }
        return user;
    }
    async update(id, updateDto, userId, ipAddress) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur ${id} non trouvé`);
        }
        if (updateDto.email && updateDto.email !== user.email) {
            const existing = await this.prisma.user.findUnique({
                where: { email: updateDto.email },
            });
            if (existing) {
                throw new common_1.BadRequestException(`L'email "${updateDto.email}" est déjà utilisé`);
            }
        }
        const updateData = {};
        if (updateDto.email)
            updateData.email = updateDto.email;
        if (updateDto.firstName)
            updateData.firstName = updateDto.firstName;
        if (updateDto.lastName)
            updateData.lastName = updateDto.lastName;
        if (updateDto.role)
            updateData.role = updateDto.role;
        if (updateDto.isActive !== undefined)
            updateData.isActive = updateDto.isActive;
        if (updateDto.password) {
            updateData.password = await bcrypt.hash(updateDto.password, 12);
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        await this.activityLog.log({
            action: 'UPDATE',
            entity: 'User',
            entityId: id,
            description: `Utilisateur "${updated.email}" mis à jour`,
            userId,
            ipAddress,
        });
        const { password: _, refreshToken: __, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }
    async remove(id, userId, ipAddress) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur ${id} non trouvé`);
        }
        if (id === userId) {
            throw new common_1.BadRequestException('Vous ne pouvez pas supprimer votre propre compte');
        }
        await this.prisma.user.delete({ where: { id } });
        await this.activityLog.log({
            action: 'DELETE',
            entity: 'User',
            entityId: id,
            description: `Utilisateur "${user.email}" supprimé`,
            userId,
            ipAddress,
        });
        return { message: 'Utilisateur supprimé avec succès' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], UsersService);
//# sourceMappingURL=users.service.js.map