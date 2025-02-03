'use client';
import { useRouter, useParams } from 'next/navigation';
import MemberForm from './MemberForm';
import { useEffect, useState } from 'react';
import {
  TSkill,
  TUser,
  TUserMetadata,
  TUserType,
} from '@src/shared/types/userTypes';
import { RouteEnum } from '@src/constants/route.enum';
import {
  addMemberFields,
  AddMemberFormData,
  addMemberFormInitialValues,
} from './addMember';
import { addMemberFormSchema, editMemberFormSchema } from './formSchema';
import {
  editMemberFields,
  EditMemberFormData,
  editMemberFormInitialValues,
} from './editMember';
import {
  createUser,
  getUserDetails,
  getUserMetadataCall,
  updateUser,
} from '@src/apiServices/teamService';
import { showErrorMessage } from '@src/utils/helpers';
import { FullPageLoader } from '@src/shared/components/UIElements';
import { useAppDispatch } from '@src/store/hooks';
import {
  increamentTotalUsers,
  decrementTotalUsers,
} from '@src/store/features/teamSlice';
import { showApiMessageInToast } from '@src/utils/toastUtils';

type TOption = { name: string; value: string | number; id?: string | number };

function setFormOptions<T>(
  formFields: Array<{ name: string; type: string; options?: TOption[] }>,
  field: string,
  options: T[],
) {
  const idx = formFields.findIndex(
    (ele) => ele.name === field && ele.type === 'select',
  );
  if (idx > -1) {
    formFields[idx].options = options as {
      name: string;
      value: string | number;
      id?: string | number | undefined;
    }[];
  }
}

const AddUpdateMemberPage = () => {
  const router = useRouter();
  const params = useParams<{ member: string }>();
  const isAddMember = params.member === 'add';
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<TUserMetadata>();
  const [editUserData, setEditUserData] = useState<TUser>();
  const [editInitialValues, setEditInitialValues] = useState(
    editMemberFormInitialValues,
  );
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsPageLoading(true);
    getUserMetadataCall()
      .then((res) => {
        setMetadata(res.data);
        setFormOptions<TUserType>(
          addMemberFields,
          'user_type_id',
          res.data.user_types,
        );
        setFormOptions<TSkill>(addMemberFields, 'skill_id', res.data.skills);
        setFormOptions<TUserType>(
          editMemberFields,
          'user_type_id',
          res.data.user_types,
        );
        setFormOptions<TSkill>(editMemberFields, 'skill_id', res.data.skills);
      })
      .catch((error) => showErrorMessage(error))
      .finally(() => setIsPageLoading(false));
  }, []);

  useEffect(() => {
    if (!isAddMember) {
      setIsPageLoading(true);

      getUserDetails(params.member)
        .then((res) => {
          setEditUserData(res.data);
        })
        .catch((error) => showErrorMessage(error))
        .finally(() => setIsLoading(false));
    }
  }, [isAddMember, params.member]);

  useEffect(() => {
    if (editUserData) {
      setEditInitialValues({
        first_name: editUserData.first_name,
        last_name: editUserData.last_name,
        email: editUserData.email,
        active: String(editUserData.active),
        skill_id: String(editUserData.skill_id),
        user_type_id: String(editUserData.user_type_id),
      });
    }
  }, [editUserData]);

  async function handleAddSubmit(data: AddMemberFormData) {
    setIsLoading(true);
    createUser({
      ...data,
      team_id: metadata?.skills[0]?.team_id,
    })
      .then((res) => {
        dispatch(increamentTotalUsers());
        showApiMessageInToast(res);
        router.push(RouteEnum.TEAM);
      })
      .catch((error) => showErrorMessage(error))
      .finally(() => setIsLoading(false));
  }

  async function handleEditSubmit(data: EditMemberFormData) {
    setIsLoading(true);
    updateUser(params.member, data)
      .then((res) => {
        if (data.active === 'false') {
          dispatch(decrementTotalUsers());
        }
        showApiMessageInToast(res);
        router.push(RouteEnum.TEAM);
      })
      .catch((error) => showErrorMessage(error))
      .finally(() => setIsLoading(false));
  }

  function render() {
    if (isAddMember) {
      return (
        <MemberForm<typeof addMemberFormSchema>
          formFields={addMemberFields}
          initialValues={addMemberFormInitialValues}
          onSubmit={handleAddSubmit}
          schema={addMemberFormSchema}
          loading={isLoading}
        />
      );
    } else {
      return (
        <MemberForm<typeof editMemberFormSchema>
          formFields={editMemberFields}
          initialValues={editInitialValues}
          onSubmit={handleEditSubmit}
          schema={editMemberFormSchema}
          loading={isLoading}
        />
      );
    }
  }

  return (
    <>
      {isPageLoading && <FullPageLoader />}
      {render()}
    </>
  );
};

export default AddUpdateMemberPage;
