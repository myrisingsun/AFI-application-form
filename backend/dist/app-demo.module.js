"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDemoModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const email_module_1 = require("./modules/email/email.module");
const invitations_controller_1 = require("./modules/invitations/invitations.controller");
const invitations_mock_service_1 = require("./modules/invitations/invitations.mock.service");
const invitations_service_1 = require("./modules/invitations/invitations.service");
let AppDemoModule = class AppDemoModule {
};
exports.AppDemoModule = AppDemoModule;
exports.AppDemoModule = AppDemoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            email_module_1.EmailModule,
        ],
        controllers: [app_controller_1.AppController, invitations_controller_1.InvitationsController],
        providers: [
            {
                provide: invitations_service_1.InvitationsService,
                useClass: invitations_mock_service_1.InvitationsMockService,
            },
        ],
    })
], AppDemoModule);
//# sourceMappingURL=app-demo.module.js.map