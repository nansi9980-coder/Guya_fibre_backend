import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';

const DEFAULT_CONTENT: Record<string, any> = {
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

@Injectable()
export class SiteContentService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  async findOne(section: string) {
    const content = await this.prisma.siteContent.findUnique({
      where: { section },
    });

    if (!content) {
      // Return default content if not found
      return DEFAULT_CONTENT[section] || null;
    }

    return content.content;
  }

  async findAll() {
    const contents = await this.prisma.siteContent.findMany();
    const result: Record<string, any> = {};

    for (const content of contents) {
      result[content.section] = content.content;
    }

    // Add default sections that don't exist yet
    for (const [section, defaultContent] of Object.entries(DEFAULT_CONTENT)) {
      if (!result[section]) {
        result[section] = defaultContent;
      }
    }

    return result;
  }

  async update(section: string, content: any, userId: string, ipAddress?: string) {
    const existing = await this.prisma.siteContent.findUnique({
      where: { section },
    });

    let updated;
    if (existing) {
      updated = await this.prisma.siteContent.update({
        where: { section },
        data: { content, updatedById: userId },
      });
    } else {
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

  async reset(section: string, userId: string, ipAddress?: string) {
    const defaultContent = DEFAULT_CONTENT[section];
    if (!defaultContent) {
      throw new NotFoundException(`Section "${section}" non trouvée`);
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
}