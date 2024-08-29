export type AppConfig = {
  env: string;
  name: string;
  workingDirectory: string;
  frontendDomain: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  smtpEmail?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  jwtSecretkey: string;
  jwtExpiryTimeInDays: number;
};
