const summonersInfoRequest = () => {
  const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;

  const summonersName = document.getElementById('summonersNameInput').value;
  const summonersTag = document.getElementById('summonersTagInput').value;

  const title = document.getElementById('title');
  const loading = document.getElementById('loading');

  loading.style.display = 'flex';

  axios
    .post(`${hostBaseUrl}/lol`, {
      summonersName: summonersName,
      summonersTag: summonersTag,
    })
    .then((response) => {
      console.log('서버 응답: ', response.data);

      if (response.data.summonersEncryptedId)
        // window.location.href = `${hostBaseUrl}/info`;
        title.innerHTML = `'${summonersName}' 님의 게임을 조회합니다.`;
      else {
        if (response.data.errorCode === 403)
          title.innerHTML = response.data.message;
        else if (response.data.errorCode === 400)
          title.innerHTML = response.data.message;
        else if (response.data.errorCode === 404)
          title.innerHTML = response.data.message;
      }
    })
    .catch((error) => {
      console.error('[Client] 소환사 검색 에러:', error);
    })
    .finally(() => {
      loading.style.display = 'none';
    });
};
