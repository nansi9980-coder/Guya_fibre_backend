import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedInitialData();
  }

  async seedInitialData() {
    console.log('Checking if database seeding is required...');

    // Check for Realisations
    const realisationsCount = await this.prisma.realisation.count();
    if (realisationsCount === 0) {
      console.log('Seeding Realisations...');
      await this.prisma.realisation.createMany({
        data: [
          {
            titleFr: 'Installation Fibre Optique - Résidence Horizon',
            slug: 'installation-fibre-optique-residence-horizon',
            descFr: 'Déploiement complet de la fibre optique pour une résidence de 50 appartements avec une connectivité ultra-rapide.',
            location: 'Cayenne',
            date: '2024-03-15',
            scope: '50 appartements',
            tags: ['FTTH', 'Résidentiel'],
            images: ['/images/realisation-fibre.jpg'],
            isActive: true,
            isFeatured: true,
          },
          {
            titleFr: 'Maintenance Réseau - Zone Industrielle',
            slug: 'maintenance-reseau-zone-industrielle',
            descFr: 'Intervention d\'urgence et maintenance préventive sur le réseau fibre de la zone industrielle de Cayenne.',
            location: 'Kourou',
            date: '2024-02-10',
            scope: 'Zone industrielle',
            tags: ['Maintenance', 'Industriel'],
            images: ['/images/realisation-maintenance.jpg'],
            isActive: true,
            isFeatured: false,
          },
          {
            titleFr: 'Audit Infrastructure - Campus Universitaire',
            slug: 'audit-infrastructure-campus-universitaire',
            descFr: 'Analyse approfondie et recommandations pour la modernisation de l\'infrastructure réseau du campus.',
            location: 'Cayenne',
            date: '2024-01-20',
            scope: 'Audit complet',
            tags: ['Audit', 'Éducation'],
            images: ['/images/realisation-audit.jpg'],
            isActive: true,
            isFeatured: false,
          },
        ],
      });
    }

    // Check for Services
    const servicesCount = await this.prisma.serviceContent.count();
    if (servicesCount === 0) {
      console.log('Seeding Services...');
      await this.prisma.serviceContent.createMany({
        data: [
          {
            slug: 'etudes-et-ingenierie',
            number: '01',
            titleFr: 'Études et Ingénierie',
            descFr: 'Conception et planification détaillée de vos infrastructures réseau pour une performance optimale.',
            icon: 'Settings',
            image: '/images/service-etudes.jpg',
            features: ['Plans APS / APD', 'Dossiers DT/DICT'],
            isActive: true,
            order: 1,
          },
          {
            slug: 'installation-et-deploiement',
            number: '02',
            titleFr: 'Installation et Déploiement',
            descFr: 'Mise en œuvre experte de solutions fibre optique adaptées à vos besoins spécifiques.',
            icon: 'Wifi',
            image: '/images/service-installation.jpg',
            features: ['Génie civil', 'Tirage & Soudure'],
            isActive: true,
            order: 2,
          },
          {
            slug: 'maintenance-et-support',
            number: '03',
            titleFr: 'Maintenance et Support',
            descFr: 'Assistance technique réactive et maintenance continue pour garantir la stabilité de votre connexion.',
            icon: 'Tool',
            image: '/images/service-maintenance.jpg',
            features: ['Assistance 24/7', 'Maintenance préventive'],
            isActive: true,
            order: 3,
          },
        ],
      });
    }

    console.log('Seeding check complete.');
  }
}
