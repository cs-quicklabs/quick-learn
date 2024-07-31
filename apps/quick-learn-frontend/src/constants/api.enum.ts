export enum authApiEnum {
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
}

export enum userApiEnum {
  GET_USER_LIST = '/users/list',
  GET_USER_METADATA = '/users/metadata',
  CREATE_USER = '/users',
  GET_USER = '/users/:uuid',
}