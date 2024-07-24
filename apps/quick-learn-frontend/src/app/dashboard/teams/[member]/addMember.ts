import { z } from "zod";
import { addMemberFormSchema } from "./formSchema";
import { IMemberFieldConfig } from "./MemberForm";

export type AddMemberFormData = z.infer<typeof addMemberFormSchema>;

export const addMemberFormInitialValues: AddMemberFormData = {
  first_name: '',
  last_name: '',
  email: '',
  user_type_id: '',
  password: '',
  confirm_password: '',
  skill_id: '',
}

export const addMemberFields: IMemberFieldConfig<AddMemberFormData>[] = [
  {
    label: 'First Name',
    name: 'first_name',
    type: 'text',
    placeholder: 'John',
  },
  {
    label: 'Last Name',
    name: 'last_name',
    type: 'text',
    placeholder: 'Doe',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'john.doe@gmail.com',
  },
  {
    label: 'User Role',
    name: 'user_type_id',
    type: 'select',
    tooltip:
      'A team member can be either Super Admin, Admin, Editor or Member',
  },
  {
    label: 'New Password',
    name: 'password',
    type: 'password',
    placeholder: '••••••••',
  },
  {
    label: 'Confirm New Password',
    name: 'confirm_password',
    type: 'password',
    placeholder: '••••••••',
  },
  {
    label: 'Primary Skill',
    name: 'skill_id',
    type: 'select',
  },
];
