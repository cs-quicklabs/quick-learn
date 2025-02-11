export enum authApiEnum {
  LOGIN = '/auth/login',
  FORGOT_PASSWORD = '/auth/forgot/password',
  RESET_PASSWORD = '/auth/reset/password',
  LOGOUT = '/auth/logout',
  GET_USER = '/auth/profile',
  REFRESH_TOKEN = '/auth/refresh',
}

export enum userApiEnum {
  GET_USER_LIST = '/users/list',
  GET_USER_METADATA = '/users/metadata',
  CREATE_USER = '/users',
  GET_USER = '/users/:uuid',
  GET_USER_PROFILE = '/profile',
  CHANGE_PASSWORD = '/profile/change-password',
  USER_PREFERENCES = '/profile/user-preferences',
  ASSIGN_ROADMAPS = 'users/:uuid/assign-roadmaps',
}

export enum accountApiEnum {
  SKILLS = '/skills',
  TEAM = '/team',
  COURSE_CATEGORIES = '/course-categories',
  ROADMAP_CATEGORIES = '/roadmap-categories',
}

export enum FileApiEnum {
  UPLOAD = '/file/upload',
}

export enum ContentRepositoryApiEnum {
  METADATA = '/metadata/content-repository',
  SYSTEM_PREFERNCES = '/metadata/system-preferences',
  ROADMAP = '/roadmap',
  COURSE = '/course',
  LESSON = '/lesson',
  LESSON_UNAPPROVED = '/lesson/unapproved',
  LESSON_ARCHIVED = '/lesson/archived',
  COMMUNITY_COURSES = 'course/community-course', // to fetch only community courses is true
  COMMUNITY = 'course/community', //to fetch courses which are community course , unarchived, unapproved
  GET_USER_ROADMAPS = '/users/my-roadmaps',
  LESSON_PROGRESS = '/lessonprogress',
  LEADERBOARD_STATUS = '/lessonprogress/leaderboard/list',
  LESSON_FLAGGED = '/lesson/flag',
  GET_FLAGGED_LESSON = '/lesson/flagged',
}

export enum ArchivedApiEnum {
  // User-related endpoints
  USERS = 'users',
  INACTIVE_USERS = '/users/inactive',
  ACTIVATE_USER = '/users/activate',
  ARCHIVED_USERS = '/users/archived',

  // Roadmap-related endpoints
  ARCHIVED_ROADMAPS = '/roadmap/archived',
  ACTIVATE_ROADMAP = '/roadmap/activate',

  // Course-related endpoints
  ARCHIVED_COURSES = '/course/archived',
  ACTIVATE_COURSE = '/course/activate',

  // Lesson-related endpoints
  ARCHIVED_LESSONS = '/lesson/archived',
  ACTIVATE_LESSON = '/lesson/activate',
}

export enum LearningPathAPIEnum {
  GET_USER_SEARCH = '/users/search',
  GET_LEARNING_PATHS = '/users/my-roadmaps',
  GET_LEARNING_PATH_ROADMAP = '/users/my-roadmaps/:id',
  GET_LEARNING_PATH_COURSE = '/users/myroadmaps/courses/:id',
  GET_LEARNING_PATH_LESSON = '/users/myroadmaps/lessons/:id',
}

export enum DailyLessionEnum {
  GET_DAILY_LESSON_DETAILS = '/lesson/:lesson/:course/:token',
}
