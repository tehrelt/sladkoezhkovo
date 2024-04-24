import { Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger('RolesService');

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const id = uuidv7();
    this.logger.debug(`creating role id=${id} dto=${JSON.stringify(dto)}`);
    return await this.prisma.role.create({
      data: {
        id: id,
        name: dto.name,
        authority: dto.authority,
      },
    });
  }

  findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  findOne(slug: string): Promise<Role | never> {
    this.logger.debug(`looking for role with slug '${slug}'`);
    const role = isUUID(slug)
      ? this.prisma.role.findUnique({ where: { id: slug } })
      : this.prisma.role.findUnique({ where: { name: slug } });

    return role;
  }

  async remove(slug: string): Promise<Role> {
    this.logger.debug('deleting role with slug' + slug);
    return isUUID(slug)
      ? await this.prisma.role.delete({ where: { id: slug } })
      : await this.prisma.role.delete({ where: { name: slug } });
  }
}