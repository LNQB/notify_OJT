import { Injectable, INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Fix: 'beforeExit' không nằm trong các event type khai báo bởi PrismaClient (typescript "never" error)
    // Giải pháp: ép kiểu về any để tránh lỗi typescript, không ảnh hưởng thực thi.
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}
