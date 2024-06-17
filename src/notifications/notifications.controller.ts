import { Body, Controller, Get, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { NotificationDto } from './dto/notification.dto';
import { MarkAsReadNotificationsDto } from './dto/mark-as-read-notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('/unread')
  @RequiredAuth()
  async unread(@User('id') userId: string) {
    const rawNotifications = await this.service.findAll({
      read: false,
      shipment: {
        ShipmentEntry: {
          some: {
            entry: {
              product: {
                factory: { user: { id: userId } },
              },
            },
          },
        },
      },
    });

    const r: NotificationDto[] = rawNotifications.map((n) => ({
      id: n.id,
      shop: {
        handle: n.shipment.shop.handle,
        name: n.shipment.shop.name,
      },
      retrivedAt: n.createdAt,
      read: n.read,
    }));

    return { notifications: r };
  }

  @Patch('/read')
  @RequiredAuth()
  async read(@Body() data: MarkAsReadNotificationsDto) {
    return await this.service.markAsRead(...data.notifications);
  }
}
