import React from 'react';
import { en } from '@src/constants/lang/en';
import { EmptyStateIcons } from './UIElements';

type EmptyStateType = 'users' | 'roadmaps' | 'courses' | 'lessons';

interface EmptyStateProps {
  type: EmptyStateType;
  searchValue?: string;
}

type NoArchivedKeys =
  | 'noArchivedUsers'
  | 'noArchivedUsersDescription'
  | 'noArchivedRoadmaps'
  | 'noArchivedRoadmapsDescription'
  | 'noArchivedCourses'
  | 'noArchivedCoursesDescription'
  | 'noArchivedLessons'
  | 'noArchivedLessonsDescription';

const EMPTY_STATE_ICON_MAP: Record<EmptyStateType, React.ReactNode> = {
  users: EmptyStateIcons.inbox,
  roadmaps: EmptyStateIcons.book,
  courses: EmptyStateIcons.courses,
  lessons: EmptyStateIcons.document,
} as const;

const getIconByType = (type: EmptyStateType): React.ReactNode => {
  return EMPTY_STATE_ICON_MAP[type] ?? EmptyStateIcons.document;
};

const getTextByType = (type: EmptyStateType, searchValue?: string) => {
  const titleKey = `noArchived${
    type.charAt(0).toUpperCase() + type.slice(1)
  }` as NoArchivedKeys;
  const descriptionKey = `noArchived${
    type.charAt(0).toUpperCase() + type.slice(1)
  }Description` as NoArchivedKeys;

  const texts = {
    title: searchValue
      ? en.archivedSection.noResults
      : en.archivedSection[titleKey],
    description: searchValue
      ? en.archivedSection.noResultsDescription
          .replace('{type}', type)
          .replace('{searchTerm}', searchValue)
      : en.archivedSection[descriptionKey],
  };
  return texts;
};

const EmptyState: React.FC<EmptyStateProps> = ({ type, searchValue }) => {
  const icon = getIconByType(type);
  const { title, description } = getTextByType(type, searchValue);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyState;
