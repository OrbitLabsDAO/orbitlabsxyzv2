let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();

const commonConfig = {
  YEAR: _YEAR,
  CMSURL: "https://cms.orbitlabs.xyz/api/v1/",
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
