"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const devis_service_1 = require("./devis.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let DevisController = class DevisController {
    constructor(devisService) {
        this.devisService = devisService;
    }
    async create(createDevisDto, req) {
        const ipAddress = req.ip || req.connection?.remoteAddress;
        return this.devisService.create(createDevisDto, ipAddress);
    }
    async findAll(query) {
        return this.devisService.findAll(query);
    }
    async exportCsv(query, res) {
        const csv = await this.devisService.exportCsv(query);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=devis.csv');
        res.send(csv);
    }
    async findOne(id) {
        return this.devisService.findOne(id);
    }
    async updateAmount(id, updateAmountDto, req) {
        const ipAddress = req.ip || req.connection?.remoteAddress;
        return this.devisService.updateAmount(id, updateAmountDto.amount, req.user.id, ipAddress);
    }
    async updateStatus(id, updateStatusDto, req) {
        const ipAddress = req.ip || req.connection?.remoteAddress;
        return this.devisService.updateStatus(id, updateStatusDto, req.user.id, ipAddress);
    }
    async addNote(id, addNoteDto, req) {
        const ipAddress = req.ip || req.connection?.remoteAddress;
        return this.devisService.addNote(id, addNoteDto, req.user.id, ipAddress);
    }
    async respond(id, respondDevisDto, req) {
        const ipAddress = req.ip || req.connection?.remoteAddress;
        return this.devisService.respond(id, respondDevisDto, req.user.id, ipAddress);
    }
    async assign(id, userId, req) {
        const ipAddress = req.ip || req.connection?.remoteAddress;
        return this.devisService.assign(id, userId, req.user.id, ipAddress);
    }
    async remove(id, req) {
        const ipAddress = req.ip || req.connection?.remoteAddress;
        return this.devisService.remove(id, req.user.id, req.user.role, ipAddress);
    }
};
exports.DevisController = DevisController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Soumettre un nouveau devis (public)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateDevisDto, Object]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des devis (admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DevisQueryDto]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Exporter les devis en CSV' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DevisQueryDto, Object]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Détail d'un devis" }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/amount'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Mettre à jour le montant d'un devis" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateAmountDto, Object]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "updateAmount", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Changer le statut d'un devis" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateDevisStatusDto, Object]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/notes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter une note interne' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AddNoteDto, Object]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "addNote", null);
__decorate([
    (0, common_1.Post)(':id/respond'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Répondre au client par email' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RespondDevisDto, Object]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "respond", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Assigner un devis à un utilisateur' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "assign", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un devis (SUPER_ADMIN uniquement)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevisController.prototype, "remove", null);
exports.DevisController = DevisController = __decorate([
    (0, swagger_1.ApiTags)('Devis'),
    (0, common_1.Controller)('devis'),
    __metadata("design:paramtypes", [devis_service_1.DevisService])
], DevisController);
//# sourceMappingURL=devis.controller.js.map