import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.userRepository.findOne({ 
      where: { email: registerDto.email } 
    });
    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || 'client',
    });

    await this.userRepository.save(user);
    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ 
      where: { email: loginDto.email } 
    });
    
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
  
    const token = await this.generateToken(user);
    
    return {
      access_token: token,
      user: {
        role: user.role,
        email: user.email,
      }
    };
  }

  private generateToken(user: User) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getProfile() {
    return { message: 'This is a protected route' };
  }
}