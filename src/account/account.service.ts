import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger('AccountService');

  constructor(private readonly usersService: UsersService) {}

  async profile(id: string): Promise<ProfileDto> {
    const user = await this.usersService.findById(id);

    if (!user) {
      this.logger.error('user not found', { id });
      throw new BadRequestException('invalid user id');
    }

    this.logger.log('user found', user);

    const link = user.image
      ? await this.usersService.getAvatarLink(user.image.name)
      : null;

    return {
      id: user.id,
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      avatarLink: link,
      role: user.role.name,
    };
  }

  updateAvatar(
    id: string,
    file: Express.Multer.File,
  ): string | PromiseLike<string> {
    return this.usersService.updateAvatar(id, file);
  }
}
