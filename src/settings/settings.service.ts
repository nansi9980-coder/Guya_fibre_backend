import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';

const DEFAULT_SETTINGS: Record<string, Record<string, any>> = {
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
  theme: {
    activePalette: 'default',
  },
};

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  async findOne(group: string) {
    const settings = await this.prisma.setting.findMany({
      where: { group },
    });

    if (settings.length === 0) {
      // Return defaults if no settings found
      return DEFAULT_SETTINGS[group] || {};
    }

    const result: Record<string, any> = {};
    for (const setting of settings) {
      if (setting.type === 'boolean') {
        result[setting.key] = setting.value === 'true';
      } else if (setting.type === 'number') {
        result[setting.key] = parseFloat(setting.value);
      } else if (setting.type === 'json') {
        try {
          result[setting.key] = JSON.parse(setting.value);
        } catch {
          result[setting.key] = setting.value;
        }
      } else {
        result[setting.key] = setting.value;
      }
    }

    return result;
  }

  async update(group: string, data: Record<string, any>, userId: string, ipAddress?: string) {
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
    // TODO: Implement SMTP test
    return { success: true, message: 'Configuration SMTP valide' };
  }
}