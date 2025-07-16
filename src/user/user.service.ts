import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { RegisterRequest, UserResponse } from 'src/model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prismaService: PrismaService,
  ) {}
  async register(request: RegisterRequest): Promise<UserResponse> {
    this.logger.info('Registering user');
    const data: RegisterRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    ) as RegisterRequest;
    const existingUser = await this.prismaService.user.count({
      where: { username: data.username },
    });
    if (existingUser > 0) {
      throw new HttpException('Username already exists', 400);
    }

    data.password = await bcrypt.hash(data.password, 10);
    const user = await this.prismaService.user.create({
      data: data,
    });
    return {
      username: user.username,
      name: user.name,
    };
  }
}
