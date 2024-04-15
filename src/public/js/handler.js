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

  injectHTML('summoner_league_current_winning_rate', newLeagueInfo.rate);
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
  setComponentwidth('current_game_status_bar', '94.5%');
  injectHTML('current_game_status_bar', '100%');
};

const handleIncreaseLoadingBar = (width) => {
  if (width >= 94.5) clearInterval(intervalBanPick);
  else {
    setComponentwidth('current_game_status_bar', `${width}%`);
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
  alert('Access Denied');
};

const handleInve24UpdateInfo = () => {
  alert('Access Denied');
};

const handleLeagueOfLegendsPatchNotes = () => {
  const lol =
    'https://www.leagueoflegends.com/ko-kr/news/game-updates/patch-14-7-notes/';

  replaceLocation(lol);
};

const handleBugReportToDiscord = () => {
  const discord = document.getElementById('discord').dataset.discordBaseUrl;

  replaceLocation(discord);
};

const handleBugReportToGitHub = () => {
  const github = 'https://github.com/okonomiyakki/lol-real-time-watcher/issues';

  replaceLocation(github);
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
      clearInterval(intervalTimer);

      handleRedirectPrev();
    } else handleTimerUpdate(h, m, s);
  }, 1000);
};

const handleRiotLogout = () => {
  localStorage.removeItem('tokenInfo');
  localStorage.removeItem('leagueInfo');

  replaceLocation(`${hostBaseUrl}`);
};
