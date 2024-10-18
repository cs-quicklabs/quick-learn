import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { UserTypeService } from './user-type/user-type.service';
import { TeamService } from './team/team.service';
import { UserService } from './user/user.service';
import { SkillService } from './skill/skill.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run the seeding data
  await app.get(UserTypeService).run();
  await app.get(TeamService).run();
  await app.get(SkillService).run();
  await app.get(UserService).run();

  await app.close();
};

void runSeed();
