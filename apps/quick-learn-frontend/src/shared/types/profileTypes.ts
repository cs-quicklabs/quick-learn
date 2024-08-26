export type TUserProfileType = {
  first_name: string;
  last_name: string;
  profile_image: string | File;
};

export type TChangePasswordType = {
  oldPassword: string;
  newPassword: string;
};
export type TChangePreferenceType = {
  preference: boolean;
};
