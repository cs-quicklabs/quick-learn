import React from 'react';
import { en } from '@src/constants/lang/en';
import { EmptyStateIcons } from './UIElements';

type EmptyStateType = 'users' | 'roadmaps' | 'courses' | 'lessons';

interface EmptyStateProps {
  type: EmptyStateType;
  searchValue?: string;
}

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
  if (searchValue) {
    return {
      title: en.archivedSection.noResults,
      description: en.archivedSection.noResultsDescription
        .replace('{type}', type)
        .replace('{searchTerm}', searchValue),
    };
  }

  // Regular empty state
  switch (type) {
    case 'roadmaps':
      return {
        title: en.dashboard.noRoadmaps,
        description:
          en.dashboard.noRoadmapsDescription || 'No roadmaps available', // TODO: Add to en.ts
      };
    case 'courses':
      return {
        title: en.dashboard.noCourses,
        description:
          en.dashboard.noCoursesDescription || 'No courses available', // TODO: Add to en.ts
      };
    default:
      return {
        title: `No ${type}`,
        description: `No ${type} available`,
      };
  }
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
