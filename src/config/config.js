const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGO_DB: Joi.string().required().description('Mongo DB url'),
    APP_URL: Joi.string().required().description('Api url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    AWS_ACCESS_KEY: Joi.string().description('aws access key'),
    AWS_SECRET_KEY: Joi.string().description('aws secret key'),
    AWS_BUCKET_NAME: Joi.string().description('aws bucket name'),
    CDN_URL: Joi.string().description('aws cdn url'),
    GOOGLE_CLIENT_ID: Joi.string().description('google client'),
    GOOGLE_SECRET_KEY: Joi.string().description('google secret key'),
    GOOGLE_CALLBACK_URL: Joi.string().description('google call back url'),
    GITHUB_CLIENT_ID: Joi.string().description('google client'),
    GITHUB_CLIENT_SECRET: Joi.string().description('google secret key'),

  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.APP_PORT,
  appUrl: envVars.APP_URL,
  mongoose: {
    url: envVars.MONGO_DB,
    options: {
    //   useCreateIndex: true,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  }
};
