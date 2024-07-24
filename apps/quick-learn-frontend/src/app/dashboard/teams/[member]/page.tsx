'use client';
import { useParams } from 'next/navigation';
import MemberForm from './MemberForm';
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

const AddUpdateMemberPage = () => {
  const params = useParams<{ member: string }>();
  const isAddMember = params.member === 'add';

  function handleAddSubmit(data: AddMemberFormData) {
    console.log(data);
  }

  function handleEditSubmit(data: EditMemberFormData) {
    console.log(data);
  }

  if (isAddMember) {
    return (
      <MemberForm<typeof addMemberFormSchema>
        formFields={addMemberFields}
        initialValues={addMemberFormInitialValues}
        onSubmit={handleAddSubmit}
        isAddForm={true}
      />
    );
  } else {
    return (
      <MemberForm<typeof editMemberFormSchema>
        formFields={editMemberFields}
        initialValues={editMemberFormInitialValues}
        onSubmit={handleEditSubmit}
        isAddForm={false}
      />
    );
  }
};

export default AddUpdateMemberPage;
