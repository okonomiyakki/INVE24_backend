const title = document.getElementById('title');
const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;

document.addEventListener('DOMContentLoaded', function () {
  const storedInfoData = localStorage.getItem('infoData');
  if (storedInfoData) {
    const infoData = JSON.parse(storedInfoData);
    console.log('infoData:', infoData);

    const summonerName = document.getElementById('summonerName');
    const summonerTier = document.getElementById('summonerTier');

    title.innerHTML = `'${infoData.summonersName}'<br>님의 게임을 조회합니다.`;

    summonerName.innerHTML = `${infoData.summonersName} #${infoData.summonersTag}`;
    summonerTier.innerHTML = infoData.summonersInfo[0]
      ? `${infoData.summonersInfo[0].tier} ${infoData.summonersInfo[0].rank} ${infoData.summonersInfo[0].leaguePoints}LP`
      : '티어 정보가 없습니다.';
  } else {
    console.error('localStorage에 데이터가 존재하지 않습니다.');
  }
});

const reset = () => {
  window.location.href = `${hostBaseUrl}`;
};

const lolRealTimeRequest = () => {
  loading.style.display = 'flex';
  const storedInfoData = localStorage.getItem('infoData');
  if (storedInfoData) {
    const infoData = JSON.parse(storedInfoData);
    console.log('infoData:', infoData);

    axios
      .post(`${hostBaseUrl}/lol/status`, {
        summonersName: infoData.summonersName,
        summonersEncryptedId: infoData.summonersEncryptedId,
      })
      .then((res) => {
        console.log('서버 응답: ', res.data);

        if (res.data.status) {
          window.location.href = `${hostBaseUrl}/summoners/timer`;
        } else {
          if (res.data.errorCode === 404) title.innerHTML = res.data.message;
        }
      })
      .catch((error) => {
        console.error('[Client] 인게임 검색 에러:', error);
      })
      .finally(() => {
        loading.style.display = 'none';
      });
  } else {
    console.error('localStorage에 데이터가 존재하지 않습니다.');
  }
};
