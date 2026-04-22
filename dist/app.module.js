"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const devis_module_1 = require("./devis/devis.module");
const services_content_module_1 = require("./services-content/services-content.module");
const realisations_module_1 = require("./realisations/realisations.module");
const medias_module_1 = require("./medias/medias.module");
const site_content_module_1 = require("./site-content/site-content.module");
const email_templates_module_1 = require("./email-templates/email-templates.module");
const settings_module_1 = require("./settings/settings.module");
const stats_module_1 = require("./stats/stats.module");
const logs_module_1 = require("./logs/logs.module");
const users_module_1 = require("./users/users.module");
const contact_module_1 = require("./contact/contact.module");
const email_module_1 = require("./email/email.module");
const rapports_module_1 = require("./rapports/rapports.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 60000,
                    limit: 100,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 300,
                },
            ]),
            auth_module_1.AuthModule,
            devis_module_1.DevisModule,
            services_content_module_1.ServicesContentModule,
            realisations_module_1.RealisationsModule,
            medias_module_1.MediasModule,
            site_content_module_1.SiteContentModule,
            email_templates_module_1.EmailTemplatesModule,
            settings_module_1.SettingsModule,
            stats_module_1.StatsModule,
            logs_module_1.LogsModule,
            users_module_1.UsersModule,
            contact_module_1.ContactModule,
            email_module_1.EmailModule,
            rapports_module_1.RapportsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map