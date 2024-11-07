'use client';
import {
  addCourseCategory,
  deleteCourseCategory,
  getCourseCategories,
  updateCourseCategory,
} from '@src/apiServices/accountService';
import { TCourseCategories } from '@src/shared/types/accountTypes';
import { en } from '@src/constants/lang/en';

import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import React, { useContext, useEffect, useState } from 'react';
import BaseLayout from '../BaseLayout';
import { UserContext } from '@src/context/userContext';
import AccountSettingConformationModal from '@src/shared/modals/AccountSettiongConformationModal';
import BaseSettingSkeleton from '../BaseSettingsSkeleton';

type formOutput = {
  name: string;
};

const Coursecategories = () => {
  const { user } = useContext(UserContext);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [courseCategories, setCourseCategories] = useState<TCourseCategories[]>(
    [],
  );
  const [openModal, setOpenModal] = useState<boolean>(false);

  const onSubmit = (data: formOutput) => {
    setIsLoading(true);
    const payload = { ...data, team_id: user?.team_id };
    addCourseCategory(payload)
      .then((res) => {
        showApiMessageInToast(res);
        setCourseCategories(res.data.categories);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsPageLoading(true);
    getCourseCategories()
      .then((res) => {
        setCourseCategories(res.data.categories);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsPageLoading(false));
  }, []);

  const onDelete = (id: number) => {
    setIsEditLoading(true);
    deleteCourseCategory(id)
      .then((res) => {
        const data = courseCategories.filter((item) => item.id !== id);
        setCourseCategories(data);
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
    updateCourseCategory(id, data)
      .then((res) => {
        const name = data.name;
        const updateData = courseCategories.map((item) => {
          if (item.id === id) {
            return { ...item, name };
          }
          return item;
        });
        setCourseCategories(updateData);
        showApiMessageInToast(res);
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsEditLoading(false));
  };

  const heading = en.courseCategories.heading;
  const subHeading = en.courseCategories.subHeading;
  const inputPlaceHolder = {
    label: en.courseCategories.inputlabel,
    placeholder: en.courseCategories.inputPlaceHolder,
  };

  if (isPageLoading) {
    return <BaseSettingSkeleton />;
  }

  return (
    <>
      <AccountSettingConformationModal
        open={openModal}
        setOpen={setOpenModal}
        title={en.accountSetting.courseDeleteTitle}
        description={en.accountSetting.courseDeleteError}
      />
      <BaseLayout
        heading={heading}
        subHeading={subHeading}
        isAddLoading={isLoading}
        isEditLoading={isEditLoading}
        onAdd={onSubmit}
        onDelete={onDelete}
        onEdit={onSubmitEditForm}
        input={inputPlaceHolder}
        tableColumnName={en.courseCategories.tableName}
        data={courseCategories.map((item) => {
          return { id: item.id, name: item.name };
        })}
      />
    </>
  );
};

export default Coursecategories;
