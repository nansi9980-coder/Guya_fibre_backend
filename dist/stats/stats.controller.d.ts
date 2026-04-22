import { StatsService } from './stats.service';
export declare class StatsController {
    private statsService;
    constructor(statsService: StatsService);
    getDashboard(): Promise<{
        stats: {
            totalDevisThisMonth: number;
            pendingDevis: number;
            activeClients: number;
            monthlyRevenue: number;
            monthlyChange: number;
        };
        recentDevis: {
            description: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clientName: string;
            reference: string;
            amount: number | null;
            clientEmail: string;
            clientPhone: string;
            services: string[];
            location: string;
            urgency: import(".prisma/client").$Enums.Urgency;
            status: import(".prisma/client").$Enums.DevisStatus;
        }[];
        topServices: {
            name: string;
            serviceName: string;
            count: number;
            percentage: number;
        }[];
        upcomingInterventions: never[];
    }>;
    getDevisStats(period: string): Promise<{
        total: number;
        accepted: number;
        rejected: number;
        date: string;
    }[]>;
}
