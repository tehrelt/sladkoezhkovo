export class NotificationDto {
  id: string;
  shop: {
    name: string;
    handle: string;
  };
  retrivedAt: Date;
  read: boolean;
}
