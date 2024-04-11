const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;

document.addEventListener('DOMContentLoaded', function () {
  const code = new URLSearchParams(window.location.search).get('code');

  if (code) riotSignOnFetcher(code);
  else handleSummonerLeagueInfo();
});

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

      localStorage.removeItem('tokenInfo');
      localStorage.removeItem('leagueInfo');

      replaceLocation(`${hostBaseUrl}`);
    })
    .finally(() => {
      hideLoadingSpinner();
    });
};

const handleSummonerLeagueInfo = () => {
  const storedTokenInfo = localStorage.getItem('tokenInfo');
  const storedLeagueInfo = localStorage.getItem('leagueInfo');

  if (!storedTokenInfo) {
    alert('잘못된 접근입니다.');

    localStorage.removeItem('tokenInfo');
    localStorage.removeItem('leagueInfo');

    replaceLocation(`${hostBaseUrl}`);
  }

  const leagueInfo = JSON.parse(storedLeagueInfo);

  console.log('leagueInfo : ', leagueInfo);

  injectHTML('summoner_profile_account_name', `${leagueInfo.summonerName}`);

  injectHTML('summoner_profile_account_tag', `#${leagueInfo.summonerTag}`);

  injectHTML(
    'summoner_league_current_tier_rank',
    leagueInfo.tier
      ? `${leagueInfo.tier} ${leagueInfo.rank}`
      : '티어 정보가 없습니다.',
  );

  injectHTML(
    'summoner_league_current_league_points',
    `${leagueInfo.leaguePoints} LP`,
  );

  injectHTML(
    'summoner_league_current_winning_rate',
    `${leagueInfo.wins}승 ${leagueInfo.losses}패 승률 ${parseInt((leagueInfo.wins / (leagueInfo.wins + leagueInfo.losses)) * 100)}%`,
  );
};

const handleYesBtnClick = () => {
  replaceLocation(`${hostBaseUrl}/summoners/spectate/live`);
};

const handleNoBtnClick = () => {
  document.getElementById('modal-wrap').style.display = 'none';
};

const handleRiotLogout = () => {
  localStorage.removeItem('tokenInfo');
  localStorage.removeItem('leagueInfo');

  replaceLocation(`${hostBaseUrl}`);
};

const injectHTML = (elementId, content) => {
  document.getElementById(elementId).innerHTML = content;
};

const showModal = () => {
  // document.getElementById('modal-wrap').style.display = 'flex';
  alert('no contents');
};

const showLoadingSpinner = () => {
  document.getElementById('bg').style.display = 'flex';
  document.getElementById('loading').style.display = 'flex';
};

const hideLoadingSpinner = () => {
  document.getElementById('bg').style.display = 'none';
  document.getElementById('loading').style.display = 'none';
};

const setLocalStorage = (tag, data) => {
  localStorage.setItem(tag, JSON.stringify(data));
};

const replaceLocation = (URL) => {
  window.location.href = URL;
};
