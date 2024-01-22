const summonersInfoRequest = () => {
  const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;

  const summonersName = document.getElementById('summonersNameInput').value;
  const summonersTag = document.getElementById('summonersTagInput').value;

  const title = document.getElementById('title');
  const loading = document.getElementById('loading');

  loading.style.display = 'flex';

  axios
    .post(`${hostBaseUrl}`, {
      summonersName: summonersName,
      summonersTag: summonersTag,
    })
    .then(function (response) {
      console.log('서버 응답: ', response.data);
    })
    .catch(function (error) {
      console.error('에러 발생:', error);
      title.innerHTML = `존재하지 않는 소환사 입니다.`;
    })
    .finally(function () {
      loading.style.display = 'none';
    });
};
