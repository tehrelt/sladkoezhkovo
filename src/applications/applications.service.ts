import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { ListDto } from 'src/dto/list.dto';
import { Application } from './entities/application.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger('ApplicationService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  async create(dto: CreateApplicationDto) {
    this.logger.verbose('Creating a new application', dto);

    const candidate = await this.prisma.application.findFirst({
      where: { OR: [{ email: dto.email }, { handle: dto.handle }] },
    });
    if (candidate) {
      throw new ConflictException('Заявка с этим данными уже была подана');
    }

    const emailExists = await this.userService.findOne(dto.email);
    if (emailExists) {
      throw new ConflictException('Email занят');
    }

    const handleExists = await this.userService.findOne(dto.handle);
    if (handleExists) {
      throw new ConflictException('Handle занят');
    }

    const id = uuidv7();

    return await this.prisma.application.create({
      data: {
        id,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        handle: dto.handle,
        middleName: dto.middleName,
        role: dto.role,
      },
    });
  }

  async approve(id: string) {
    this.logger.verbose('Approving application', id);
    const a = await this.prisma.application.findFirst({ where: { id } });

    if (!a) {
      throw new ConflictException('Заявка не найдена');
    }

    if (a.approved) {
      throw new BadRequestException('Заявка уже была одобрена');
    }

    const application = await this.prisma.application.update({
      where: { id },
      data: { approved: true },
    });
    this.logger.verbose('Application approved', application);

    this.authService.signUp({
      password: 'password',
      ...application,
    });

    try {
      await this.mailerService.send({
        to: application.email,
        subject: '[sladkoezhkovo] Заявка на регистрацию подтверждена',
        html: `<h2>Здравствуйте, ${application.firstName} ${application.lastName}!</h2>
      <p>Ваша заявка на регистрацию подтверждена.</p>
      <p>Данные для входа:</p>
      <p>Логин: ${application.handle}</p>
      <p>Пароль: password</p>
      `,
      });

      this.logger.verbose('Mail sent');
    } catch (error) {
      this.logger.error('error while sending mail', error);
    }
  }

  async findAll(): Promise<ListDto<Application>> {
    const aa = await this.prisma.application.findMany();

    const items: Application[] = aa.map(
      (item): Application => ({
        id: item.id,
        role: item.role,
        lastName: item.lastName,
        firstName: item.firstName,
        middleName: item.middleName,
        email: item.email,
        handle: item.handle,
        approved: item.approved,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    );

    return {
      items,
      count: await this.prisma.application.count(),
    };
  }

  async findOne(id: string): Promise<Application> {
    const item = await this.prisma.application.findUnique({
      where: { id },
    });
    return {
      id: item.id,
      role: item.role,
      lastName: item.lastName,
      firstName: item.firstName,
      middleName: item.middleName,
      email: item.email,
      handle: item.handle,
      approved: item.approved,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    return await this.prisma.application.update({
      where: { id },
      data: {
        ...updateApplicationDto,
      },
    });
  }
}
