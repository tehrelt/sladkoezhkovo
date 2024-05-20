import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isEmail, isUUID } from 'class-validator';
import { uuidv7 } from 'uuidv7';
import { MinioService } from 'src/minio/minio.service';
import { Bucket } from 'src/minio/minio.consts';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { FiltersDto } from 'src/dto/filters.dto';
import { ROLE } from 'src/enum/role.enum';

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
        role: dto.role,
      },
    });
  }

  async findAll(
    filters?: FiltersDto & Prisma.UserWhereInput,
    select?: Prisma.UserSelect,
  ) {
    const { skip, take, ...where } = filters;

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'asc' },
      include: { image: true },
    });

    const uu = await Promise.all(
      users.map(async (u) => {
        const image = u.image
          ? await this.minio.getFileUrl(u.image.name, Bucket.USER)
          : undefined;

        return {
          ...u,
          image,
        };
      }),
    );

    return {
      users: uu,
      count: await this.prisma.user.count({ where }),
    };
  }

  async findOne(slug: string) {
    const u = isUUID(slug)
      ? this.findById(slug)
      : isEmail(slug)
        ? this.findByEmail(slug)
        : this.findByHandle(slug);
    return await u;
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { image: true },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { image: true },
    });
  }

  async findByHandle(handle: string) {
    return await this.prisma.user.findUnique({
      where: { handle },
      include: { image: true },
    });
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

  async getOwnerships(slug: string) {
    const u = await this.prisma.user.findFirst({
      where: { OR: [{ handle: slug }, { id: slug }] },
      include: {
        factories: { orderBy: { createdAt: 'asc' }, include: { image: true } },
        shops: { orderBy: { createdAt: 'asc' }, include: { image: true } },
      },
    });

    const roles: ROLE[] = ['FACTORY_OWNER', 'SHOP_OWNER'];

    if (!u) {
      throw new NotFoundException();
    }

    if (!roles.includes(u.role)) {
      throw new BadRequestException(
        'Пользователь не является владельцем фабрики или магазина',
      );
    }

    const ownership = await Promise.all(
      u.role === 'FACTORY_OWNER'
        ? u.factories.map(async (i) => ({
            name: i.name,
            handle: i.handle,
            image: i.image
              ? await this.minio.getFileUrl(i.image.name, Bucket.FACTORY)
              : undefined,
          }))
        : u.shops.map(async (i) => ({
            name: i.name,
            handle: i.handle,
            image: i.image
              ? await this.minio.getFileUrl(i.image.name, Bucket.SHOP)
              : undefined,
          })),
    );

    this.logger.verbose('ownerships', { ownership });

    return { items: ownership };
  }

  async getAvatarLink(fileName: string): Promise<string> {
    this.logger.verbose('getting avatar link', { fileName });
    const link = await this.minio.getFileUrl(fileName, Bucket.USER);
    return link;
  }

  async update(id: string, dto: UpdateUserDto) {
    const { file, ...u } = dto;

    const image = file
      ? await this.minio.uploadFile(dto.file, Bucket.USER)
      : undefined;

    this.logger.verbose('updating user', { u, image });

    const f = await this.prisma.user.update({
      where: { id },
      data: {
        ...u,
        image: file
          ? { create: { id: image.id, name: image.fileName } }
          : undefined,
        updatedAt: new Date(),
      },
    });

    return f;
  }
}
