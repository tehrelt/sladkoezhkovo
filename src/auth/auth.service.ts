import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserClaimsDto } from './dto/user-claims.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RedisService } from 'src/redis/redis.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { hash, compare } from 'bcryptjs';
import { isEmail } from 'class-validator';

const SALT = Number(process.env.BCRYPT_SALT);

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signUp(dto: SignUpDto) {
    if (!!(await this.usersService.findByEmail(dto.email))) {
      this.logger.debug(`email=${dto.email} already taken`);
      throw new ConflictException('email already taken');
    }

    if (!!(await this.usersService.findByHandle(dto.handle))) {
      this.logger.debug(`handle=${dto.handle} already taken`);
      throw new ConflictException('handle already taken');
    }

    this.logger.debug(`signUp dto=${JSON.stringify(dto)}`);

    const hashPassword = await hash(dto.password, SALT);

    const user = await this.usersService.create({
      ...dto,
      password: hashPassword,
    });

    return await this.generateTokens({ id: user.id });
  }

  async signIn(dto: SignInDto) {
    const user = isEmail(dto.login)
      ? await this.usersService.findByEmail(dto.login)
      : await this.usersService.findByHandle(dto.login);

    if (!user) {
      this.logger.debug(`user not found, user=${JSON.stringify(dto)}`);
      throw new NotFoundException('user not found');
    }

    this.logger.verbose(`user found`, user);

    if (!(await compare(dto.password, user.password))) {
      this.logger.debug(
        `invalid password user=${JSON.stringify(dto)} user.password=${user.password}`,
      );
      throw new BadRequestException('invalid login or password');
    }

    return this.generateTokens({ id: user.id });
  }

  async logout() {}

  async refresh() {}

  async profile() {}

  async generateTokens(dto: UserClaimsDto) {
    this.logger.verbose('generating tokens');
    const accessToken = await this.jwtService.signAsync(dto, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TTL}h`,
    });

    const refreshToken = await this.jwtService.signAsync(dto, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TTL}h`,
    });

    this.logger.verbose('tokens generated', { accessToken, refreshToken });

    this.logger.verbose('saving refresh token');
    await this.redisService.set(dto.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
