const summonersInfoRequest = () => {
  const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;

  const summonersName = document.getElementById('summonersNameInput').value;
  const summonersTag = document.getElementById('summonersTagInput').value;

  const title = document.getElementById('title');
  const loading = document.getElementById('loading');

  loading.style.display = 'flex';

  axios
    .post(`${hostBaseUrl}/api/v1.0/summoners`, {
      summonersName: summonersName,
      summonersTag: summonersTag,
    })
    .then((res) => {
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
      console.error('[Client] summoner search error:', error);
      alert('이름 및 태그를 모두 입력해 주세요.');
    })
    .finally(() => {
      loading.style.display = 'none';
    });
};

const rsoLoginRequest = () => {
  const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
  const riotAuthUrl = document.getElementById('auth').dataset.riotBaseUrlAuth;

  axios.get(`${hostBaseUrl}/api/v1.0/oauth`).then((res) => {
    const rsoLoginUrl = `${riotAuthUrl}?client_id=${res.data.clientId}&redirect_uri=${res.data.redirectUri}&response_type=code&scope=openid+offline_access`;
    window.location.href = rsoLoginUrl;

    // // const code = new URLSearchParams(window.location.search).get('code');
    // const code = new URL(window.location.href).searchParams.get('code');
    // console.log('code:', code);

    // if (code) sendCodeToServer(code);
    // else console.log('code not found');
  });
};

const sendCodeToServer = (code) => {
  axios.get(`${hostBaseUrl}/api/v1.0/oauth/login?code=${code}`).then((res) => {
    const rsoData = res.data;

    localStorage.setItem('rsoData', JSON.stringify(rsoData));
  });
};
