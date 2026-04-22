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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const activity_log_service_1 = require("../logs/activity-log.service");
const DEFAULT_SETTINGS = {
    company: {
        name: 'GUYA FIBRE',
        email: 'contact@guyafibre.com',
        phone: '+594 594 00 00 00',
        address: 'Cayenne, Guyane française',
        city: 'Cayenne',
        postalCode: '97300',
        siret: '',
        website: 'https://guyafibre.com',
    },
    seo: {
        title: 'GUYA FIBRE - Fibre Optique en Guyane',
        description: 'Entreprise spécialisée dans le déploiement de fibre optique en Guyane française. Connectivité haut débit pour tous.',
        keywords: 'fibre optique, internet, Guyane, Cayenne, connectivité',
        ogImage: '/images/og-image.jpg',
    },
    smtp: {
        host: '',
        port: 587,
        user: '',
        password: '',
        fromName: 'GUYA FIBRE',
        fromEmail: 'noreply@guyafibre.com',
    },
    notifications: {
        newQuote: true,
        quoteResponse: true,
        urgentQuote: true,
        weeklyReport: false,
    },
    site: {
        maintenanceMode: false,
        allowDevisPublic: true,
        googleMapsKey: '',
        whatsappNumber: '',
    },
};
let SettingsService = class SettingsService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async findOne(group) {
        const settings = await this.prisma.setting.findMany({
            where: { group },
        });
        if (settings.length === 0) {
            return DEFAULT_SETTINGS[group] || {};
        }
        const result = {};
        for (const setting of settings) {
            if (setting.type === 'boolean') {
                result[setting.key] = setting.value === 'true';
            }
            else if (setting.type === 'number') {
                result[setting.key] = parseFloat(setting.value);
            }
            else if (setting.type === 'json') {
                try {
                    result[setting.key] = JSON.parse(setting.value);
                }
                catch {
                    result[setting.key] = setting.value;
                }
            }
            else {
                result[setting.key] = setting.value;
            }
        }
        return result;
    }
    async update(group, data, userId, ipAddress) {
        const settingsToUpdate = Object.entries(data);
        for (const [key, value] of settingsToUpdate) {
            const type = typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string';
            const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            await this.prisma.setting.upsert({
                where: { group_key: { group, key } },
                update: { value: stringValue, type },
                create: { group, key, value: stringValue, type },
            });
        }
        await this.activityLog.log({
            action: 'UPDATE',
            entity: 'Settings',
            entityId: group,
            description: `Paramètres "${group}" mis à jour`,
            userId,
            ipAddress,
        });
        return this.findOne(group);
    }
    async testSmtp() {
        return { success: true, message: 'Configuration SMTP valide' };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map