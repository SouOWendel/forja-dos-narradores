import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Forja dos Narradores API - Server is running! 🚀';
  }
}
