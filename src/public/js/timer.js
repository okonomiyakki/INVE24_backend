const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;

let intervalId;

document.addEventListener('DOMContentLoaded', function () {
  const storedTokenInfo = localStorage.getItem('tokenInfo');
  const storedLeagueInfo = localStorage.getItem('leagueInfo');

  const leagueInfo = JSON.parse(storedLeagueInfo);

  injectHTML(
    'title',
    `'${leagueInfo.summonerName}'<br>님의 실시간 협곡 시간을 조회합니다.`,
  );

  hideElement('pick');

  hideElement('load');

  hideElement('backBtn');

  if (!storedTokenInfo) {
    alert('잘못된 접근입니다.');

    localStorage.removeItem('tokenInfo');
    localStorage.removeItem('leagueInfo');

    replaceLocation(`${hostBaseUrl}`);
  }

  let startAtBanPick = false;

  let retryCount = 0;

  const MAX_RETRIES = 30;

  currentGameStatusFetcher(leagueInfo, startAtBanPick, retryCount, MAX_RETRIES);
});

const currentGameStatusFetcher = (
  leagueInfo,
  startAtBanPick,
  retryCount,
  MAX_RETRIES,
) => {
  axios
    .post(`${hostBaseUrl}/api/v2.0/spectate/status`, {
      summonerName: leagueInfo.summonerName,
      summonerTag: leagueInfo.summonerTag,
      encryptedPUUID: leagueInfo.encryptedPUUID,
    })
    .then((res) => {
      const { gameStartTime } = res.data.data;

      console.log(
        '로딩 시작 : ',
        `${gameStartTime.hours}시 ${gameStartTime.minutes}분 ${gameStartTime.seconds}초`,
      );

      injectHTML(
        'title',
        `'${leagueInfo.summonerName}'<br>님의 게임은 현재 로딩중입니다.<br>곧 게임이 시작됩니다.`,
      );

      if (startAtBanPick) {
        injectHTML('banpick', '밴픽 완료');

        hideAnimation('banpick');
      } else {
        showElement('pick');

        injectHTML('banpick', '밴픽 완료');
      }

      showElement('load');

      injectHTML('loading', '로딩중');

      showAnimation('loading');

      if (intervalId) clearInterval(intervalId);

      generateTimer(0, 'realTime', false);

      currentGameFetcher(leagueInfo);
    })
    .catch((error) => {
      // TODO: 최대 조회 횟수 넘겼을때 로직 구현해야함
      if (error.response.status === 404 && retryCount < MAX_RETRIES) {
        injectHTML(
          'title',
          `'${leagueInfo.summonerName}'<br>님의 게임은 현재 밴픽중입니다.<br>곧 로딩이 시작됩니다.`,
        );

        hideElement('load');

        showElement('pick');

        injectHTML('banpick', '밴픽중');

        showAnimation('banpick');

        if (!intervalId) generateTimer(0, 'pickTime', false);

        startAtBanPick = true;

        retryCount++;

        setTimeout(
          () =>
            currentGameStatusFetcher(
              leagueInfo,
              retryCount,
              startAtBanPick,
              MAX_RETRIES,
            ),
          10000,
        );
      } else if (error.response.status === 403 || 500) {
        console.log(`${error.response.status} ${error.response.data.message}`);
        // alert('RIOT 서버 점검 중입니다.'); // TODO: 지우기
        // handleRedirectPrev();
      }
    });
};

const currentGameFetcher = (leagueInfo) => {
  axios
    .post(`${hostBaseUrl}/api/v2.0/spectate/live`, {
      summonerName: leagueInfo.summonerName,
      summonerTag: leagueInfo.summonerTag,
      encryptedPUUID: leagueInfo.encryptedPUUID,
    })
    .then((res) => {
      const { gameStartTime, realTimeSeconds } = res.data.data;

      injectHTML(
        'title',
        `'${leagueInfo.summonerName}'<br>님의 게임이 시작되었습니다.<br>2분 후 이전 페이지로 돌아갑니다.`,
      );

      console.log(
        '게임 시작 : ',
        `${gameStartTime.hours}시 ${gameStartTime.minutes}분 ${gameStartTime.seconds}초`,
      );

      console.log('게임 경과 시간 : ', `${realTimeSeconds}초 경과`);

      injectHTML('loading', '로딩 완료');

      hideAnimation('loading');

      hideElement('pick');

      injectHTML('loading', '협곡 시간');

      if (intervalId) clearInterval(intervalId);

      generateTimer(realTimeSeconds, 'realTime', true);
    })
    .catch((error) => {
      alert(error.response.data.message);

      // handleRedirectPrev();
    });
};

const handleRedirectPrev = () => {
  replaceLocation(`${hostBaseUrl}/summoners`);
};

const convertSecondsToHMS = (seconds) => {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = seconds % 60;

  const h = hours < 10 ? `0${hours}` : hours;
  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return { h, m, s };
};

const updateTimer = (element, h, m, s) => {
  document.getElementById(element).innerText = `${h}:${m}:${s}`;
};

const generateTimer = (num, element, offset) => {
  let currentCounter = num;

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    currentCounter++;

    const { h, m, s } = convertSecondsToHMS(currentCounter);

    if (currentCounter === 120 && offset === true) {
      clearInterval(intervalId);

      handleRedirectPrev();
    } else updateTimer(element, h, m, s);
  }, 1000);
};

const injectHTML = (elementId, content) => {
  document.getElementById(elementId).innerHTML = content;
};

const showElement = (elementId) => {
  document.getElementById(elementId).style.display = 'flex';
};

const hideElement = (elementId) => {
  document.getElementById(elementId).style.display = 'none';
};

const showAnimation = (elementId) => {
  document.getElementById(elementId).classList.add('pending');
};

const hideAnimation = (elementId) => {
  document.getElementById(elementId).classList.remove('pending');
};

const setLocalStorage = (tag, data) => {
  localStorage.setItem(tag, JSON.stringify(data));
};

const replaceLocation = (URL) => {
  window.location.href = URL;
};
