import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { CookieOptions, Response } from 'express';
import { addHours } from 'src/helpers/date';
import { AuthService } from './auth.service';
import { ErrorDto } from 'src/dto/error.dto';

const REFRESH_TOKEN = 'refreshToken';
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  expires: addHours(Number(process.env.JWT_REFRESH_TTL)),
};

@Controller('auth')
@ApiTags('Авторизация')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.service.signUp(dto);
    res.cookie(REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);
    return { accessToken };
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ type: ErrorDto })
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.service.signIn(dto);
    res.cookie(REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);
    return { accessToken };
  }

  @Get('logout')
  @ApiBearerAuth()
  async logout() {}

  @Get('refresh')
  @ApiBearerAuth()
  async refresh() {}

  @Get('profile')
  @ApiOperation({ summary: 'Получение профиля авторизованного пользователя' })
  @ApiBearerAuth()
  async profile() {}
}
