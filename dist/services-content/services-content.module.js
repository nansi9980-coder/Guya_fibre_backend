"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesContentModule = void 0;
const common_1 = require("@nestjs/common");
const services_content_service_1 = require("./services-content.service");
const services_content_controller_1 = require("./services-content.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const logs_module_1 = require("../logs/logs.module");
let ServicesContentModule = class ServicesContentModule {
};
exports.ServicesContentModule = ServicesContentModule;
exports.ServicesContentModule = ServicesContentModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, logs_module_1.LogsModule],
        controllers: [services_content_controller_1.ServicesContentController],
        providers: [services_content_service_1.ServicesContentService],
        exports: [services_content_service_1.ServicesContentService],
    })
], ServicesContentModule);
//# sourceMappingURL=services-content.module.js.map