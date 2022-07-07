import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async hash(anyString: string): Promise<string> {
    const saltOrRounds = 10;
    const encryptedString = await bcrypt.hash(anyString, saltOrRounds);
    return encryptedString;
  }

  async compare(anyString: string, encryptedString: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(anyString, encryptedString);
    return isMatch;
  }
}
