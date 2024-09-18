'use client';
import {
  addSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from '@src/apiServices/accountService';
import { TSkill } from '@src/shared/types/accountTypes';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import {en} from '@src/constants/lang/en';
import React, { useEffect, useState } from 'react';
import BaseLayout from '../BaseLayout';

type AddSkillType = {
  name: string;
};

const Primaryskills = () => {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [primarySkills, setPrimarySkills] = useState<TSkill[]>([]);

  const onSubmitEditForm = (id: number, data: Partial<TSkill>) => {
    setIsEditLoading(true);
    updateSkill(id, data)
      .then((res) => {
        const name = data.name;
        const updateSkills = primarySkills.map((skill) => {
          if (skill.id === id) {
            return { ...skill, name } as TSkill;
          }
          return skill;
        });
        setPrimarySkills(updateSkills);
        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsEditLoading(false));
  };

  const onSubmit = (data: AddSkillType) => {
    setIsLoading(true);
    const payload = { ...data, team_id: 1 };
    addSkill(payload)
      .then((res) => {
        showApiMessageInToast(res);
        setPrimarySkills(res.data.skills);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsPageLoading(true);
    getSkills()
      .then((res) => {
        setPrimarySkills(res.data.skills);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsPageLoading(false));
  }, []);

  const onDelete = (id: number) => {
    setIsEditLoading(true);
    deleteSkill(id)
      .then((res) => {
        const skill = primarySkills.filter((skill) => skill.id !== id);
        setPrimarySkills(skill);
        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsEditLoading(false));
  };

  const inputPlaceHolder = {
    label: en.primarySkills.inputLabel,
    placeholder: en.primarySkills.inputPlaceHolder,
  };

  return (
    <BaseLayout
      heading={en.primarySkills.heading}
      subHeading={en.primarySkills.subHeading}
      isAddLoading={isLoading}
      isEditLoading={isEditLoading}
      onAdd={onSubmit}
      onDelete={onDelete}
      onEdit={onSubmitEditForm}
      input={inputPlaceHolder}
      tableColumnName={en.primarySkills.tableName}
      data={primarySkills.map((item) => {
        return { id: item.id, name: item.name };
      })}
      isPageLoading={isPageLoading}
    />
  );
};

export default Primaryskills;
