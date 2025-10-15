import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Ably from 'ably';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'ABLY_REST',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const key = cfg.get<string>('ABLY_API_KEY');
        if (!key) throw new Error('ABLY_API_KEY missing');
        return new Ably.Rest(key);
      },
    },
  ],
  exports: ['ABLY_REST'],
})
export class AblyModule {}
