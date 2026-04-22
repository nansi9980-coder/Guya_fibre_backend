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
exports.SiteContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const activity_log_service_1 = require("../logs/activity-log.service");
const DEFAULT_CONTENT = {
    hero: {
        titleFr: 'La Fibre Optique pour la Guyane',
        titleEn: 'Fiber Optic for French Guiana',
        subtitle: 'Connectivité haut débit pour tous',
        badge: 'Disponible',
        ctaPrimary: 'Demander un devis',
        ctaSecondary: 'Nos services',
        backgroundImage: '/images/hero-bg.jpg',
    },
    about: {
        title: 'À propos de GUYA FIBRE',
        description: 'Entreprise spécialisée dans le déploiement de fibre optique en Guyane française.',
        stats: [
            { value: '5000+', label: 'Foyers raccordés', icon: 'Home' },
            { value: '15+', label: 'Années d\'expérience', icon: 'Award' },
            { value: '98%', label: 'Satisfaction client', icon: 'Smile' },
        ],
        values: [
            { title: 'Expertise', description: 'Équipe certifiée et expérimentée' },
            { title: 'Rapidité', description: 'Déploiement rapide et efficace' },
            { title: 'Qualité', description: 'Infrastructure de qualité professionnelle' },
        ],
        image: '/images/about.jpg',
    },
    faq: [
        { questionFr: 'Qu\'est-ce que la fibre optique ?', answerFr: 'La fibre optique est une technologie de transmission de données utilisant la lumière.', questionEn: 'What is fiber optic?', answerEn: 'Fiber optic is a data transmission technology using light.' },
        { questionFr: 'Combien de temps pour le raccordement ?', answerFr: 'Le raccordement prend généralement 1 à 2 semaines.', questionEn: 'How long does connection take?', answerEn: 'Connection usually takes 1 to 2 weeks.' },
    ],
    testimonials: [
        { initials: 'JD', name: 'Jean Dupont', role: 'Particulier', company: '', rating: 5, quote: 'Service excellent, équipe très professionnelle.' },
        { initials: 'ML', name: 'Marie Laurent', role: 'Chef d\'entreprise', company: 'TechCorp', rating: 5, quote: 'Raccordement rapide et sans souci.' },
    ],
    stats: [
        { value: '5000+', label: 'Foyers raccordés', icon: 'Home' },
        { value: '15+', label: 'Années d\'expérience', icon: 'Award' },
        { value: '98%', label: 'Satisfaction client', icon: 'Smile' },
        { value: '24/7', label: 'Support', icon: 'Headphones' },
    ],
    cta: {
        title: 'Prêt à vous connecter ?',
        subtitle: 'Demandez votre devis gratuit dès aujourd\'hui',
        buttonText: 'Demander un devis',
        buttonLink: '/devis',
    },
    footer: {
        description: 'GUYA FIBRE - Votre partenaire pour la connectivité en Guyane',
        socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com/guyafibre' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/guyafibre' },
            { platform: 'instagram', url: 'https://instagram.com/guyafibre' },
        ],
        legalLinks: [
            { label: 'Mentions légales', url: '/mentions-legales' },
            { label: 'Politique de confidentialité', url: '/politique-confidentialite' },
        ],
    },
};
let SiteContentService = class SiteContentService {
    constructor(prisma, activityLog) {
        this.prisma = prisma;
        this.activityLog = activityLog;
    }
    async findOne(section) {
        const content = await this.prisma.siteContent.findUnique({
            where: { section },
        });
        if (!content) {
            return DEFAULT_CONTENT[section] || null;
        }
        return content.content;
    }
    async findAll() {
        const contents = await this.prisma.siteContent.findMany();
        const result = {};
        for (const content of contents) {
            result[content.section] = content.content;
        }
        for (const [section, defaultContent] of Object.entries(DEFAULT_CONTENT)) {
            if (!result[section]) {
                result[section] = defaultContent;
            }
        }
        return result;
    }
    async update(section, content, userId, ipAddress) {
        const existing = await this.prisma.siteContent.findUnique({
            where: { section },
        });
        let updated;
        if (existing) {
            updated = await this.prisma.siteContent.update({
                where: { section },
                data: { content, updatedById: userId },
            });
        }
        else {
            updated = await this.prisma.siteContent.create({
                data: { section, content, updatedById: userId },
            });
        }
        await this.activityLog.log({
            action: 'UPDATE',
            entity: 'SiteContent',
            entityId: section,
            description: `Section "${section}" mise à jour`,
            userId,
            ipAddress,
        });
        return updated;
    }
    async reset(section, userId, ipAddress) {
        const defaultContent = DEFAULT_CONTENT[section];
        if (!defaultContent) {
            throw new common_1.NotFoundException(`Section "${section}" non trouvée`);
        }
        const updated = await this.prisma.siteContent.update({
            where: { section },
            data: { content: defaultContent, updatedById: userId },
        });
        await this.activityLog.log({
            action: 'RESET',
            entity: 'SiteContent',
            entityId: section,
            description: `Section "${section}" réinitialisée`,
            userId,
            ipAddress,
        });
        return updated;
    }
};
exports.SiteContentService = SiteContentService;
exports.SiteContentService = SiteContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], SiteContentService);
//# sourceMappingURL=site-content.service.js.map