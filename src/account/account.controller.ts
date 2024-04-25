import { Controller, Get, Logger, Patch, UploadedFile } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UserClaims } from 'src/auth/dto/user-claims.dto';
import { AvatarUpdateResponseDto } from './dto/update-avatar.dto';
import { UploadFile } from 'src/decorators/upload.decorator';

@ApiTags('Аккаунт пользователя')
@Controller('account')
export class AccountController {
  private readonly logger = new Logger('AccountController');

  constructor(private readonly service: AccountService) {}

  @Get('')
  @ApiOperation({ summary: 'Получение профиля авторизованного пользователя' })
  @RequiredAuth()
  @ApiResponse({ type: ProfileDto })
  async profile(@User() { id }: UserClaims): Promise<ProfileDto> {
    this.logger.verbose('getting profile', { id });
    const user = await this.service.profile(id);
    return user;
  }

  @Patch('/avatar')
  @ApiOperation({ summary: 'Обновление фотографии профиля' })
  @RequiredAuth()
  @UploadFile('file')
  @ApiResponse({ status: 200 })
  async updateAvatar(
    @UploadedFile('file') file: Express.Multer.File,
    @User() user: UserClaims,
  ): Promise<AvatarUpdateResponseDto> {
    const link: string = await this.service.updateAvatar(user.id, file);
    return { link };
  }
}
