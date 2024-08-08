import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProfileService {
  constructor(private usersService: UsersService) {}

  async getUserProfile() {}
}
