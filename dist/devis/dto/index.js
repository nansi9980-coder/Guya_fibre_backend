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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAmountDto = exports.DevisQueryDto = exports.RespondDevisDto = exports.AddNoteDto = exports.UpdateDevisStatusDto = exports.CreateDevisDto = exports.Urgency = exports.DevisStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var DevisStatus;
(function (DevisStatus) {
    DevisStatus["NEW"] = "NEW";
    DevisStatus["PENDING"] = "PENDING";
    DevisStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DevisStatus["QUOTE_SENT"] = "QUOTE_SENT";
    DevisStatus["ACCEPTED"] = "ACCEPTED";
    DevisStatus["REJECTED"] = "REJECTED";
    DevisStatus["CANCELLED"] = "CANCELLED";
})(DevisStatus || (exports.DevisStatus = DevisStatus = {}));
var Urgency;
(function (Urgency) {
    Urgency["LOW"] = "LOW";
    Urgency["NORMAL"] = "NORMAL";
    Urgency["HIGH"] = "HIGH";
    Urgency["URGENT"] = "URGENT";
})(Urgency || (exports.Urgency = Urgency = {}));
class CreateDevisDto {
}
exports.CreateDevisDto = CreateDevisDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "clientEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "clientPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDevisDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: Urgency }),
    (0, class_validator_1.IsEnum)(Urgency),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "urgency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDevisDto.prototype, "website", void 0);
class UpdateDevisStatusDto {
}
exports.UpdateDevisStatusDto = UpdateDevisStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DevisStatus }),
    (0, class_validator_1.IsEnum)(DevisStatus),
    __metadata("design:type", String)
], UpdateDevisStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDevisStatusDto.prototype, "amount", void 0);
class AddNoteDto {
}
exports.AddNoteDto = AddNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddNoteDto.prototype, "content", void 0);
class RespondDevisDto {
}
exports.RespondDevisDto = RespondDevisDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RespondDevisDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RespondDevisDto.prototype, "body", void 0);
class DevisQueryDto {
}
exports.DevisQueryDto = DevisQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], DevisQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], DevisQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: DevisStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DevisStatus),
    __metadata("design:type", String)
], DevisQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DevisQueryDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: Urgency }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Urgency),
    __metadata("design:type", String)
], DevisQueryDto.prototype, "urgency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DevisQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DevisQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DevisQueryDto.prototype, "endDate", void 0);
var update_amount_dto_1 = require("./update-amount.dto");
Object.defineProperty(exports, "UpdateAmountDto", { enumerable: true, get: function () { return update_amount_dto_1.UpdateAmountDto; } });
//# sourceMappingURL=index.js.map