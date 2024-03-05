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

const handleInputName = () => {
  const inputElement = document.getElementById('summonersNameInput');
  const clearNameButton = document.getElementById('clearNameButton');

  if (inputElement.value !== '') clearNameButton.style.display = 'inline-block';
  else clearNameButton.style.display = 'none';
};

const handleInputTag = () => {
  const inputElement = document.getElementById('summonersTagInput');
  const clearTagButton = document.getElementById('clearTagButton');

  if (inputElement.value !== '') clearTagButton.style.display = 'inline-block';
  else clearTagButton.style.display = 'none';
};

const clearInputName = () => {
  const inputElement = document.getElementById('summonersNameInput');
  const clearNameButton = document.getElementById('clearNameButton');

  inputElement.value = '';
  clearNameButton.style.display = 'none';
};

const clearInputTag = () => {
  const inputElement = document.getElementById('summonersTagInput');
  const clearTagButton = document.getElementById('clearTagButton');

  inputElement.value = '';
  clearTagButton.style.display = 'none';
};
