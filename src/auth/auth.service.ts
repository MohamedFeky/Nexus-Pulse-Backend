import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateAuthDto) {
    const existingUser = await this.userModel.findOne({
      email: dto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const token = this.signToken(
      String(newUser._id),
      newUser.email,
      newUser.name,
    );

    return {
      user: {
        id: String(newUser._id),
        name: newUser.name,
        email: newUser.email,
      },
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken(String(user._id), user.email, user.name);

    return {
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
      },
      accessToken: token,
    };
  }

  private signToken(id: string, email: string, name: string) {
    return this.jwtService.sign({
      sub: id,
      email: email,
      name: name,
    });
  }
}
