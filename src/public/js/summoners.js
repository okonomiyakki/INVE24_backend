const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;

document.addEventListener('DOMContentLoaded', function () {
  const storedTokenInfo = localStorage.getItem('tokenInfo');
  const storedLeagueInfo = localStorage.getItem('leagueInfo');

  if (!storedTokenInfo) {
    alert('잘못된 접근입니다.');

    replaceLocation(`${hostBaseUrl}`);
  }

  const leagueInfo = JSON.parse(storedLeagueInfo);

  handleSummonerLeagueInfo(leagueInfo);
});

const handleSummonerLeagueInfo = (leagueInfo) => {
  injectHTML('title', '픽창에서 챔피언을 선택 후<br>조회 버튼을 눌러주세요.');

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
  replaceLocation(`${hostBaseUrl}/summoners`);
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

const replaceLocation = (URL) => {
  window.location.href = URL;
};
