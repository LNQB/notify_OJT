// npm install class-validator

import { IsArray, IsObject, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsOptional() @IsString() templateId?: string;
  @IsOptional() @IsString() subject?: string;
  @IsString() body!: string;
  @IsOptional() @IsObject() data?: Record<string, any>;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() sourceEvent?: string;
  @IsOptional() @IsString() dedupKey?: string;

  @ArrayNotEmpty()
  @IsArray()
  recipients!: { userId: string }[];
}
