import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'afi_user'),
        password: configService.get('DB_PASSWORD', 'afi_pass'),
        database: configService.get('DB_DATABASE', 'afi_app'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        // Enhanced connection configuration for Windows + Docker
        extra: {
          connectionTimeoutMillis: 10000,
          query_timeout: 10000,
          keepAlive: true,
          keepAliveInitialDelayMillis: 10000,
          // Fix encoding for Cyrillic characters
          client_encoding: 'UTF8',
        },
        charset: 'utf8',
        // Increase pool size and add retry logic
        poolSize: 10,
        connectTimeoutMS: 10000,
        maxQueryExecutionTime: 10000,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}