declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_FACEBOOK_REDIRECT_URI: string;
      PRIVATE_KEY: string;
    }
  }
}
