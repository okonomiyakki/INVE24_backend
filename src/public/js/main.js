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
  handleDenyAccess();

  handleComponentLoginAfter();

  handleInjectLeagueInfo();

  handleComponentCurrentGameFetchAfter();

  fetchCurrentGameStatusAPI(handleParseLeagueInfo(), 0, MAX_RETRIES);
};
