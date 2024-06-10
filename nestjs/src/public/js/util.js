const getCodeFromURL = () => {
  return new URLSearchParams(window.location.search).get('code');
};

const isUrlInclude = (path) => {
  if (window.location.href.includes(path)) return true;
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
      return '';
  }
};

const replaceTierImgSrc = (tier) => {
  switch (tier) {
    case 'IRON':
      return 'ae88c3c3-798f-4cfb-8ae6-9942288a3aa8';
    case 'BRONZE':
      return 'c514be0b-7a69-46ba-93ac-0ab1f3f27a87';
    case 'SILVER':
      return '86773901-c027-4270-8e7d-b4e284e4b52d';
    case 'GOLD':
      return '2992b070-fdb0-489c-81cd-fc833336085b';
    case 'PLATINUM':
      return 'f6481639-922b-4208-99f1-d0aae56bf274';
    case 'EMERALD':
      return 'a2af7a63-db02-4f4a-a72f-4fc242a19159';
    case 'DIAMOND':
      return 'eafa5a9a-0c15-4f62-9ea3-d7b5f1d3de01';
    case 'MASTER':
      return 'bafe6caf-bb48-4128-9bea-ac7406a124af';
    case 'GRANDMASTER':
      return 'fea35c67-386a-4670-b643-83236898afb8';
    case 'CHALLENGER':
      return 'd5a69cba-b3fd-434b-88f6-1ad43908473d';
    default:
      return '';
  }
};

const replaceRankForMasterLeagues = (leagueInfo) => {
  if (leagueInfo.tier === 'MASTER') leagueInfo.rank = '';
  else if (leagueInfo.tier === 'GRANDMASTER') leagueInfo.rank = '';
  else if (leagueInfo.tier === 'CHALLENGER') leagueInfo.rank = '';

  return leagueInfo;
};

const replaceSummonerNameFontSize = (summonerName) => {
  if (summonerName.length >= 12)
    setComponentFontSize('summoner_profile_account_name', '17px');
  else if (summonerName.length >= 10)
    setComponentFontSize('summoner_profile_account_name', '20px');
  else if (summonerName.length >= 8)
    setComponentFontSize('summoner_profile_account_name', '22px');
  else return;
};

const indicateLeagueInfo = (leagueInfo) => {
  replaceSummonerNameFontSize(leagueInfo.summonerName);

  return {
    profileIconImgSrc: `https://ddragon.leagueoflegends.com/cdn/9.16.1/img/profileicon/${leagueInfo.profileIconId}.png`,
    summonerLevel: `${leagueInfo.summonerLevel}`,
    summonerName: `${leagueInfo.summonerName}`,
    summonerTag: `#${leagueInfo.summonerTag}`,
    leagueIconImgSrc: leagueInfo.tier
      ? `/img/Rank=${replaceTierName(leagueInfo.tier)}.png` // `https://github.com/okonomiyakki/lol-real-time-watcher/assets/83577128/${replaceTierImgSrc(leagueInfo.tier)}`
      : 'https://img.icons8.com/doodle/96/league-of-legends.png',
    tierRank: leagueInfo.tier
      ? `${replaceTierName(leagueInfo.tier)} ${replaceRankInitials(replaceRankForMasterLeagues(leagueInfo).rank)}`
      : '랭크 없음',
    lp: leagueInfo.leaguePoints ? `${leagueInfo.leaguePoints} LP` : '- LP',
    wins: leagueInfo.wins ? leagueInfo.wins : '-',
    losses: leagueInfo.losses ? leagueInfo.losses : '-',

    score: leagueInfo.wins
      ? `${leagueInfo.wins}승 ${leagueInfo.losses}패 &nbsp; 승률 ${parseInt((leagueInfo.wins / (leagueInfo.wins + leagueInfo.losses)) * 100)}%`
      : `전적 없음`,
  };
};

const convertSecondsToHMS = (seconds) => {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = seconds % 60;

  const h = hours < 10 ? `0${hours}` : hours;
  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return { h, m, s };
};

const playCarousel = (elementId) => {
  const slideNode = document.getElementById(elementId);
  const options = { loop: false };
  const plugins = [EmblaCarouselAutoplay()];
  const slide = EmblaCarousel(slideNode, options, plugins);
  const dotContainer = document.querySelector('.usage_carousel_dots');

  slide.on('select', () => {
    const selectedDot = dotContainer.querySelector(
      '.usage_carousel_dot--selected',
    );

    if (selectedDot)
      selectedDot.classList.remove('usage_carousel_dot--selected');

    dotContainer.children[slide.selectedScrollSnap()].classList.add(
      'usage_carousel_dot--selected',
    );
  });

  slide.on('scroll', () => resumeCarousle(slide));

  slideNode.querySelectorAll('.usage_carousel_slide').forEach((_, index) => {
    const button = document.createElement('button');
    button.classList.add('usage_carousel_dot');
    button.addEventListener('click', () => slide.scrollTo(index));
    dotContainer.appendChild(button);
  });

  dotContainer.children[0].classList.add('usage_carousel_dot--selected');
};
