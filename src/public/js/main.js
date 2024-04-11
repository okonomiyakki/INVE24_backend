const handleRiotOAuth2Redirect = () => {
  const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
  const riotAuthUrl = document.getElementById('auth').dataset.riotBaseUrlAuth;

  riotOAuthDataFetcher(hostBaseUrl, riotAuthUrl);
};

const riotOAuthDataFetcher = (hostBaseUrl, riotAuthUrl) => {
  axios.get(`${hostBaseUrl}/api/v1.0/oauth`).then((res) => {
    const { clientId, redirectUri } = res.data.data;

    const riotSignOnFormURL = `${riotAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+offline_access`;

    replaceLocation(riotSignOnFormURL);
  });
};

const replaceLocation = (URL) => {
  window.location.href = URL;
};
