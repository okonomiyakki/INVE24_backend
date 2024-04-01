const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
const title = document.getElementById('title');
const start = document.getElementById('start');
const timeContainer = document.getElementsByClassName('time-container')[0];
const searchBtn = document.getElementById('searchBtn');

/** 랜더링 시간 초기화 */
let epochTime = new Date().getTime();

/** 요청 횟수 초기화 */
let fetchCount = 0;

/** 시간차 초기화 */
let timeDiff;

/** 시간차 배열 초기화 */
let timeDifftList = [];

/** n초 */
let temp = 0;

document.addEventListener('DOMContentLoaded', function () {
  const code = new URLSearchParams(window.location.search).get('code');
  console.log('code:', code);

  if (code) {
    const summonersData = sendCodeToServer(code);

    console.log('summonersData : ', summonersData);
  } else console.log('code not found');

  const storedFetchData = localStorage.getItem('fetchData');

  const storedInfoData = localStorage.getItem('infoData');

  // const storedRsoData = localStorage.getItem('rsoData');

  // console.log('storedRsoData : ', storedRsoData);

  if (storedInfoData) {
    timeContainer.style.display = 'none';

    const infoData = JSON.parse(storedInfoData);

    /** 연타 금지 함수 (브라우저 새로고침 방지용) */
    if (storedFetchData) fetchDisable(fetchCount, temp, infoData);

    const summonerName = document.getElementById('summonerName');
    const summonerTag = document.getElementById('summonerTag');
    const summonerTier = document.getElementById('summonerTier');

    title.innerHTML = `챔피언 픽이 끝난 직후<br>클릭해 주세요.`;

    summonerName.innerHTML = `${infoData.summonersName}`;
    summonerTag.innerHTML = `#${infoData.summonersTag}`;
    summonerTier.innerHTML = infoData.summonersInfo[0]
      ? `${infoData.summonersInfo[0].tier} &nbsp; ${infoData.summonersInfo[0].rank} &nbsp; ${infoData.summonersInfo[0].leaguePoints}LP`
      : '티어 정보가 없습니다.';
  } else {
    console.error(`infoData가 존재하지 않습니다.`);
  }
});

const sendCodeToServer = (code) => {
  axios.get(`${hostBaseUrl}/api/v1.0/oauth/login?code=${code}`).then((res) => {
    const summonersData = res.data;

    // localStorage.setItem('summonersData', JSON.stringify(summonersData));
    return summonersData;
  });
};

const reset = () => {
  localStorage.removeItem('infoData');
  localStorage.removeItem('timeData');
  window.location.href = `${hostBaseUrl}`;
};

const lolRealTimeRequest = () => {
  const storedInfoData = localStorage.getItem('infoData');
  if (storedInfoData) {
    start.style.display = 'none';
    timeContainer.style.display = 'flex';

    /** 로딩 타이머 실행 */
    startAutoIncrement(0);

    const infoData = JSON.parse(storedInfoData);

    title.innerHTML = `'${infoData.summonersName}'<br>님의 게임이 로딩중입니다.`;

    axios
      .post(`${hostBaseUrl}/api/v1.0/spectate/live`, {
        summonersName: infoData.summonersName,
        summonersTag: infoData.summonersTag,
        summonersEncryptedId: infoData.summonersEncryptedId,
      })
      .then((res) => {
        if (res.data.gameStartTime) {
          timeContainer.style.display = 'none';

          const timeData = {
            gameStartTime: res.data.gameStartTime,
            realTimeSeconds: res.data.realTimeSeconds,
          };

          localStorage.setItem('timeData', JSON.stringify(timeData));

          window.location.href = `${hostBaseUrl}/summoners/spectate/live`;
        } else {
          /** 게임중이 아니면 조회 버튼 다시 생기고, 로딩 타이머 제거 */
          start.style.display = 'flex';

          timeContainer.style.display = 'none';

          if (res.data.errorCode === 404) title.innerHTML = res.data.message;
          else if (res.data.errorCode === 429)
            title.innerHTML = res.data.message;
          else title.innerHTML = res.data.message;
        }
        fetchCount++;

        let currentEpochTime = new Date().getTime();

        timeDiff = Math.floor((currentEpochTime - epochTime) / 1000);

        timeDifftList.push(timeDiff);

        if (timeDifftList.length > 3) {
          temp = timeDifftList[fetchCount - 1] - timeDifftList[fetchCount - 4];

          /** 연타 금지 로직 */
          if (fetchCount > temp) fetchDisable(fetchCount, temp);
        }
      })
      .catch((error) => {
        console.error('[Client] game search error:', error);
      });
  } else {
    console.error(`infoData가 존재하지 않습니다.`);
    alert('잘못된 접근입니다.');
    window.location.href = `${hostBaseUrl}`;
  }
};

const fetchDisable = (fetchCount, temp) => {
  const fetchData = {
    fetchDisableSecond: fetchCount + 30,
  };

  localStorage.setItem('fetchData', JSON.stringify(fetchData));

  const storedFetchData = localStorage.getItem('fetchData');

  const currentFetchData = JSON.parse(storedFetchData);

  if (currentFetchData) {
    title.innerHTML = `최근 ${temp}초 동안 ${fetchCount}번 조회하셨습니다.<br>잠시 후에 다시 이용해주세요.`;

    searchBtn.disabled = true;
    searchBtn.style.cursor = 'not-allowed';
    searchBtn.style.backgroundColor = '#5d6e92';
    searchBtn.style.borderColor = '#5d6e92';
    searchBtn.style.fontSize = '40px';

    startAutoIncrementBtn(parseInt(currentFetchData.fetchDisableSecond));
  } else {
    console.error(`fetchData가 존재하지 않습니다.`);
    alert('잘못된 접근입니다.');
    window.location.href = `${hostBaseUrl}`;
  }
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

const updateCounter = (h, m, s) => {
  document.getElementById('realTime').innerText = `${h}:${m}:${s}`;
};

let intervalId;

const startAutoIncrement = (num) => {
  let currentCounter = num;

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    currentCounter++;

    const h = convertSecondsToHMS(currentCounter).h;
    const m = convertSecondsToHMS(currentCounter).m;
    const s = convertSecondsToHMS(currentCounter).s;

    updateCounter(h, m, s);
  }, 1000);
};

const updateBtnCounter = (s) => {
  document.getElementById('searchBtn').innerHTML = `${s}초 후<br>조회`;
};

let btnIntervalId;

const startAutoIncrementBtn = (num) => {
  let currentCounter = num;

  if (btnIntervalId) {
    clearInterval(btnIntervalId);
  }

  btnIntervalId = setInterval(() => {
    currentCounter--;

    if (currentCounter === 0) {
      searchBtn.disabled = false;
      searchBtn.style.cursor = 'pointer';
      searchBtn.innerHTML = '조회';

      searchBtn.style.backgroundColor = '#4171D6';
      searchBtn.style.borderColor = '#4171D6';
      searchBtn.style.fontSize = '50px';

      title.innerHTML = `챔피언 픽이 끝난 직후<br>클릭해 주세요.`;

      /** 랜더링 시간 초기화 */
      epochTime = new Date().getTime();

      /** 시간차 배열 초기화 */
      timeDifftList = [];

      /** 요청 횟수 초기화 */
      fetchCount = 0;

      /** fetch 데이터 초기화 */
      localStorage.removeItem('fetchData');

      clearInterval(btnIntervalId);
    } else updateBtnCounter(currentCounter);
  }, 1000);
};
