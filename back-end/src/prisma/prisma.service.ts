import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

Decimal.prototype.toJSON = function () {
  return this.toNumber();
};

// Extensão de tipo que adiciona o método $use (reconhecido pelo TS)
type ExtendedPrismaClient = PrismaClient & {
  $use: (middleware: any) => void;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    // Conversão segura com unknown
    (this as unknown as ExtendedPrismaClient).$use(this.dateTimeMiddleware);
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * Middleware para converter Date em ISOString automaticamente
   */
  private dateTimeMiddleware = async (
    params: any,
    next: (params: any) => Promise<any>,
  ) => {
    const result = await next(params);

    const formatDateTime = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;

      for (const key in obj) {
        const value = obj[key];
        if (value instanceof Date) {
          obj[key] = value.toISOString();
        } else if (typeof value === 'object' && value !== null) {
          formatDateTime(value);
        }
      }
    };

    if (Array.isArray(result)) {
      result.forEach(formatDateTime);
    } else if (typeof result === 'object' && result !== null) {
      formatDateTime(result);
    }

    return result;
  };
}
