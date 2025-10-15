import { Injectable, Inject } from '@nestjs/common';
import Ably from 'ably';
import { CreateNotificationDto } from 'src/dto/create-notification.dto';
import { DeliverStatus, NotifChannel } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ABLY_REST') private readonly ably: Ably.Rest,
  ) {}

  /**
   * Tạo notification + recipient, publish in-app qua Ably.
   */
  async createInAppAndDispatch(dto: CreateNotificationDto) {
    // Tránh gửi trùng nếu có dedupKey
    if (dto.dedupKey) {
      const exist = await this.prisma.notification.findFirst({
        where: { dedupKey: dto.dedupKey },
        select: { id: true },
      });
      if (exist) return { notificationId: exist.id, deduped: true };
    }

    const { notification, recipients } = await this.prisma.$transaction(async (tx) => {
      const notification = await tx.notification.create({
        data: {
          templateId: dto.templateId ?? null,
          subject: dto.subject ?? null,
          body: dto.body,
          data: dto.data ?? {},
          category: dto.category ?? null,
          sourceEvent: dto.sourceEvent ?? null,
          dedupKey: dto.dedupKey ?? null,
        },
      });

      const recipients = await Promise.all(
        dto.recipients.map((r) =>
          tx.notificationRecipient.create({
            data: {
              notificationId: notification.id,
              userId: r.userId,
              status: DeliverStatus.queued,
            },
          }),
        ),
      );

      return { notification, recipients };
    });

    // Publish realtime tới từng user
    for (const rec of recipients) {
      const ch = this.ably.channels.get(`user:${rec.userId}:notifications`);
      await ch.publish('notification.created', {
        notificationId: notification.id,
        recipientId: rec.id,
        subject: notification.subject,
        body: notification.body,
        data: notification.data,
        category: notification.category,
        channel: NotifChannel.IN_APP,
        createdAt: new Date().toISOString(),
      });

      await this.prisma.notificationRecipient.update({
        where: { id: rec.id },
        data: { status: DeliverStatus.delivered },
      });
    }

    return { notificationId: notification.id };
  }
}
