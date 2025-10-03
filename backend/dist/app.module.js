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
const bull_1 = require("@nestjs/bull");
const app_controller_1 = require("./app.controller");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const candidates_module_1 = require("./modules/candidates/candidates.module");
const invitations_module_1 = require("./modules/invitations/invitations.module");
const documents_module_1 = require("./modules/documents/documents.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const security_check_module_1 = require("./modules/security-check/security-check.module");
const consents_module_1 = require("./modules/consents/consents.module");
const reports_module_1 = require("./modules/reports/reports.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            database_module_1.DatabaseModule,
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379,
                    password: process.env.REDIS_PASSWORD,
                },
            }),
            auth_module_1.AuthModule,
            candidates_module_1.CandidatesModule,
            invitations_module_1.InvitationsModule,
            documents_module_1.DocumentsModule,
            notifications_module_1.NotificationsModule,
            security_check_module_1.SecurityCheckModule,
            consents_module_1.ConsentsModule,
            reports_module_1.ReportsModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map