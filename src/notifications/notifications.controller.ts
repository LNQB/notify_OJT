import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from 'src/dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  // Tạo & gửi thông báo in-app (qua Ably)
  @Post()
  async createInApp(@Body() dto: CreateNotificationDto) {
    return this.svc.createInAppAndDispatch(dto);
  }
}
