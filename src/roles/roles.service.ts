import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const id = uuidv7();
    return await this.prisma.role.create({
      data: {
        id: id,
        name: dto.name,
        authority: dto.authority,
      },
    });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(slug: string) {
    const role = isUUID(slug)
      ? this.prisma.role.findUnique({ where: { id: slug } })
      : this.prisma.role.findUnique({ where: { name: slug } });

    return role;
  }

  async remove(slug: string) {
    return isUUID(slug)
      ? await this.prisma.role.delete({ where: { id: slug } })
      : await this.prisma.role.delete({ where: { name: slug } });
  }
}
