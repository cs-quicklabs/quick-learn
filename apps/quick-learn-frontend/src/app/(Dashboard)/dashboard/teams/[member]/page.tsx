import AddUpdateMemberPage from './AddUpdateMember';

export const metadata = {
  title: 'Teams • Quick Learn',
  description: 'Teams quick learn',
};

const MemberPage = () => {
  return (
    <main className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 lg:py-6">
      <AddUpdateMemberPage />
    </main>
  );
};

export default MemberPage;
