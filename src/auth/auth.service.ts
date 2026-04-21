import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    const { password: _, ...result } = user;
    return result;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ ...dto, password: hashed });
    const { password: _, ...result } = user;
    return this.buildTokenResponse(result);
  }

  async login(user: { id: string; email: string; role: string; name: string }) {
    return this.buildTokenResponse(user);
  }

  private buildTokenResponse(user: { id: string; email: string; role: string; name: string }) {
    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}
