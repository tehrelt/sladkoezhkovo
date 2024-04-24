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
        ...dto,
        roleId: '018f0ae2-9777-7409-8057-c61a5edae14b',
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
    return await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findByHandle(handle: string) {
    return await this.prisma.user.findUnique({
      where: { handle },
      include: { role: true },
    });
  }
}
