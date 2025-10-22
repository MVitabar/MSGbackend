import { Module } from '@nestjs/common';
import { PhoneUtils } from './phone.utils';

@Module({
  providers: [PhoneUtils],
  exports: [PhoneUtils],
})
export class CommonModule {}
