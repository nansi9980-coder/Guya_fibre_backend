import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalContactsThisMonth,
      contactsLastMonth,
      pendingContacts,
      recentContacts,
    ] = await Promise.all([
      this.prisma.contact.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.contact.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      this.prisma.contact.count({ where: { isRead: false } }),
      this.prisma.contact.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, reference: true, name: true, email: true,
          phone: true, subject: true, message: true,
          isRead: true, createdAt: true, updatedAt: true,
        },
      }),
    ]);

    const monthlyChange = contactsLastMonth > 0
      ? Math.round(((totalContactsThisMonth - contactsLastMonth) / contactsLastMonth) * 100)
      : 0;

    const activeClientsResult = await this.prisma.contact.findMany({
      where: { createdAt: { gte: startOfMonth } },
      select: { email: true },
      distinct: ['email'],
    });
    const activeClients = activeClientsResult.length;

    // Top tags from realisations
    const realisations = await this.prisma.realisation.findMany({
      where: { isActive: true },
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    for (const r of realisations) {
      for (const tag of r.tags || []) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
    const totalCount = Object.values(tagCounts).reduce((a, b) => a + b, 0);
    const topServices = Object.entries(tagCounts)
      .map(([name, count]) => ({
        name,
        serviceName: name,
        count,
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Map to frontend DashboardData shape
    const recentDevis = recentContacts.map((c) => ({
      id: c.id,
      reference: c.reference,
      clientName: c.name,
      clientEmail: c.email,
      clientPhone: c.phone || '',
      services: [],
      location: '',
      description: c.message,
      urgency: 'NORMAL',
      status: c.isRead ? 'READ' : 'UNREAD',
      amount: null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return {
      stats: {
        totalDevisThisMonth: totalContactsThisMonth,
        pendingDevis: pendingContacts,
        activeClients,
        monthlyRevenue: 0,
        monthlyChange,
      },
      recentDevis,
      topServices,
      upcomingInterventions: [],
    };
  }

  async getContactStats(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const contacts = await this.prisma.contact.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, isRead: true },
    });

    const dailyStats: Record<string, { total: number; accepted: number; rejected: number }> = {};
    for (const c of contacts) {
      const date = c.createdAt.toISOString().split('T')[0];
      if (!dailyStats[date]) dailyStats[date] = { total: 0, accepted: 0, rejected: 0 };
      dailyStats[date].total++;
      if (c.isRead) dailyStats[date].accepted++;
    }

    return Object.entries(dailyStats)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
