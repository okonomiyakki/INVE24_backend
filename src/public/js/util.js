const getCodeFromURL = () => {
  return new URLSearchParams(window.location.search).get('code');
};

const isUrlValid = () => {
  if (window.location.href.includes('/summoners')) return true;
  else return false;
};

const resumeCarousle = (slide) => {
  if (!slide.plugins().autoplay.isPlaying()) slide.plugins().autoplay.play();
};

const replaceTierName = (tier) => {
  return tier.charAt(0) + tier.slice(1).toLowerCase();
};

const replaceRankInitials = (rank) => {
  switch (rank) {
    case 'I':
      return 1;
    case 'II':
      return 2;
    case 'III':
      return 3;
    case 'IV':
      return 4;
    default:
      return '?';
  }
};

const indicateLeagueInfo = (leagueInfo) => {
  return {
    profileIconImgSrc: `https://ddragon.leagueoflegends.com/cdn/9.16.1/img/profileicon/${leagueInfo.profileIconId}.png`,
    summonerLevel: `${leagueInfo.summonerLevel}`,
    summonerName: `${leagueInfo.summonerName}`,
    summonerTag: `#${leagueInfo.summonerTag}`,
    leagueIconImgSrc: leagueInfo.tier
      ? `/img/Rank=${replaceTierName(leagueInfo.tier)}.png`
      : 'https://img.icons8.com/doodle/96/league-of-legends.png',
    tierRank: leagueInfo.tier
      ? `${replaceTierName(leagueInfo.tier)} ${replaceRankInitials(leagueInfo.rank)}`
      : '랭크 없음',
    lp: leagueInfo.leaguePoints ? `${leagueInfo.leaguePoints} LP` : '- LP',
    wins: leagueInfo.wins ? leagueInfo.wins : '-',
    losses: leagueInfo.losses ? leagueInfo.losses : '-',

    score: leagueInfo.wins
      ? `${leagueInfo.wins + leagueInfo.losses}전 ${leagueInfo.wins}승 ${leagueInfo.losses}패`
      : `전적 없음`,
    rate: leagueInfo.wins
      ? `승률 ${parseInt((leagueInfo.wins / (leagueInfo.wins + leagueInfo.losses)) * 100)}%`
      : `승률 없음`,
  };
};

const injectLeagueInfo = (newLeagueInfo) => {
  injectImgSrc('summoner_profile_icon', newLeagueInfo.profileIconImgSrc);

  injectHTML('summoner_profile_level', newLeagueInfo.summonerLevel);

  injectHTML('summoner_profile_account_name', newLeagueInfo.summonerName);

  injectHTML('summoner_profile_account_tag', newLeagueInfo.summonerTag);

  injectImgSrc('summoner_league_icon', newLeagueInfo.leagueIconImgSrc);

  injectHTML('summoner_league_current_tier_rank', newLeagueInfo.tierRank);

  injectHTML('summoner_league_current_league_points', newLeagueInfo.lp);

  injectHTML('summoner_league_current_score', newLeagueInfo.score);

  injectHTML('summoner_league_current_winning_rate', newLeagueInfo.rate);
};
