import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';
import { uuidv7 } from 'uuidv7';
import { MinioService } from 'src/minio/minio.service';
import { Bucket } from 'src/minio/minio.consts';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

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

  async findAll(filters: Prisma.UserWhereInput) {
    return await this.prisma.user.findMany({
      where: { ...filters },
      orderBy: { createdAt: 'asc' },
      include: { role: true, image: true },
    });
  }

  async findOne(slug: string) {
    const u = isUUID(slug) ? this.findById(slug) : this.findByHandle(slug);
    return await u;
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { role: true, image: true },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { role: true, image: true },
    });
  }

  async findByHandle(handle: string) {
    return await this.prisma.user.findUnique({
      where: { handle },
      include: { role: true, image: true },
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

  async updateAvatar(id: string, file: Express.Multer.File): Promise<string> {
    const { id: imageId, fileName } = await this.minio.uploadFile(
      file,
      Bucket.USER,
    );

    await this.prisma.user.update({
      data: {
        updatedAt: new Date(),
        image: { create: { id: imageId, name: fileName } },
      },
      where: { id: id },
    });

    return await this.minio.getFileUrl(fileName, Bucket.USER);
  }

  async getAvatarLink(fileName: string): Promise<string> {
    this.logger.verbose('getting avatar link', { fileName });
    const link = await this.minio.getFileUrl(fileName, Bucket.USER);
    return link;
  }
}
