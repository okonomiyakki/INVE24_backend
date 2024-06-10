const handleDenyAccess = () => {
  const storedTokenInfo = localStorage.getItem('tokenInfo');

  if (!storedTokenInfo) {
    alert('잘못된 접근입니다. 올바른 경로로 접근해 주세요.');

    removeLocalStorage('tokenInfo');
    removeLocalStorage('leagueInfo');

    replaceLocation(`${hostBaseUrl}`);
  }
};

const handleTokenClear = () => {
  localStorage.removeItem('tokenInfo');
  localStorage.removeItem('leagueInfo');

  replaceLocation(`${hostBaseUrl}`);
};

const handleParseLeagueInfo = () => {
  const storedLeagueInfo = getLocalStorage('leagueInfo');

  const leagueInfo = JSON.parse(storedLeagueInfo);

  return leagueInfo;
};

const handleInjectLeagueInfo = () => {
  const leagueInfo = handleParseLeagueInfo();

  const newLeagueInfo = indicateLeagueInfo(leagueInfo);

  injectImgSrc('summoner_profile_icon', newLeagueInfo.profileIconImgSrc);

  injectHTML('summoner_profile_level', newLeagueInfo.summonerLevel);

  injectHTML('summoner_profile_account_name', newLeagueInfo.summonerName);

  injectHTML('summoner_profile_account_tag', newLeagueInfo.summonerTag);

  injectImgSrc('summoner_league_icon', newLeagueInfo.leagueIconImgSrc);

  injectHTML('summoner_league_current_tier_rank', newLeagueInfo.tierRank);

  injectHTML('summoner_league_current_league_points', newLeagueInfo.lp);

  injectHTML('summoner_league_current_score', newLeagueInfo.score);
};
