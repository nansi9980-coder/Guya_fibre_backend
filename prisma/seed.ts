import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@guyafibre.com' },
    update: {},
    create: {
      email: 'admin@guyafibre.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'GUYA FIBRE',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create editor user
  const editorPassword = await bcrypt.hash('Editor123!', 12);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@guyafibre.com' },
    update: {},
    create: {
      email: 'editor@guyafibre.com',
      password: editorPassword,
      firstName: 'Editor',
      lastName: 'GUYA FIBRE',
      role: 'EDITOR',
      isActive: true,
    },
  });
  console.log(`✅ Editor user created: ${editor.email}`);

  // Create default services
  const services = [
    {
      slug: 'ftth',
      number: '01',
      icon: 'Wifi',
      titleFr: 'FTTH - Fibre jusqu\'à l\'abonné',
      titleEn: 'FTTH - Fiber to the Home',
      descFr: 'Déploiement de fibre optique directement chez le client pour une connexion internet ultra-rapide.',
      descEn: 'Fiber optic deployment directly to the customer\'s home for ultra-fast internet connection.',
      features: ['Débit jusqu\'à 1Gbps', 'Installation professionnelle', 'Garantie de service'],
      benefit: 'Connexion ultra-rapide',
      isActive: true,
      order: 1,
    },
    {
      slug: 'etudes-techniques',
      number: '02',
      icon: 'PenTool',
      titleFr: 'Études techniques',
      titleEn: 'Technical studies',
      descFr: 'Études de faisabilité et planification de réseaux fibre pour les collectivités et entreprises.',
      descEn: 'Feasibility studies and fiber network planning for communities and businesses.',
      features: ['Audit de réseau', 'Planification', 'Expertise technique'],
      benefit: 'Planification optimale',
      isActive: true,
      order: 2,
    },
    {
      slug: 'maintenance',
      number: '03',
      icon: 'Wrench',
      titleFr: 'Maintenance & Support',
      titleEn: 'Maintenance & Support',
      descFr: 'Maintenance préventive et curative des infrastructures fibre optique.',
      descEn: 'Preventive and corrective maintenance of fiber optic infrastructure.',
      features: ['Support 24/7', 'Intervention rapide', 'Contrats de maintenance'],
      benefit: 'Fiabilité garantie',
      isActive: true,
      order: 3,
    },
  ];

  for (const service of services) {
    await prisma.serviceContent.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log(`✅ Default services created`);

  // Create default site content
  const siteContents = [
    {
      section: 'hero',
      content: {
        titleFr: 'La Fibre Optique pour la Guyane',
        titleEn: 'Fiber Optic for French Guiana',
        subtitle: 'Connectivité haut débit pour tous les foyers et entreprises',
        badge: 'Disponible',
        ctaPrimary: 'Demander un devis',
        ctaSecondary: 'Nos services',
        backgroundImage: '/images/hero-bg.jpg',
      },
    },
    {
      section: 'about',
      content: {
        title: 'À propos de GUYA FIBRE',
        description: 'Entreprise spécialisée dans le déploiement de fibre optique en Guyane française depuis plus de 15 ans.',
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
    },
    {
      section: 'cta',
      content: {
        title: 'Prêt à vous connecter ?',
        subtitle: 'Demandez votre devis gratuit dès aujourd\'hui',
        buttonText: 'Demander un devis',
        buttonLink: '/devis',
      },
    },
    {
      section: 'footer',
      content: {
        description: 'GUYA FIBRE - Votre partenaire pour la connectivité en Guyane',
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/guyafibre' },
          { platform: 'linkedin', url: 'https://linkedin.com/company/guyafibre' },
        ],
        legalLinks: [
          { label: 'Mentions légales', url: '/mentions-legales' },
          { label: 'Politique de confidentialité', url: '/politique-confidentialite' },
        ],
      },
    },
  ];

  for (const content of siteContents) {
    await prisma.siteContent.upsert({
      where: { section: content.section },
      update: { content: content.content },
      create: { section: content.section, content: content.content },
    });
  }
  console.log(`✅ Default site content created`);

  // Create default email templates
  const emailTemplates = [
    {
      slug: 'devis-confirmation-client',
      name: 'Confirmation de devis - Client',
      subject: 'Confirmation de votre demande de devis - GUYA FIBRE',
      bodyHtml: `<h1>Bonjour {{clientName}},</h1>
<p>Nous avons bien reçu votre demande de devis.</p>
<p>Référence: <strong>{{reference}}</strong></p>
<p>Notre équipe va traiter votre demande dans les plus brefs délais.</p>
<p>Cordialement,<br>L'équipe GUYA FIBRE</p>`,
      bodyText: `Bonjour {{clientName}},\n\nNous avons bien reçu votre demande de devis.\n\nRéférence: {{reference}}\n\nNotre équipe va traiter votre demande dans les plus brefs délais.\n\nCordialement,\nL'équipe GUYA FIBRE`,
      variables: ['clientName', 'reference', 'service', 'date'],
    },
    {
      slug: 'devis-notification-admin',
      name: 'Notification nouveau devis - Admin',
      subject: 'Nouveau devis reçu - {{reference}}',
      bodyHtml: `<h1>Nouveau devis reçu</h1>
<p><strong>Référence:</strong> {{reference}}</p>
<p><strong>Client:</strong> {{clientName}}</p>
<p><strong>Email:</strong> {{companyEmail}}</p>
<p><strong>Téléphone:</strong> {{companyPhone}}</p>
<p><strong>Services:</strong> {{service}}</p>
<p><strong>Date:</strong> {{date}}</p>`,
      bodyText: `Nouveau devis reçu\n\nRéférence: {{reference}}\nClient: {{clientName}}\nEmail: {{companyEmail}}\nTéléphone: {{companyPhone}}\nServices: {{service}}\nDate: {{date}}`,
      variables: ['clientName', 'reference', 'service', 'date', 'companyEmail', 'companyPhone'],
    },
    {
      slug: 'devis-response',
      name: 'Réponse au client',
      subject: 'Réponse à votre devis {{reference}} - GUYA FIBRE',
      bodyHtml: `<h1>Bonjour {{clientName}},</h1>
<p>Voici notre réponse à votre demande de devis.</p>
<p>Référence: <strong>{{reference}}</strong></p>
<p>{{body}}</p>
<p>Cordialement,<br>L'équipe GUYA FIBRE</p>`,
      bodyText: `Bonjour {{clientName}},\n\nVoici notre réponse à votre demande de devis.\n\nRéférence: {{reference}}\n\n{{body}}\n\nCordialement,\nL'équipe GUYA FIBRE`,
      variables: ['clientName', 'reference', 'body'],
    },
    {
      slug: 'welcome-admin',
      name: 'Bienvenue nouvel admin',
      subject: 'Bienvenue sur GUYA FIBRE Admin',
      bodyHtml: `<h1>Bienvenue {{firstName}} {{lastName}},</h1>
<p>Votre compte administrateur a été créé sur GUYA FIBRE.</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Rôle:</strong> {{role}}</p>
<p>Vous pouvez maintenant vous connecter à l'espace admin.</p>
<p>Cordialement,<br>L'équipe GUYA FIBRE</p>`,
      bodyText: `Bienvenue {{firstName}} {{lastName}},\n\nVotre compte administrateur a été créé sur GUYA FIBRE.\n\nEmail: {{email}}\nRôle: {{role}}\n\nVous pouvez maintenant vous connecter à l'espace admin.\n\nCordialement,\nL'équipe GUYA FIBRE`,
      variables: ['firstName', 'lastName', 'email', 'role'],
    },
    {
      slug: 'contact-notification-admin',
      name: 'Notification message contact - Admin',
      subject: 'Nouveau message de contact - {{reference}}',
      bodyHtml: `<h1>Nouveau message de contact</h1>
<p><strong>Référence:</strong> {{reference}}</p>
<p><strong>Nom:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Téléphone:</strong> {{phone}}</p>
<p><strong>Sujet:</strong> {{subject}}</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>`,
      bodyText: `Nouveau message de contact\n\nRéférence: {{reference}}\nNom: {{name}}\nEmail: {{email}}\nTéléphone: {{phone}}\nSujet: {{subject}}\n\nMessage:\n{{message}}`,
      variables: ['reference', 'name', 'email', 'phone', 'subject', 'message'],
    },
    {
      slug: 'contact-confirmation-client',
      name: 'Confirmation message contact - Client',
      subject: 'Confirmation de réception - GUYA FIBRE',
      bodyHtml: `<h1>Bonjour {{name}},</h1>
<p>Nous avons bien reçu votre message.</p>
<p>Référence: <strong>{{reference}}</strong></p>
<p>Notre équipe vous répondra dans les plus brefs délais.</p>
<p>Cordialement,<br>L'équipe GUYA FIBRE</p>`,
      bodyText: `Bonjour {{name}},\n\nNous avons bien reçu votre message.\n\nRéférence: {{reference}}\n\nNotre équipe vous répondra dans les plus brefs délais.\n\nCordialement,\nL'équipe GUYA FIBRE`,
      variables: ['name', 'reference'],
    },
  ];

  for (const template of emailTemplates) {
    await prisma.emailTemplate.upsert({
      where: { slug: template.slug },
      update: {},
      create: template,
    });
  }
  console.log(`✅ Default email templates created`);

  // Create default settings
  const settings = [
    { group: 'company', key: 'name', value: 'GUYA FIBRE', type: 'string' },
    { group: 'company', key: 'email', value: 'contact@guyafibre.com', type: 'string' },
    { group: 'company', key: 'phone', value: '+594 6 94 43 54 84', type: 'string' },
    { group: 'company', key: 'address', value: '12 Rue des Palmiers', type: 'string' },
    { group: 'company', key: 'city', value: 'Saint-Laurent-du-Maroni', type: 'string' },
    { group: 'company', key: 'postalCode', value: '97320', type: 'string' },
    { group: 'company', key: 'siret', value: '123 456 789 00012', type: 'string' },
    { group: 'company', key: 'website', value: 'www.guyafibre.com', type: 'string' },
    { group: 'seo', key: 'title', value: 'GUYA FIBRE — Experts Fibre Optique en Guyane', type: 'string' },
    { group: 'seo', key: 'description', value: 'Entreprise guyanaise spécialisée dans le déploiement, la maintenance et les études de réseaux fibre optique.', type: 'string' },
    { group: 'notifications', key: 'newQuote', value: 'true', type: 'boolean' },
    { group: 'notifications', key: 'quoteResponse', value: 'true', type: 'boolean' },
    { group: 'notifications', key: 'urgentQuote', value: 'true', type: 'boolean' },
    { group: 'notifications', key: 'weeklyReport', value: 'false', type: 'boolean' },
    { group: 'site', key: 'maintenanceMode', value: 'false', type: 'boolean' },
    { group: 'site', key: 'allowDevisPublic', value: 'true', type: 'boolean' },
    { group: 'site', key: 'whatsappNumber', value: '+594694435484', type: 'string' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { group_key: { group: setting.group, key: setting.key } },
      update: {},
      create: setting,
    });
  }
  console.log(`✅ Default settings created`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📧 Default login credentials:');
  console.log('   Admin:  admin@guyafibre.com / Admin123!');
  console.log('   Editor: editor@guyafibre.com / Editor123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
