const Joi = require('joi');

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  HOSTNAME: Joi.string().hostname().default('0.0.0.0'),
  PORT: Joi.number().port().default(3000),
  HOST: Joi.string(),
  MONGODB_URL: Joi.string().required().description('Mongo DB url'),
}).unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  hostname: envVars.HOSTNAME,
  port: envVars.PORT,
  host: envVars.HOST || `${envVars.HOSTNAME}:${envVars.PORT}`,
  mongoose: {
    url: envVars.MONGODB_URL,
  },
};
