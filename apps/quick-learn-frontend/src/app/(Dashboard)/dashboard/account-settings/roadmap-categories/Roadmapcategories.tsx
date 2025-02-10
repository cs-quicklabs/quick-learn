'use client';
import {
  addRoadmapCategory,
  deleteRoadmapCategory,
  getRoadmapCategories,
  updateRoadmapCategory,
} from '@src/apiServices/accountService';
import { TRoadmapCategories } from '@src/shared/types/accountTypes';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useEffect, useState } from 'react';
import BaseLayout from '../BaseLayout';
import AccountSettingConformationModal from '@src/shared/modals/AccountSettiongConformationModal';
import { en } from '@src/constants/lang/en';
import BaseSettingSkeleton from '../BaseSettingsSkeleton';

type formOutput = {
  name: string;
};

function Roadmapcategories() {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [roadmapCategories, setRoadmapCategories] = useState<
    TRoadmapCategories[]
  >([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const onSubmit = (data: formOutput) => {
    setIsLoading(true);
    const payload = { ...data, team_id: 1 };
    addRoadmapCategory(payload)
      .then((res) => {
        showApiMessageInToast(res);
        setRoadmapCategories(res.data.categories);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsPageLoading(true);
    getRoadmapCategories()
      .then((res) => {
        setRoadmapCategories(res.data.categories);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsPageLoading(false));
  }, []);

  const onDelete = (id: number) => {
    setIsEditLoading(true);
    deleteRoadmapCategory(id)
      .then((res) => {
        const data = roadmapCategories.filter((item) => item.id !== id);
        setRoadmapCategories(data);
        showApiMessageInToast(res);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setOpenModal(true);
        } else {
          showApiErrorInToast(err);
        }
      })
      .finally(() => setIsEditLoading(false));
  };

  const onSubmitEditForm = (id: number, data: formOutput) => {
    setIsEditLoading(true);
    updateRoadmapCategory(id, data)
      .then((res) => {
        const { name } = data;
        const updateData = roadmapCategories.map((item) => {
          if (item.id === id) {
            return { ...item, name } as TRoadmapCategories;
          }
          return item;
        });
        setRoadmapCategories(updateData);
        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsEditLoading(false));
  };

  const inputPlaceHolder = {
    label: en.roadmapCategories.inputLabel,
    placeholder: en.roadmapCategories.inputPlaceHolder,
  };

  if (isPageLoading) {
    return <BaseSettingSkeleton />;
  }

  return (
    <>
      <AccountSettingConformationModal
        open={openModal}
        setOpen={setOpenModal}
        title={en.accountSetting.RoadmapDeleteTitle}
        description={en.accountSetting.RoadmapDeleteError}
      />
      <BaseLayout
        heading={en.roadmapCategories.heading}
        subHeading={en.roadmapCategories.subHeading}
        isAddLoading={isLoading}
        onAdd={onSubmit}
        isEditLoading={isEditLoading}
        onDelete={onDelete}
        onEdit={onSubmitEditForm}
        input={inputPlaceHolder}
        tableColumnName={en.roadmapCategories.tableName}
        data={roadmapCategories.map((item) => {
          return { id: item.id, name: item.name };
        })}
      />
    </>
  );
}

export default Roadmapcategories;
