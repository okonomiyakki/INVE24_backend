const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
const title = document.getElementById('title');
const gameStartTime = document.getElementById('gameStartTime');

document.addEventListener('DOMContentLoaded', function () {
  const storedInfoData = localStorage.getItem('infoData');
  if (storedInfoData) {
    const infoData = JSON.parse(storedInfoData);

    title.innerHTML = `'${infoData.summonersName}'<br>님의 게임이 시작되었습니다.`;
  } else {
    console.error(`'localStorage'에 'infoData'가 존재하지 않습니다.`);
  }

  const storedTimeData = localStorage.getItem('timeData');

  if (storedTimeData) {
    const timeData = JSON.parse(storedTimeData);

    console.log('timeData: ', timeData);

    const hours = timeData.gameStartTime.hours;
    const minutes = timeData.gameStartTime.minutes;
    const seconds = timeData.gameStartTime.seconds;

    const h = hours < 10 ? `0${hours}` : hours;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    const s = seconds < 10 ? `0${seconds}` : seconds;

    gameStartTime.innerText = `${h}:${m}:${s}`;

    startAutoIncrement(timeData.realTimeSeconds, 1);
  } else {
    console.error(`'localStorage'에 'timeData'가 존재하지 않습니다.`);
  }
});

const back = () => {
  localStorage.removeItem('timeData');
  window.location.href = `${hostBaseUrl}/summoners`;
};

const reset = () => {
  localStorage.removeItem('infoData');
  localStorage.removeItem('timeData');
  window.location.href = `${hostBaseUrl}`;
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
