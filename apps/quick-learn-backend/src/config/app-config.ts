export type AppConfig = {
  env: string;
  name: string;
  workingDirectory: string;
  frontendDomain: string;
  backendDomain: string;
  port: number;
  cronjobEnabled: boolean;
  apiPrefix: string;
  smtpEmail?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
};
