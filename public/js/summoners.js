const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
const title = document.getElementById('title');
const start = document.getElementById('start');
const timeContainer = document.getElementsByClassName('time-container')[0];

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

    startAutoIncrement(0); //로딩 타이머 실행

    const infoData = JSON.parse(storedInfoData);

    console.log('infoData:', infoData);

    axios
      .post(`${hostBaseUrl}/lol/status`, {
        summonersName: infoData.summonersName,
        summonersEncryptedId: infoData.summonersEncryptedId,
      })
      .then((res) => {
        console.log('서버 응답: ', res.data);

        if (res.data.gameStartTime) {
          timeContainer.style.display = 'none';

          const timeData = {
            gameStartTime: res.data.gameStartTime,
            realTimeSeconds: res.data.realTimeSeconds,
          };

          localStorage.setItem('timeData', JSON.stringify(timeData));

          window.location.href = `${hostBaseUrl}/summoners/timer`;
        } else {
          start.style.display = 'flex';
          timeContainer.style.display = 'none';
          if (res.data.errorCode === 404) title.innerHTML = res.data.message;
          else if (res.data.errorCode === 429)
            title.innerHTML = res.data.message;
          else title.innerHTML = res.data.message;
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
