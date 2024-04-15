const handleSummonerLeagueInfo = () => {
  const storedTokenInfo = getLocalStorage('tokenInfo');
  const storedLeagueInfo = getLocalStorage('leagueInfo');

  if (!storedTokenInfo) {
    alert('잘못된 접근입니다.');

    removeLocalStorage('tokenInfo');
    removeLocalStorage('leagueInfo');

    replaceLocation(`${hostBaseUrl}`);
  }

  hideComponent('rso_login_container');

  displayComponent('summoner_container');

  const leagueInfo = JSON.parse(storedLeagueInfo);

  const newLeagueInfo = indicateLeagueInfo(leagueInfo);

  injectLeagueInfo(newLeagueInfo);
};

const handleSummonerSpectateInfo = () => {
  const storedTokenInfo = localStorage.getItem('tokenInfo');
  const storedLeagueInfo = localStorage.getItem('leagueInfo');

  if (!storedTokenInfo) {
    alert('잘못된 접근입니다.');

    removeLocalStorage('tokenInfo');
    removeLocalStorage('leagueInfo');

    replaceLocation(`${hostBaseUrl}/summoners`);
  }

  hideComponent('rso_login_container');

  displayComponent('summoner_container');

  const leagueInfo = JSON.parse(storedLeagueInfo);

  const newLeagueInfo = indicateLeagueInfo(leagueInfo);

  injectLeagueInfo(newLeagueInfo);

  hideComponent('summoner_league');
  hideComponent('summoner_fetch');

  displayComponent('crrent_game');
  displayComponent('spectate_cancel');

  let retryCnt = 0;
  const MAX_RETRIES = 59;

  fetchCurrentGameStatusAPI(leagueInfo, retryCnt, MAX_RETRIES);
};

const handleLoadingstart = (elementId, color) => {
  setComponentBackgroundColor(elementId, color);

  let width = 0;

  if (intervalLoading) clearInterval(intervalLoading);

  intervalLoading = setInterval(() => {
    width += 0.315;

    increaseLoadingBar(width, elementId);
  }, 1000);
};

const handleFetchResume = (retryCnt, leagueInfo, MAX_RETRIES) => {
  let currnetRetryCnt = retryCnt;

  if (intervalFetch) clearInterval(intervalFetch);

  intervalFetch = setTimeout(() => {
    currnetRetryCnt++;

    fetchCurrentGameStatusAPI(leagueInfo, currnetRetryCnt, MAX_RETRIES);
  }, 5000);
};

const handleLoadingStop = (elementId) => {
  clearInterval(intervalLoading);
  setComponentwidth(elementId, '94.5%');
  injectHTML('current_game_status_bar', '100%');
};

const handleRedirectPrev = () => {
  replaceLocation(`${hostBaseUrl}/summoners`);
};

const handleNavBar = () => {
  alert('Access Denied');
};

const handleInve24UpdateInfo = () => {
  alert('Access Denied');
};

const handleLeagueOfLegendsPatchNotes = () => {
  const lol =
    'https://www.leagueoflegends.com/ko-kr/news/game-updates/patch-14-7-notes/';

  replaceLocation(lol);
};

const handleBugReportToDiscord = () => {
  const discord = document.getElementById('discord').dataset.discordBaseUrl;

  replaceLocation(discord);
};

const handleBugReportToGitHub = () => {
  const github = 'https://github.com/okonomiyakki/lol-real-time-watcher/issues';

  replaceLocation(github);
};

const handleDisplayModal = () => {
  displayComponent('modal');
  displayComponent('modal_background');
};

const handleHideModal = () => {
  hideComponent('modal');
  hideComponent('modal_background');
};

const handleRedirectForSpectate = () => {
  replaceLocation(`${hostBaseUrl}/spectate`);
};

const handleDisplayLoadingSpinner = () => {
  displayComponent('spinner');
};

const handleHideLoadingSpinner = () => {
  hideComponent('spinner');
};

const handleCarousel = (element) => {
  const slideNode = document.getElementById(element);
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

// const handleRiotLogout = () => {
//   localStorage.removeItem('tokenInfo');
//   localStorage.removeItem('leagueInfo');

//   replaceLocation(`${hostBaseUrl}`);
// };

const convertSecondsToHMS = (seconds) => {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = seconds % 60;

  const h = hours < 10 ? `0${hours}` : hours;
  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return { h, m, s };
};

const updateTimer = (element, h, m, s) => {
  document.getElementById(element).innerText = `${h}:${m}:${s}`;
};

const generateTimer = (num, element, offset) => {
  let currentCounter = num;

  if (intervalTimer) clearInterval(intervalTimer);

  intervalTimer = setInterval(() => {
    currentCounter++;

    const { h, m, s } = convertSecondsToHMS(currentCounter);

    if (currentCounter === 120 && offset === true) {
      clearInterval(intervalTimer);

      handleRedirectPrev();
    } else updateTimer(element, h, m, s);
  }, 1000);
};
