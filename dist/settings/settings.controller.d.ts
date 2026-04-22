import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    findOne(group: string): Promise<Record<string, any>>;
    update(group: string, data: Record<string, any>, req: any): Promise<Record<string, any>>;
    testSmtp(): Promise<{
        success: boolean;
        message: string;
    }>;
}
