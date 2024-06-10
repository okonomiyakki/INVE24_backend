const handleDenyAccessForInspect = (endPoint) => {
  alert(
    '현재 라이엇 게임즈 관전 기능 점검으로 인해, 해당 기간 동안 서비스를 이용하실 수 없습니다.',
  );

  replaceLocation(endPoint);
};

const handleRedirectForSpectate = () => {
  // handleDenyAccessForInspect(`${hostBaseUrl}/summoners`);

  replaceLocation(`${hostBaseUrl}/spectate`);
};

const handleRedirectPrev = () => {
  replaceLocation(`${hostBaseUrl}/summoners`);
};

const handleNavBar = () => {
  const storedTokenInfo = localStorage.getItem('tokenInfo');
  const logoutRedirectUri =
    'https://login.riotgames.com/end-session-redirect?redirect_uri=https%3A%2F%2Fauth.riotgames.com%2Flogout&state=622911e9676b67201e557d76e9';

  if (!storedTokenInfo) {
    alert('현재 로그인이 되어있지 않습니다.');
  } else {
    if (confirm('로그아웃을 하시겠습니까?')) {
      openLocation(logoutRedirectUri);
      replaceLocation(`${hostBaseUrl}`);
      handleTokenClear();
    }
  }
};

const handleLeagueOfLegendsPatchNotes = () => {
  const lol =
    'https://www.leagueoflegends.com/ko-kr/news/game-updates/patch-14-11-notes/';

  replaceLocation(lol);
};

const handleBugReportToDiscord = () => {
  const discord = document.getElementById('discord').dataset.discordBaseUrl;

  replaceLocation(discord);
};

const handleInve24UpdateInfo = () => {
  alert('준비 중입니다.');
};

const handleBugReportToGitHub = () => {
  alert('접근이 불가능합니다.');
};
