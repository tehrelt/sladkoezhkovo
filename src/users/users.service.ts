import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto) {
    const id = uuidv7();

    return this.prisma.user.create({
      data: {
        id: id,
        email: dto.email,
        firstName: dto.firstName,
        middleName: dto.firstName,
        lastName: dto.lastName,
        handle: dto.handle,
        roleId: '018f0ae2-9777-7409-8057-c61a5edae14b',
        password: dto.password,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(slug: string) {
    const u = isUUID(slug)
      ? this.prisma.user.findUnique({ where: { id: slug } })
      : this.prisma.user.findUnique({ where: { handle: slug } });
    return await u;
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findByHandle(handle: string) {
    return await this.prisma.user.findUnique({ where: { handle } });
  }
}