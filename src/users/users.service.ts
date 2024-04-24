import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto) {
    const id = uuidv7();

    return this.prisma.user.create({
      data: {
        id: id,
        email: dto.email,
        lastName: dto.lastName,
        firstName: dto.firstName,
        middleName: dto.middleName,
        handle: dto.handle,
        password: dto.password,
        role: { connect: { name: dto.role } },
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({ include: { role: true } });
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

  async promote(slug: string, roleName: string) {
    this.logger.verbose('promoting user', { slug, role: roleName });
    try {
      return await this.prisma.user.update({
        data: { role: { connect: { name: roleName } } },
        where: { handle: slug },
      });
    } catch (error) {
      this.logger.error('cannot promote user', { slug, roleName, error });
      throw new InternalServerErrorException();
    }
  }
}
