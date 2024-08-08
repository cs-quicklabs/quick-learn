export enum authApiEnum {
  LOGIN = '/auth/login',
  FORGOT_PASSWORD = '/auth/forgot/password',
  RESET_PASSWORD = '/auth/reset/password',
  LOGOUT = '/auth/logout',
}

export enum userApiEnum {
  GET_USER_LIST = '/users/list',
  GET_USER_METADATA = '/users/metadata',
  CREATE_USER = '/users',
  GET_USER = '/users/:uuid',
  GET_USER_PROFILE = '/profile',
}
