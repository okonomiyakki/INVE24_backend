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

    const code = new URLSearchParams(window.location.search).get('code');

    console.log(code);

    if (code) riotSignOnFetcher(code);
  });
};

const riotSignOnFetcher = (code) => {
  showLoadingSpinner();

  axios
    .get(`${hostBaseUrl}/api/v1.0/oauth/login?code=${code}`)
    .then((res) => {
      const { tokenId, summonerLeagueInfo } = res.data.data;

      setLocalStorage('tokenInfo', tokenId);
      setLocalStorage('leagueInfo', summonerLeagueInfo);

      replaceLocation(`${hostBaseUrl}/summoners`);
    })
    .catch((error) => {
      console.error('Riot Sign On Error:', error);
      alert(
        'RIOT 서버에 로그인할 수 없습니다. 서비스 관리자에게 문의해주세요.',
      );
    })
    .finally(() => {
      hideLoadingSpinner();
    });
};

const showLoadingSpinner = () => {
  document.getElementById('loading').style.display = 'flex';
};

const hideLoadingSpinner = () => {
  document.getElementById('loading').style.display = 'none';
};

const setLocalStorage = (tag, data) => {
  localStorage.setItem(tag, JSON.stringify(data));
};

const replaceLocation = (URL) => {
  window.location.href = URL;
};
