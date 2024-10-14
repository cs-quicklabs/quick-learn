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
  ROADMAP = '/roadmap',
  COURSE = '/course',
  LESSON = '/lesson',
}

export enum ArchivedApiEnum {
  ARCHIVED_USERS = '/users/archived',
  ARCHIVED_ROADMAPS = '/roadmap-categories',
}
