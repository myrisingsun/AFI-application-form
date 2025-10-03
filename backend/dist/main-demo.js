"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_demo_module_1 = require("./app-demo.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_demo_module_1.AppDemoModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AFI Application Form API (Demo)')
        .setDescription('Demo API with mock data - no database required')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 5000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 AFI Backend (DEMO MODE) running on port ${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`⚠️  Using mock data - no database connection required`);
}
bootstrap();
//# sourceMappingURL=main-demo.js.map