"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevisModule = void 0;
const common_1 = require("@nestjs/common");
const devis_service_1 = require("./devis.service");
const devis_controller_1 = require("./devis.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const logs_module_1 = require("../logs/logs.module");
const auth_module_1 = require("../auth/auth.module");
const email_module_1 = require("../email/email.module");
let DevisModule = class DevisModule {
};
exports.DevisModule = DevisModule;
exports.DevisModule = DevisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            logs_module_1.LogsModule,
            auth_module_1.AuthModule,
            email_module_1.EmailModule,
        ],
        controllers: [devis_controller_1.DevisController],
        providers: [devis_service_1.DevisService],
        exports: [devis_service_1.DevisService],
    })
], DevisModule);
//# sourceMappingURL=devis.module.js.map