import { CreateSkillDto } from './create-skill.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateSkillDto extends OmitType(CreateSkillDto, ['team_id']) {}
