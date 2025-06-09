const config = {
  development: {
    iconBasePath: '/assets/',
    navicon: 'assets/icons/navbar/',
    userdetailicons: '/assets/icons/glass/',
    apiBaseUrl: 'https://localhost:7092/cark/api/user_data',
    apiBaseUrlCarkData: 'https://localhost:7092/cark/api/cark_data',
    apiBaseUrlCevir: 'https://localhost:7092/cark/api/cevir',
    apiBaseUrl3: 'https://localhost:7092/cark/api/user_gecmis',
    apiAdvanceUrl: 'https://localhost:7092/api/advanced',
    apiClaimUrl: `${"api." + window.location.host.split('.').splice(1).join('.')}/api`,
    apigameid: `kazikazan`,
    siteName: 'Norabahis',
    adminApi: 'https://localhost:7092/admin/api/',
    appName: 'HookPanel',
    cfg: 'https://sterlinbetbonus.xyz/admin/config.json',
    imgUrl: `/logo.png`
  },
  production: {
    iconBasePath: '/assets/',
    navicon: 'assets/icons/navbar/',
    userdetailicons: '/assets/icons/glass/',
    apiBaseUrl: `https://${"api." + window.location.host.split('.').splice(1).join('.')}/cark/api/user_data`,
    apiBaseUrlCarkData: `https://${"api." + window.location.host.split('.').splice(1).join('.')}/cark/api/cark_data`,
    apiBaseUrlCevir: `https://${"api." + window.location.host.split('.').splice(1).join('.')}/cark/api/cevir`,
    apiBaseUrl3: `https://${"api." + window.location.host.split('.').splice(1).join('.')}/cark/api/user_gecmis`,
    apiAdvanceUrl: `https://${"api." + window.location.host.split('.').splice(1).join('.')}/api/advanced`,
    apiClaimUrl: `https://${"api." + window.location.host.split('.').splice(1).join('.')}/api`,
    apigameid: `${window.location.hostname.split('.')[0]}`,
    adminApi: `https://${"api." + window.location.host.split('.').splice(1).join('.')}/admin/api/`,
    appName: 'HookPanel',
    cfg: `https://${window.location.hostname.split('.')[0]}/admin/config.json`,
    imgUrl: `/logo.png`
  },
};



const env = 'development';
export default config[env];

