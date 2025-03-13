import { RouteEnum } from '@src/constants/route.enum';
import { SystemPreferencesKey } from '@src/shared/types/contentRepository';
import { UserTypeIdEnum } from 'lib/shared/src';

export type TLink = {
  name: string;
  link: string;
  isExtended?: boolean;
  showCount?: boolean;
  countKey?: SystemPreferencesKey;
  exclude?: UserTypeIdEnum[];
};

const team: TLink = { name: 'Team', link: RouteEnum.TEAM };
const myLearningPath: TLink = {
  name: 'My Learning Paths',
  link: RouteEnum.MY_LEARNING_PATH,
};
const content: TLink = { name: 'Content', link: RouteEnum.CONTENT };
const approvals: TLink = {
  name: 'Approvals',
  link: RouteEnum.APPROVALS,
  showCount: true,
  countKey: SystemPreferencesKey.UNAPPROVED_LESSONS,
};
const flagged: TLink = {
  name: 'Flagged',
  link: RouteEnum.FLAGGED,
  showCount: true,
  countKey: SystemPreferencesKey.FLAGGED_LESSONS,
};
const community: TLink = { name: 'Community', link: RouteEnum.COMMUNITY };

export const adminUserLinks: TLink[] = [
  team,
  myLearningPath,
  content,
  approvals,
  flagged,
];
export const superAdminUserLinks: TLink[] = [...adminUserLinks, community];
export const editorUserLinks: TLink[] = [
  team,
  myLearningPath,
  content,
  flagged,
];
export const memberUserLinks: TLink[] = [myLearningPath];

export const menuItems: TLink[] = [
  {
    name: 'Account Settings',
    link: RouteEnum.ACCOUNT_SETTINGS,
    exclude: [
      UserTypeIdEnum.ADMIN,
      UserTypeIdEnum.EDITOR,
      UserTypeIdEnum.MEMBER,
    ],
  },
  {
    name: 'My Profile',
    link: RouteEnum.PROFILE_SETTINGS,
    exclude: [],
  },
  {
    name: 'Archive',
    link: RouteEnum.ARCHIVED_USERS,
    exclude: [UserTypeIdEnum.EDITOR, UserTypeIdEnum.MEMBER],
  },
  {
    name: 'Leaderboard', //displayed to every user_type
    link: RouteEnum.LEADERBOARD,
    exclude: [],
  },
  {
    name: 'Orphan Courses', // displayed to superAdmin, Admin, editor
    link: RouteEnum.ORPHANCOURSES,
    exclude: [UserTypeIdEnum.MEMBER],
  },
  {
    name: 'Change-Logs',
    link: RouteEnum.CHANGE_LOGS,
    isExtended: true,
    exclude: [],
  },
  {
    name: 'Feature Roadmaps',
    link: RouteEnum.FEATURE_LOGS,
    isExtended: true,
    exclude: [],
  },
];
