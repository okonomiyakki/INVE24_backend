const handleFetchConditions = (msg) => {
  injectHTML('current_game_info', msg);
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

const handleCurrentGameFetchError = (intervalId, errorMsg) => {
  clearInterval(intervalId);

  alert(errorMsg);

  hideComponent('crrent_game');

  hideComponent('spectate_cancel');
};
