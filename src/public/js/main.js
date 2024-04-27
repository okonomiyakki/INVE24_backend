const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
const riotAuthUrl = document.getElementById('auth').dataset.riotBaseUrlAuth;

const MAX_RETRIES = 60;

let intervalLoading;
let intervalFetch;
let intervalTimer;

document.addEventListener('DOMContentLoaded', function () {
  playCarousel('usage_carousel');

  if (isUrlInclude('summoners')) {
    const code = getCodeFromURL();

    if (code) fetchRiotSignOnAPI(code);
    else getSummonerLeagueInfo();
  } else if (isUrlInclude('spectate')) {
    getSummonerSpectateInfo();
  }
});

const getSummonerLeagueInfo = () => {
  handleDenyAccess();

  handleComponentLoginAfter();

  handleInjectLeagueInfo();
};

const getSummonerSpectateInfo = () => {
  alert(
    '현재 라이엇 게임즈 관전 기능 점검으로 인해, 해당 기간 동안 서비스가 제한됩니다.',
  );

  replaceLocation(`${hostBaseUrl}`);

  // handleDenyAccess();

  // handleComponentLoginAfter();

  // handleInjectLeagueInfo();

  // handleComponentCurrentGameFetchAfter();

  // fetchCurrentGameStatusAPI(handleParseLeagueInfo(), 0, MAX_RETRIES);
};
