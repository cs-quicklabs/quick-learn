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

type formOutput = {
  name: string;
};

const Roadmapcategories = () => {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [roadmapCategories, setRoadmapCategories] = useState<
    TRoadmapCategories[]
  >([]);

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
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsEditLoading(false));
  };

  const onSubmitEditForm = (id: number, data: formOutput) => {
    setIsEditLoading(true);
    updateRoadmapCategory(id, data)
      .then((res) => {
        const name = data.name;
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
    label: 'Add New Roadmap Category',
    placeholder: 'Engineering',
  };

  return (
    <BaseLayout
      heading="Roadmap Categories"
      subHeading='Roadmaps can belong to a category. A category could be a way to group learning roadmaps. For example, a department can have a category called "Engineering" and all the roadmaps related to engineering can be added to this category.'
      isAddLoading={isLoading}
      onAdd={onSubmit}
      isEditLoading={isEditLoading}
      onDelete={onDelete}
      onEdit={onSubmitEditForm}
      input={inputPlaceHolder}
      tableColumnName="Category name"
      data={roadmapCategories.map((item) => {
        return { id: item.id, name: item.name };
      })}
      isPageLoading={isPageLoading}
    />
  );
};

export default Roadmapcategories;
