import AddUpdateMemberPage from './AddUpdateMember';

export const metadata = {
  title: 'Teams • Quick Learn',
  description: 'Teams quick learn',
};

function MemberPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 lg:py-3">
      <AddUpdateMemberPage />
    </main>
  );
}

export default MemberPage;
