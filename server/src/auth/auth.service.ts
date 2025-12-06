import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Retorna dados do usuário (sem senha) + token simples
    // Nota: Em produção, use JWT real
    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePhoto: user.profilePhoto,
        isAdmin: user.isAdmin,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId] = decoded.split(':');
      
      const user = await this.usersService.findOne(userId);
      return user;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
