export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3002,
  jwtKey: process.env.JWT_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  mailerUser: process.env.MAILER_USER,
  frontendUrl: process.env.FRONTEND_URL,
  mobileUiUrl: process.env.MOBILE_UI_URL,
  isEmailSendingEnable: process.env.IS_EMAIL_SENDING_ENABLE === 'true',
  redisConnectionString: process.env.REDIS_CONNECTION_STRING,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  htmlPdf: {
    endpoint: process.env.HTML_PDF_ENDPOINT,
    xApiKey: process.env.HTML_PDF_X_API_KEY,
  },
  employmentHero: {
    apiKey: process.env.EMPLOYMENT_HERO_API_KEY,
    baseUrl: process.env.EMPLOYMENT_HERO_BASE_URL,
  },
  google: {
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: process.env.GOOGLE_PROJECT_ID,
    logName: process.env.LOG_NAME,
  },
});
