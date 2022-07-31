declare namespace NodeJS {
  export interface ProcessEnv {
    VERCEL_URL?: string;
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;
    DATABASE_URL?: string;
    ENABLE_SLACK_MATCH_NOTIFICATION?: string;
    NEXT_PUBLIC_ENABLE_DEV_LOGIN?: string;
    SLACK_BOT_TOKEN?: string;
    NEXT_PUBLIC_ENABLE_SEASONS?: string;
    SENTRY_IGNORE_API_RESOLUTION_ERROR?: string;
  }
}
