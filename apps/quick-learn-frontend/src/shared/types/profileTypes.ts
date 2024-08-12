export type TUserProfileType = {
  firstName: string;
  lastName: string;
  profileImage: string | File;
};
export type TChangePasswordType = {
  oldPassword: string;
  newPassword: string;
};
export type TChangePreferenceType = {
  preference: boolean;
};
