import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Ably from 'ably';

@Controller('ably')
export class AblyController {
  private rest: Ably.Rest;

  constructor(cfg: ConfigService) {
    this.rest = new Ably.Rest(cfg.get<string>('ABLY_API_KEY')!);
  }

  // FE gọi /ably/token để lấy token subscribe vào Ably channel
  @Get('token')
  async token() {
    const tokenRequest = await this.rest.auth.createTokenRequest({
      clientId: 'anonymous',
      capability: JSON.stringify({ 'user:*:notifications': ['subscribe'] }),
      ttl: 60 * 60 * 1000,
    });
    return tokenRequest;
  }
}
