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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_templates_service_1 = require("../email-templates/email-templates.service");
const activity_log_service_1 = require("../logs/activity-log.service");
const crypto = __importStar(require("crypto"));
let ContactService = class ContactService {
    constructor(prisma, emailTemplates, activityLog) {
        this.prisma = prisma;
        this.emailTemplates = emailTemplates;
        this.activityLog = activityLog;
    }
    async create(data, ipAddress) {
        const reference = `CONT-${new Date().getFullYear()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
        const contact = await this.prisma.contact.create({
            data: {
                reference,
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                address: data.address,
                postalCode: data.postalCode,
                city: data.city,
                message: data.message,
            },
        });
        await this.emailTemplates.sendContactNotification(contact);
        await this.activityLog.log({
            action: 'CREATE',
            entity: 'Contact',
            entityId: contact.id,
            description: `Nouveau message de contact: ${contact.reference} - ${contact.subject}`,
            ipAddress,
        });
        return { id: contact.id, reference: contact.reference };
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 20, 100);
        const skip = (page - 1) * limit;
        const where = query.search
            ? {
                OR: [
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { email: { contains: query.search, mode: 'insensitive' } },
                    { subject: { contains: query.search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [contacts, total] = await Promise.all([
            this.prisma.contact.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.contact.count({ where }),
        ]);
        return {
            data: contacts,
            meta: {
                total,
                page,
                perPage: limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        return this.prisma.contact.findUnique({
            where: { id },
        });
    }
    async markAsRead(id, userId, ipAddress) {
        const contact = await this.prisma.contact.update({
            where: { id },
            data: { isRead: true },
        });
        await this.activityLog.log({
            action: 'UPDATE',
            entity: 'Contact',
            entityId: contact.id,
            description: `Message de contact marqué comme lu: ${contact.reference}`,
            userId,
            ipAddress,
        });
        return contact;
    }
    async delete(id, userId, ipAddress) {
        const contact = await this.prisma.contact.findUnique({ where: { id } });
        if (!contact) {
            throw new Error('Contact not found');
        }
        await this.prisma.contact.delete({ where: { id } });
        await this.activityLog.log({
            action: 'DELETE',
            entity: 'Contact',
            entityId: id,
            description: `Message de contact supprimé: ${contact.reference}`,
            userId,
            ipAddress,
        });
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_templates_service_1.EmailTemplatesService,
        activity_log_service_1.ActivityLogService])
], ContactService);
//# sourceMappingURL=contact.service.js.map