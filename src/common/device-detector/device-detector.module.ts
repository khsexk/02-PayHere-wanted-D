import { Module } from '@nestjs/common';
import { DeviceDetectorService } from './device-detector.service';

@Module({
  providers: [DeviceDetectorService],
  exports: [DeviceDetectorService],
})
export class DeviceDetectorModule {}
