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

      handleFetchConditions('밴픽이 종료되어 현재 로딩 진행 중입니다.');

      handleLoadingStop();

      handleLoadingstart('yellowgreen');
    })
    .catch((error) => {
      if (error.response.status === 404 && retryCnt < MAX_RETRIES) {
        handleFetchConditions(
          '밴픽 상태 정보를 가져오는 중입니다...<br>최대 5분이 소요될 수 있습니다.',
        );

        if (retryCnt === 0) handleLoadingstart('yellow');

        handleFetchResume(retryCnt, leagueInfo, MAX_RETRIES);
      } else if (error.response.status === 404 && retryCnt >= MAX_RETRIES) {
        handleCurrentGameFetchError(
          intervalFetch,
          `${leagueInfo.summonerName}님이 현재 참여하신 게임이 밴픽 도중 닷지되었습니다. 이전 화면으로 돌아갑니다.`,
        );

        handleRedirectPrev();
      } else {
        handleCurrentGameFetchError(
          intervalFetch,
          `(${error.response.status}) ${error.response.data.message}`,
        );

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

      handleLoadingStop();

      handleFetchConditions('게임이 시작되었습니다.');

      handleComponentGameStartAfter();

      handleTimerStart(realTimeSeconds + 1);
    })
    .catch((error) => {
      handleCurrentGameFetchError(
        intervalTimer,
        `(${error.response.status}) ${error.response.data.message}`,
      );

      handleRedirectPrev();
    });
};
