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
    .then((res) => {
      console.log('서버 응답: ', res.data);

      if (res.data.summonersEncryptedId) {
        const infoData = {
          summonersName,
          summonersTag,
          summonersEncryptedId: res.data.summonersEncryptedId,
          summonersInfo: res.data.summonersInfo,
        };

        localStorage.setItem('infoData', JSON.stringify(infoData));

        window.location.href = `${hostBaseUrl}/summoners`;
      } else {
        if (res.data.errorCode === 403) title.innerHTML = res.data.message;
        else if (res.data.errorCode === 400) title.innerHTML = res.data.message;
        else if (res.data.errorCode === 404) title.innerHTML = res.data.message;
        else title.innerHTML = res.data.message;
      }
    })
    .catch((error) => {
      console.error('[Client] 소환사 검색 에러:', error);
    })
    .finally(() => {
      loading.style.display = 'none';
    });
};

const loginForRiotAccount = () => {};
