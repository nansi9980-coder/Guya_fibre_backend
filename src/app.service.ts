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
            title: 'Installation Fibre Optique - Résidence Horizon',
            description: 'Déploiement complet de la fibre optique pour une résidence de 50 appartements avec une connectivité ultra-rapide.',
            imageUrl: '/images/realisation-fibre.jpg',
            category: 'Résidentiel',
          },
          {
            title: 'Maintenance Réseau - Zone Industrielle',
            description: 'Intervention d\'urgence et maintenance préventive sur le réseau fibre de la zone industrielle de Cayenne.',
            imageUrl: '/images/realisation-maintenance.jpg',
            category: 'Industriel',
          },
          {
            title: 'Audit Infrastructure - Campus Universitaire',
            description: 'Analyse approfondie et recommandations pour la modernisation de l\'infrastructure réseau du campus.',
            imageUrl: '/images/realisation-audit.jpg',
            category: 'Éducation',
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
            title: 'Études et Ingénierie',
            description: 'Conception et planification détaillée de vos infrastructures réseau pour une performance optimale.',
            icon: 'Settings',
            imageUrl: '/images/service-etudes.jpg',
          },
          {
            title: 'Installation et Déploiement',
            description: 'Mise en œuvre experte de solutions fibre optique adaptées à vos besoins spécifiques.',
            icon: 'Wifi',
            imageUrl: '/images/service-installation.jpg',
          },
          {
            title: 'Maintenance et Support',
            description: 'Assistance technique réactive et maintenance continue pour garantir la stabilité de votre connexion.',
            icon: 'Tool',
            imageUrl: '/images/service-maintenance.jpg',
          },
        ],
      });
    }

    console.log('Seeding check complete.');
  }
}
