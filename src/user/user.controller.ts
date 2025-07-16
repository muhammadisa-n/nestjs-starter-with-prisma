import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CustomResponse } from 'src/model/custom.model';
import { RegisterRequest, UserResponse } from 'src/model/user.model';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async register(
    @Body() request: RegisterRequest,
  ): Promise<CustomResponse<UserResponse>> {
    const response = await this.userService.register(request);
    return {
      data: response,
    };
  }
}
