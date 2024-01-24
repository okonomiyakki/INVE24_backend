const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
const title = document.getElementById('title');
const start = document.getElementById('start');
const timeContainer = document.getElementsByClassName('time-container')[0];
const searchBtn = document.getElementById('searchBtn');
let epochTime = new Date().getTime(); // 랜더링 시간 초기화
let fetchCount = 0; // 요청 횟수 초기화
let timeDiff; // 시간 차이 초기화
let timeDifftList = []; // 시간차 배열 초기화
let temp = 0; // n초

document.addEventListener('DOMContentLoaded', function () {
  const storedInfoData = localStorage.getItem('infoData');
  if (storedInfoData) {
    timeContainer.style.display = 'none';

    const infoData = JSON.parse(storedInfoData);

    const summonerName = document.getElementById('summonerName');
    const summonerTag = document.getElementById('summonerTag');
    const summonerTier = document.getElementById('summonerTier');

    title.innerHTML = `'${infoData.summonersName}'<br>님의 게임을 조회합니다.`;

    summonerName.innerHTML = `${infoData.summonersName}`;
    summonerTag.innerHTML = `#${infoData.summonersTag}`;
    summonerTier.innerHTML = infoData.summonersInfo[0]
      ? `${infoData.summonersInfo[0].tier} ${infoData.summonersInfo[0].rank} ${infoData.summonersInfo[0].leaguePoints}LP`
      : '티어 정보가 없습니다.';
  } else {
    console.error(`'localStorage'에 'infoData'가 존재하지 않습니다.`);
  }
});

const reset = () => {
  window.location.href = `${hostBaseUrl}`;
};

const lolRealTimeRequest = () => {
  const storedInfoData = localStorage.getItem('infoData');
  if (storedInfoData) {
    start.style.display = 'none';
    timeContainer.style.display = 'flex';

    startAutoIncrement(0); // 로딩 타이머 실행

    const infoData = JSON.parse(storedInfoData);

    title.innerHTML = `'${infoData.summonersName}'<br>님의 게임이 로딩중입니다.<br>게임이 시작되면 화면이 전환됩니다.`;

    // console.log('infoData:', infoData);

    axios
      .post(`${hostBaseUrl}/lol/status`, {
        summonersName: infoData.summonersName,
        summonersEncryptedId: infoData.summonersEncryptedId,
      })
      .then((res) => {
        // console.log('서버 응답: ', res.data);

        if (res.data.gameStartTime) {
          timeContainer.style.display = 'none';

          const timeData = {
            gameStartTime: res.data.gameStartTime,
            realTimeSeconds: res.data.realTimeSeconds,
          };

          localStorage.setItem('timeData', JSON.stringify(timeData));

          window.location.href = `${hostBaseUrl}/summoners/timer`;
        } else {
          // 게임중이 아니면 조회 버튼 다시 생기고, 로딩 타이머 제거
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

        // console.log('fetchCount, timeDiff :', fetchCount, timeDiff);
        // console.log('timeDifftList        :', timeDifftList);

        if (timeDifftList.length > 3) {
          temp = timeDifftList[fetchCount - 1] - timeDifftList[fetchCount - 4];
          // console.log('temp :', temp);

          if (fetchCount > temp) {
            title.innerHTML = `최근 ${temp}초 동안 ${fetchCount}번이나 조회하셨습니다.<br>30초 이후에 다시 이용해주세요.`;

            searchBtn.disabled = true;
            searchBtn.style.cursor = 'not-allowed';
            searchBtn.style.backgroundColor = '#5d6e92';
            searchBtn.style.borderColor = '#5d6e92';
            searchBtn.style.fontSize = '40px';

            startAutoIncrementBtn(30, infoData);
          }
        }
      })
      .catch((error) => {
        console.error('[Client] 인게임 검색 에러:', error);
      })
      .finally(() => {
        loading.style.display = 'none';
      });
  } else {
    console.error(`'localStorage'에 'infoData'가 존재하지 않습니다.`);
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
  document.getElementById('time').innerText = `${h}:${m}:${s}`;
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

const startAutoIncrementBtn = (num, infoData) => {
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

      title.innerHTML = `'${infoData.summonersName}'<br>님의 게임을 조회합니다.`;

      epochTime = new Date().getTime(); // 랜더링 시간 초기화
      timeDifftList = []; // 시간차 배열 초기화
      fetchCount = 0; // 요청 횟수 초기화
      clearInterval(btnIntervalId);
    } else updateBtnCounter(currentCounter);
  }, 1000);
};
