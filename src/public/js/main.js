const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
const riotAuthUrl = document.getElementById('auth').dataset.riotBaseUrlAuth;

document.addEventListener('DOMContentLoaded', function () {
  handleCarousel('usage_carousel');

  if (isUrlValid()) {
    const code = getCodeFromURL();

    if (code) fetchRiotSignOnAPI(code);
    else handleSummonerLeagueInfo();
  }
});
