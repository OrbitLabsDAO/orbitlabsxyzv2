let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();

const commonConfig = {
  YEAR: _YEAR,
};

const envConfigs = {
  local: {
    ...commonConfig,
    ENVIRONMENT: "local",
  },
  production: {
    ...commonConfig,
    ENVIRONMENT: "production",
  },
};

module.exports = (env) => {
  return envConfigs[env] || envConfigs.local;
};
