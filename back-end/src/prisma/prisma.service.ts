import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Garante que valores Decimal sejam convertidos para número no JSON
(Decimal.prototype as any).toJSON = function () {
  return this.toNumber();
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Chama o super() para inicializar corretamente o PrismaClient
    super({
      log: ['error', 'warn'], // opcional: exibe logs úteis
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Verifica se o método $use realmente existe antes de aplicar
    if (typeof (this as any).$use === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - o typegen do Prisma às vezes não expõe $use
      this.$use(this.dateTimeMiddleware);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * Middleware que converte campos Date em ISOString automaticamente
   */
  private readonly dateTimeMiddleware = async (params: any, next: any) => {
    const result = await next(params);

    const formatDateTime = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;

      for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (value instanceof Date) {
          obj[key] = value.toISOString();
        } else if (typeof value === 'object') {
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
