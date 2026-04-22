"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteContentModule = void 0;
const common_1 = require("@nestjs/common");
const site_content_service_1 = require("./site-content.service");
const site_content_controller_1 = require("./site-content.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const logs_module_1 = require("../logs/logs.module");
let SiteContentModule = class SiteContentModule {
};
exports.SiteContentModule = SiteContentModule;
exports.SiteContentModule = SiteContentModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, logs_module_1.LogsModule],
        controllers: [site_content_controller_1.SiteContentController],
        providers: [site_content_service_1.SiteContentService],
        exports: [site_content_service_1.SiteContentService],
    })
], SiteContentModule);
//# sourceMappingURL=site-content.module.js.map