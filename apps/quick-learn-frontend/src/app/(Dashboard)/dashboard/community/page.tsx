import CoummintyCourseRepository from './CommunityCourseRepo';

export const metadata = {
  title: 'Free Courses, Community course',
  description: 'Quickly Learn thorugh these courses',
};

export default function Community() {
  return (
    <div>
      <CoummintyCourseRepository />
    </div>
  );
}
