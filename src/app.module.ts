import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AblyModule } from './ably/ably.module';
import { AblyController } from './ably/ably.controller';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AblyModule,
    NotificationsModule,
  ],
  controllers: [AblyController, NotificationsController],
  providers: [PrismaService, NotificationsService],
  // providers: [AppService],
})
export class AppModule {}
