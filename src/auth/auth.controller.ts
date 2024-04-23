import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { CookieOptions, Request, Response } from 'express';
import { addHours } from 'src/helpers/date';
import { AuthService } from './auth.service';
import { ErrorDto } from 'src/dto/error.dto';
import { AuthGuard } from './auth.guard';

const REFRESH_TOKEN = 'refreshToken';
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  expires: addHours(Number(process.env.JWT_REFRESH_TTL)),
};

@Controller('auth')
@ApiTags('Авторизация')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(private readonly service: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.service.signUp(dto);

    this.logger.verbose('saving cookie', { refreshToken });
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
    this.logger.verbose('saving cookie', { refreshToken });
    res.cookie(REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);
    return { accessToken };
  }

  @Get('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.service.logout(req['user'].id);
    this.logger.verbose('clearing cookie');
    res.clearCookie(REFRESH_TOKEN);
  }

  @Get('refresh')
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.verbose('refreshing token', { cookies: req.cookies });
    const token = req.cookies[REFRESH_TOKEN];
    if (!token) {
      this.logger.verbose('refresh token is missing');
      throw new BadRequestException('refresh token is missing');
    }

    const { accessToken, refreshToken } = await this.service.refresh(token);

    this.logger.verbose('saving new token cookie');
    res.cookie(REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);

    return { accessToken };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Получение профиля авторизованного пользователя' })
  @ApiBearerAuth()
  async profile() {}
}
