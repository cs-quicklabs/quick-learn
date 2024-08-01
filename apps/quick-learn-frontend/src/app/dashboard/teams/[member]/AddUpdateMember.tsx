'use client';
import { useRouter, useParams } from 'next/navigation';
import MemberForm from './MemberForm';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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

function setAddFormOptions<T>(field: string, options: T[]) {
  const idx = addMemberFields.findIndex(
    (ele) => ele.name === field && ele.type === 'select',
  );
  if (idx > -1) {
    addMemberFields[idx].options = options as {
      name: string;
      value: string | number;
      id?: string | number | undefined;
    }[];
  }
}

function setEditFormOptions<T>(field: string, options: T[]) {
  const idx = editMemberFields.findIndex(
    (ele) => ele.name === field && ele.type === 'select',
  );
  if (idx > -1) {
    editMemberFields[idx].options = options as {
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
  const [metadata, setMetadata] = useState<TUserMetadata>();
  const [editUserData, setEditUserData] = useState<TUser>();
  const [editInitialValues, setEditInitialValues] = useState(
    editMemberFormInitialValues,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      try {
        const res = await getUserMetadataCall();
        if (!res.success) throw new Error();
        setMetadata(res.data);
      } catch (error) {
        console.error('API call failed:', error);
        toast.error('Something went wrong!');
      }
    })();
  }, []);

  useEffect(() => {
    if (metadata) {
      setAddFormOptions<TUserType>('user_type_id', metadata.user_types);
      setAddFormOptions<TSkill>('skill_id', metadata.skills);
      setEditFormOptions<TUserType>('user_type_id', metadata.user_types);
      setEditFormOptions<TSkill>('skill_id', metadata.skills);
    }
  }, [metadata]);

  useEffect(() => {
    if (!isAddMember) {
      (async function () {
        try {
          const res = await getUserDetails(params.member);
          if (!res.success) throw new Error();
          setEditUserData(res.data);
        } catch (error) {
          console.error('API call failed:', error);
          toast.error('Something went wrong!');
        }
      })();
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
    try {
      setIsLoading(true);
      const res = await createUser({
        ...data,
        team_id: metadata && metadata.skills[0].team_id,
      });
      if (!res.success) throw new Error();
      toast.success(res.message);
      setIsLoading(false);
      router.push(RouteEnum.TEAM);
    } catch (error) {
      console.error('API call failed:', error);
      toast.error('Something went wrong!');
      setIsLoading(false);
    }
  }

  async function handleEditSubmit(data: EditMemberFormData) {
    try {
      setIsLoading(true);
      const res = await updateUser(params.member, data);
      if (!res.success) throw new Error();
      toast.success(res.message);
      router.push(RouteEnum.TEAM);
      setIsLoading(false);
    } catch (error) {
      console.error('API call failed:', error);
      toast.error('Something went wrong!');
      setIsLoading(false);
    }
  }

  if (isAddMember) {
    return (
      <MemberForm<typeof addMemberFormSchema>
        formFields={addMemberFields}
        initialValues={addMemberFormInitialValues}
        onSubmit={handleAddSubmit}
        isAddForm={true}
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
        isAddForm={false}
        schema={editMemberFormSchema}
        loading={isLoading}
      />
    );
  }
};

export default AddUpdateMemberPage;
