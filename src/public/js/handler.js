const handleDenyAccess = () => {
  const storedTokenInfo = localStorage.getItem('tokenInfo');

  if (!storedTokenInfo) {
    alert('잘못된 접근입니다. 올바른 경로로 접근해 주세요.');

    removeLocalStorage('tokenInfo');
    removeLocalStorage('leagueInfo');

    replaceLocation(`${hostBaseUrl}`);
  }
};

const handleComponentLoginAfter = () => {
  hideComponent('rso_login_container');

  displayComponent('summoner_container');
};

const handleComponentCurrentGameFetchAfter = () => {
  hideComponent('summoner_league');

  hideComponent('summoner_fetch');

  displayComponent('crrent_game');

  displayComponent('spectate_cancel');
};

const handleParseLeagueInfo = () => {
  const storedLeagueInfo = getLocalStorage('leagueInfo');

  const leagueInfo = JSON.parse(storedLeagueInfo);

  return leagueInfo;
};

const handleInjectLeagueInfo = () => {
  const leagueInfo = handleParseLeagueInfo();

  const newLeagueInfo = indicateLeagueInfo(leagueInfo);

  injectImgSrc('summoner_profile_icon', newLeagueInfo.profileIconImgSrc);

  injectHTML('summoner_profile_level', newLeagueInfo.summonerLevel);

  injectHTML('summoner_profile_account_name', newLeagueInfo.summonerName);

  injectHTML('summoner_profile_account_tag', newLeagueInfo.summonerTag);

  injectImgSrc('summoner_league_icon', newLeagueInfo.leagueIconImgSrc);

  injectHTML('summoner_league_current_tier_rank', newLeagueInfo.tierRank);

  injectHTML('summoner_league_current_league_points', newLeagueInfo.lp);

  injectHTML('summoner_league_current_score', newLeagueInfo.score);
};

const handleFetchConditions = (msg) => {
  injectHTML('current_game_info', msg);
};

const handleComponentGameStartAfter = () => {
  hideComponent('current_game_status');

  displayComponent('current_game_timer');
};

const handleLoadingstart = (color) => {
  setComponentBackgroundColor('current_game_status_bar', color);

  let width = 0;

  if (intervalLoading) clearInterval(intervalLoading);

  intervalLoading = setInterval(() => {
    width += 0.315;

    handleIncreaseLoadingBar(width, 'current_game_status_bar');
  }, 1000);
};

const handleLoadingStop = () => {
  clearInterval(intervalLoading);
  setComponentWidth('current_game_status_bar', '94.5%');
  injectHTML('current_game_status_bar', '100%');
};

const handleIncreaseLoadingBar = (width) => {
  if (width >= 94.5) clearInterval(intervalBanPick);
  else {
    setComponentWidth('current_game_status_bar', `${width}%`);
    injectHTML('current_game_status_bar', `${width.toFixed(1)}%`);
  }
};

const handleFetchResume = (retryCnt, leagueInfo, MAX_RETRIES) => {
  let currnetRetryCnt = retryCnt;

  if (intervalFetch) clearInterval(intervalFetch);

  intervalFetch = setTimeout(() => {
    currnetRetryCnt++;

    fetchCurrentGameStatusAPI(leagueInfo, currnetRetryCnt, MAX_RETRIES);
  }, 5000);
};

const handleCurrentGameFetchError = (intervalId, errorMsg) => {
  clearInterval(intervalId);

  alert(errorMsg);

  hideComponent('crrent_game');

  hideComponent('spectate_cancel');
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

const handleInve24UpdateInfo = () => {
  alert('준비 중입니다.');
};

const handleLeagueOfLegendsPatchNotes = () => {
  const lol =
    'https://www.leagueoflegends.com/ko-kr/news/game-updates/patch-14-10-notes/';

  replaceLocation(lol);
};

const handleBugReportToDiscord = () => {
  const discord = document.getElementById('discord').dataset.discordBaseUrl;

  replaceLocation(discord);
};

const handleBugReportToGitHub = () => {
  alert('접근이 불가능합니다.');
};

const handleDisplayModal = () => {
  displayComponent('modal');
  displayComponent('modal_background');
};

const handleHideModal = () => {
  hideComponent('modal');
  hideComponent('modal_background');
};

const handleRedirectForSpectate = () => {
  replaceLocation(`${hostBaseUrl}/spectate`);

  // alert(
  //   '현재 라이엇 게임즈 관전 기능 점검으로 인해, 해당 기간 동안 서비스가 제한됩니다.',
  // );

  // replaceLocation(`${hostBaseUrl}/summoners`);
};

const handleDisplayLoadingSpinner = () => {
  displayComponent('spinner');
};

const handleHideLoadingSpinner = () => {
  hideComponent('spinner');
};

const handleTimerUpdate = (h, m, s) => {
  injectHTML('current_game_timer_clock', `${h}:${m}:${s}`);
};

const handleTimerStart = (realTimeSeconds) => {
  let currentRealTimeSeconds = realTimeSeconds;

  if (intervalTimer) clearInterval(intervalTimer);

  intervalTimer = setInterval(() => {
    currentRealTimeSeconds++;

    const { h, m, s } = convertSecondsToHMS(currentRealTimeSeconds);

    if (currentRealTimeSeconds === 120) {
      handleCurrentGameFetchError(
        intervalTimer,
        `게임 시작 후 2분이 경과되어 이전 화면으로 돌아갑니다.`,
      );

      handleRedirectPrev();
    } else handleTimerUpdate(h, m, s);
  }, 1000);
};

const handleTokenClear = () => {
  localStorage.removeItem('tokenInfo');
  localStorage.removeItem('leagueInfo');

  replaceLocation(`${hostBaseUrl}`);
};
