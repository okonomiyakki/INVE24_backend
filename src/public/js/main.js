const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
const riotAuthUrl = document.getElementById('auth').dataset.riotBaseUrlAuth;

let intervalLoading;
let intervalFetch;
let intervalTimer;

document.addEventListener('DOMContentLoaded', function () {
  handleCarousel('usage_carousel');

  if (isUrlInclude('summoners')) {
    const code = getCodeFromURL();

    if (code) fetchRiotSignOnAPI(code);
    else handleSummonerLeagueInfo();
  } else if (isUrlInclude('spectate')) {
    handleSummonerSpectateInfo();
  }
});
