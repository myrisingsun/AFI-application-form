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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs_1 = require("fs");
const path_1 = require("path");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'localhost',
            port: parseInt(process.env.MAIL_PORT) || 1025,
            secure: false,
            auth: process.env.MAIL_USERNAME
                ? {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                }
                : undefined,
        });
    }
    async sendInvitationEmail(data) {
        try {
            const template = this.loadTemplate('invitation');
            const html = template(data);
            const mailOptions = {
                from: process.env.MAIL_FROM || 'noreply@afi-app.local',
                to: data.candidateEmail,
                subject: 'Приглашение к заполнению анкеты - AFI',
                html,
            };
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Invitation email sent to ${data.candidateEmail}, messageId: ${result.messageId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send invitation email to ${data.candidateEmail}`, error);
            throw error;
        }
    }
    loadTemplate(templateName) {
        const templatePath = (0, path_1.join)(process.cwd(), 'src', 'templates', 'emails', `${templateName}.hbs`);
        try {
            const templateSource = (0, fs_1.readFileSync)(templatePath, 'utf-8');
            return handlebars.compile(templateSource);
        }
        catch (error) {
            this.logger.error(`Failed to load email template: ${templateName}`, error);
            throw new Error(`Email template not found: ${templateName}`);
        }
    }
    async testConnection() {
        try {
            await this.transporter.verify();
            this.logger.log('Email service connection verified');
            return true;
        }
        catch (error) {
            this.logger.error('Email service connection failed', error);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map