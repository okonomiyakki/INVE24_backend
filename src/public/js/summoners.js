const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;

document.addEventListener('DOMContentLoaded', function () {
  injectHTML('title', '픽창에서 챔피언을 선택 후<br>조회 버튼을 눌러주세요.');

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

      const storedTokenInfo = localStorage.getItem('tokenInfo');

      if (!storedTokenInfo) {
        alert('잘못된 접근입니다.');

        localStorage.removeItem('tokenInfo');
        localStorage.removeItem('leagueInfo');

        replaceLocation(`${hostBaseUrl}`);
      }

      handleSummonerLeagueInfo();
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

const handleSummonerLeagueInfo = () => {
  const storedLeagueInfo = localStorage.getItem('leagueInfo');

  const leagueInfo = JSON.parse(storedLeagueInfo);

  console.log('leagueInfo : ', leagueInfo);

  injectHTML('summonerName', `${leagueInfo.summonerName}`);

  injectHTML('summonerTag', `${leagueInfo.summonerTag}`);

  injectHTML(
    'summonerTier',
    leagueInfo.tier
      ? `${leagueInfo.tier} &nbsp; ${leagueInfo.rank} &nbsp; ${leagueInfo.leaguePoints}LP`
      : '티어 정보가 없습니다.',
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
  document.getElementById('modal-wrap').style.display = 'flex';
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
