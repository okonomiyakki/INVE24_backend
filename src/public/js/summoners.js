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

  const newLeagueInfo = indicateLeagueInfo(leagueInfo);

  injectLeagueInfo(newLeagueInfo);
};

const replaceRankInitials = (rank) => {
  switch (rank) {
    case 'I':
      return 1;
    case 'II':
      return 2;
    case 'III':
      return 3;
    case 'IV':
      return 4;
    default:
      return '?';
  }
};

const indicateLeagueInfo = (leagueInfo) => {
  const rankNum = replaceRankInitials(leagueInfo.rank);

  return {
    profileIconImgSrc: `https://ddragon.leagueoflegends.com/cdn/9.16.1/img/profileicon/${leagueInfo.profileIconId}.png`,
    summonerLevel: `${leagueInfo.summonerLevel}`,
    summonerName: `${leagueInfo.summonerName}`,
    summonerTag: `#${leagueInfo.summonerTag}`,
    leagueIconImgSrc: leagueInfo.tier
      ? `${hostBaseUrl}/img/Rank=${leagueInfo.tier}.png`
      : 'https://img.icons8.com/doodle/96/league-of-legends.png',
    tierRank: leagueInfo.tier ? `${leagueInfo.tier} ${rankNum}` : '랭크 없음',
    lp: leagueInfo.leaguePoints ? `${leagueInfo.leaguePoints} LP` : '- LP',
    wins: leagueInfo.wins ? leagueInfo.wins : '-',
    losses: leagueInfo.losses ? leagueInfo.losses : '-',

    score: leagueInfo.wins
      ? `${leagueInfo.wins + leagueInfo.losses}전 ${leagueInfo.wins}승 ${leagueInfo.losses}패`
      : `전적 없음`,
    rate: leagueInfo.wins
      ? `승률 ${parseInt((leagueInfo.wins / (leagueInfo.wins + leagueInfo.losses)) * 100)}%`
      : `승률 없음`,
  };
};

const injectLeagueInfo = (newLeagueInfo) => {
  injectImgSrc('summoner_profile_icon', newLeagueInfo.profileIconImgSrc);

  injectHTML('summoner_profile_level', newLeagueInfo.summonerLevel);

  injectHTML('summoner_profile_account_name', newLeagueInfo.summonerName);

  injectHTML('summoner_profile_account_tag', newLeagueInfo.summonerTag);

  injectImgSrc('summoner_league_icon', newLeagueInfo.leagueIconImgSrc);

  injectHTML('summoner_league_current_tier_rank', newLeagueInfo.tierRank);

  injectHTML('summoner_league_current_league_points', newLeagueInfo.lp);

  injectHTML('summoner_league_current_score', newLeagueInfo.score);

  injectHTML('summoner_league_current_winning_rate', newLeagueInfo.rate);
};

const handleSummonerLeagueInfoRenewal = () => {
  alert('준비중');
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

const injectImgSrc = (elementId, src) => {
  document.getElementById(elementId).src = src;
};

const showModal = () => {
  // document.getElementById('modal-wrap').style.display = 'flex';
  alert('준비중');
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
