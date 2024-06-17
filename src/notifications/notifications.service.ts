import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Prisma } from '@prisma/client';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNotificationDto) {
    const id = uuidv7();

    return await this.prisma.notification.create({
      data: { id, shipment: { connect: { id: data.shipmentId } } },
    });
  }

  async markAsRead(...ids: string[]) {
    return await this.prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { read: true, updatedAt: new Date() },
    });
  }

  async findAll(f: Prisma.NotificationWhereInput) {
    const r = await this.prisma.notification.findMany({
      where: f,
      include: {
        shipment: {
          include: {
            shop: { include: { owner: true } },
          },
        },
      },
    });
    return r;
  }
}
