import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class EncryptIdentifierInterceptor implements NestInterceptor {
  private readonly algorithm = 'aes-256-cbc';
  private readonly passphrase = 'my_super_secret_key';

  private getKey(): Buffer {
    return crypto.createHash('sha256').update(this.passphrase).digest();
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.getKey(), iv);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const sensitiveFields = ['cpf', 'cnpj'];

        const encryptFields = (obj: any): any => {
          if (Array.isArray(obj)) {
            return obj.map(encryptFields);
          }

          if (obj !== null && typeof obj === 'object') {
            const newObj = { ...obj };

            if ('password' in newObj) {
              delete newObj.password;
            }

            Object.keys(newObj).forEach((key) => {
              if (sensitiveFields.includes(key) && newObj[key]) {
                newObj[key] = this.encrypt(newObj[key]);
              }

              if (typeof newObj[key] === 'object') {
                newObj[key] = encryptFields(newObj[key]);
              }
            });

            return newObj;
          }

          return obj;
        };

        return encryptFields(data);
      }),
    );
  }
}
