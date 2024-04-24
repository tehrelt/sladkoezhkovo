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

    return {
      id: user.id,
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      avatarId: user.imageId,
      role: user.role.name,
    };
  }
}
