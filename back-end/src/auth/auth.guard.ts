import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const tokenInDb = await this.prisma.token.findFirst({
        where: {
          access_token: token,
        },
      });

      if (!tokenInDb || tokenInDb.is_revoked) {
        throw new UnauthorizedException('Token Revogado!');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token Inválido!');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader && typeof authorizationHeader === 'string') {
      const [type, token] = authorizationHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }
    return undefined;
  }
}
