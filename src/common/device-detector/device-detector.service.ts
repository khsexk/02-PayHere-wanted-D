import { Injectable } from '@nestjs/common';
import DeviceDetector = require('device-detector-js');

@Injectable()
export class DeviceDetectorService {
  async parse(userAgent: string): Promise<string> {
    const deviceDetector = new DeviceDetector();
    const deviceInfo = deviceDetector.parse(userAgent);

    let parsedUserAgent: string;

    if (!deviceInfo.client) parsedUserAgent = userAgent;
    else {
      parsedUserAgent =
        (deviceInfo.client === null ? '' : deviceInfo.client.name) +
        (deviceInfo.os === null ? '' : deviceInfo.os.name) +
        (deviceInfo.os === null ? '' : deviceInfo.os.version) +
        (deviceInfo.device === null ? '' : deviceInfo.device.type) +
        (deviceInfo.device === null ? '' : deviceInfo.device.model);
    }

    return parsedUserAgent;
  }
}
