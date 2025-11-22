import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SharedService } from './shared.service';
import { GqlAuthGuard } from './gql-auth.guard';
import { EmailService } from './EmailService';
import { PrometheusModule } from './prometheus.module';
import { PrometheusController } from './prometheus.controller';
import { PrometheusInterceptor } from './prometheus.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
      envFilePath: '.env', // Specify the path to the .env file
    }), // Ensure ConfigModule is imported
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET'));
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        return {
          secret,
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d' },
        } as JwtModuleOptions;
      },
    }),
    PrometheusModule,
  ],
  controllers: [PrometheusController],
  providers: [
    SharedService,
    GqlAuthGuard,
    EmailService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PrometheusInterceptor,
    },
  ],
  exports: [SharedService, GqlAuthGuard, JwtModule, EmailService, PrometheusModule],
})
export class SharedModule {}