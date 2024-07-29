import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicCrudService } from '@src/common/services';
import { UserTypeEntity } from '@src/entities/user_type.entity';
import { Repository } from 'typeorm';
import { UserTypeCodeEnum, UserTypeIdEnum } from '@quick-learn/shared';

@Injectable()
export class UserTypeService extends BasicCrudService<UserTypeEntity> {
  constructor(
    @InjectRepository(UserTypeEntity) repo: Repository<UserTypeEntity>,
  ) {
    super(repo);
  }

  async run() {
    const countSuperAdmin = await this.getUserTypeCount(
      UserTypeCodeEnum.SUPERADMIN,
    );

    if (!countSuperAdmin) {
      await this.createUserType(
        UserTypeIdEnum.SUPERADMIN,
        UserTypeCodeEnum.SUPERADMIN,
        'Super Admin',
        'for super admin user type',
      );
    }

    const countAdmin = await this.getUserTypeCount(UserTypeCodeEnum.ADMIN);

    if (!countAdmin) {
      await this.createUserType(
        UserTypeIdEnum.ADMIN,
        UserTypeCodeEnum.ADMIN,
        'Admin',
        'for admin user type',
      );
    }

    const countEditor = await this.getUserTypeCount(UserTypeCodeEnum.EDITOR);

    if (!countEditor) {
      await this.createUserType(
        UserTypeIdEnum.EDITOR,
        UserTypeCodeEnum.EDITOR,
        'Editor',
        'for editor user type',
      );
    }

    const countMember = await this.getUserTypeCount(UserTypeCodeEnum.MEMBER);

    if (!countMember) {
      await this.createUserType(
        UserTypeIdEnum.MEMBER,
        UserTypeCodeEnum.MEMBER,
        'Member',
        'for member user type',
      );
    }
  }

  async createUserType(
    id: number,
    code: string,
    name: string,
    description?: string,
    active = true,
  ) {
    await this.create({
      id,
      code,
      name,
      active,
      description,
    });
  }

  async getUserTypeCount(code: string): Promise<number> {
    return await this.repository.count({
      where: {
        code,
      },
    });
  }
}
