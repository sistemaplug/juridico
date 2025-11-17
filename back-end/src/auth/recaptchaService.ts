import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReCaptchaService {
  constructor(private readonly configService: ConfigService) {}

  async verifyToken(token: string, action: string): Promise<void> {
    if (!token) {
      throw new HttpException('Recaptcha token não fornecido.', 400);
    }

    const recaptchaSecret = this.configService.get<string>(
      'RECAPTCHA_SECRET_KEY',
    );

    if (!recaptchaSecret) {
      throw new BadRequestException(
        'Chave secreta do reCAPTCHA não configurada.',
      );
    }

    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';

    try {
      const response = await axios.post(
        verificationURL,
        new URLSearchParams({
          secret: recaptchaSecret,
          response: token,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const {
        success,
        score,
        action: returnedAction,
        'error-codes': errorCodes,
      } = response.data;

      if (!success) {
        throw new BadRequestException(
          'Falha na verificação do reCAPTCHA.',
          errorCodes,
        );
      }

      const SCORE_THRESHOLD = 0.5;
      if (score < SCORE_THRESHOLD) {
        throw new BadRequestException(
          'Interação suspeita detectada, baixa confiança.',
        );
      }

      if (returnedAction !== action) {
        throw new BadRequestException('Ação do reCAPTCHA não coincide.');
      }
    } catch (error) {
      console.error(
        'Erro na verificação do reCAPTCHA:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Erro na verificação do reCAPTCHA.');
    }
  }
}
