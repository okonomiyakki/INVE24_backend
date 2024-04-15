const fetchRiotOAuthDataAPI = () => {
  axios.get(`${hostBaseUrl}/api/v1.0/oauth`).then((res) => {
    const { clientId, redirectUri } = res.data.data;

    const riotSignOnFormURL = `${riotAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+offline_access`;

    replaceLocation(riotSignOnFormURL);
  });
};

const fetchRiotSignOnAPI = (code) => {
  handleDisplayLoadingSpinner();

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

      removeLocalStorage('tokenInfo');
      removeLocalStorage('leagueInfo');

      replaceLocation(`${hostBaseUrl}`);
    })
    .finally(() => {
      handleHideLoadingSpinner();
    });
};

const fetchLeagueInfoRenewalAPI = () => {
  alert('Access Denied');
};

const fetchCurrentGameStatusAPI = (leagueInfo, retryCnt, MAX_RETRIES) => {
  axios
    .post(`${hostBaseUrl}/api/v2.0/spectate/status`, {
      summonerName: leagueInfo.summonerName,
      summonerTag: leagueInfo.summonerTag,
      encryptedPUUID: leagueInfo.encryptedPUUID,
    })
    .then((res) => {
      const { gameStartTime } = res.data.data;

      fetchCurrentGameAPI(leagueInfo);

      injectHTML('current_game_info', '밴픽이 종료되어 로딩이 진행 중입니다.');

      handleLoadingStop('current_game_status_bar');

      handleLoadingstart('current_game_status_bar', 'yellowgreen');
    })
    .catch((error) => {
      if (error.response.status === 404 && retryCnt < MAX_RETRIES) {
        injectHTML('current_game_info', '현재 밴픽이 진행 중입니다.');

        if (retryCnt === 0)
          handleLoadingstart('current_game_status_bar', 'yellow');

        handleFetchResume(retryCnt, leagueInfo, MAX_RETRIES);
      } else if (error.response.status === 404 && retryCnt >= MAX_RETRIES) {
        clearInterval(intervalFetch);

        alert('현재 게임이 닷지되어 이전 화면으로 돌아갑니다.');

        hideComponent('crrent_game');
        hideComponent('spectate_cancel');

        handleRedirectPrev();
      } else {
        clearInterval(intervalFetch);

        alert(`${error.response.status} ${error.response.data.message}`);

        hideComponent('crrent_game');
        hideComponent('spectate_cancel');

        handleRedirectPrev();
      }
    });
};

const fetchCurrentGameAPI = (leagueInfo) => {
  axios
    .post(`${hostBaseUrl}/api/v2.0/spectate/live`, {
      summonerName: leagueInfo.summonerName,
      summonerTag: leagueInfo.summonerTag,
      encryptedPUUID: leagueInfo.encryptedPUUID,
    })
    .then((res) => {
      const { gameStartTime, realTimeSeconds } = res.data.data;

      handleLoadingStop('current_game_status_bar');

      injectHTML('current_game_info', '게임이 시작되었습니다.');

      hideComponent('current_game_status');

      displayComponent('current_game_timer');

      generateTimer(realTimeSeconds + 1, 'current_game_timer_clock', true);
    })
    .catch((error) => {
      clearInterval(intervalTimer);

      alert(`${error.response.status} ${error.response.data.message}`);

      hideComponent('crrent_game');
      hideComponent('spectate_cancel');

      handleRedirectPrev();
    });
};
