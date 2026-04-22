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
      totalDevisThisMonth,
      devisLastMonth,
      pendingDevis,
      recentDevis,
      allDevis,
      acceptedDevisWithAmount,
      totalDevis,
      acceptedDevis,
    ] = await Promise.all([
      this.prisma.devis.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.devis.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      this.prisma.devis.count({ where: { status: { in: ['NEW', 'PENDING', 'IN_PROGRESS'] } } }),
      this.prisma.devis.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, reference: true, clientName: true, clientEmail: true,
          clientPhone: true, services: true, location: true, description: true,
          urgency: true, status: true, amount: true, createdAt: true, updatedAt: true,
        },
      }),
      this.prisma.devis.findMany({ select: { services: true } }),
      this.prisma.devis.findMany({
        where: { status: 'ACCEPTED', amount: { not: null } },
        select: { amount: true },
      }),
      this.prisma.devis.count(),
      this.prisma.devis.count({ where: { status: 'ACCEPTED' } }),
    ]);

    // Monthly revenue
    const monthlyRevenue = acceptedDevisWithAmount.reduce((sum, d) => sum + (d.amount ?? 0), 0);

    // Monthly change %
    const monthlyChange = devisLastMonth > 0
      ? Math.round(((totalDevisThisMonth - devisLastMonth) / devisLastMonth) * 100)
      : 0;

    // Active clients (unique emails this month)
    const activeClientsResult = await this.prisma.devis.findMany({
      where: { createdAt: { gte: startOfMonth } },
      select: { clientEmail: true },
      distinct: ['clientEmail'],
    });
    const activeClients = activeClientsResult.length;

    // Top services
    const serviceCounts: Record<string, number> = {};
    for (const devis of allDevis) {
      for (const service of devis.services) {
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      }
    }
    const totalServiceCount = Object.values(serviceCounts).reduce((a, b) => a + b, 0);
    const topServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({
        name,
        serviceName: name,
        count,
        percentage: totalServiceCount > 0 ? Math.round((count / totalServiceCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      stats: {
        totalDevisThisMonth,
        pendingDevis,
        activeClients,
        monthlyRevenue,
        monthlyChange,
      },
      recentDevis,
      topServices,
      upcomingInterventions: [],
    };
  }

  async getDevisStats(period: string) {
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

    const devis = await this.prisma.devis.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, status: true },
    });

    const dailyStats: Record<string, { total: number; accepted: number; rejected: number }> = {};
    for (const d of devis) {
      const date = d.createdAt.toISOString().split('T')[0];
      if (!dailyStats[date]) dailyStats[date] = { total: 0, accepted: 0, rejected: 0 };
      dailyStats[date].total++;
      if (d.status === 'ACCEPTED') dailyStats[date].accepted++;
      if (d.status === 'REJECTED') dailyStats[date].rejected++;
    }

    return Object.entries(dailyStats)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}