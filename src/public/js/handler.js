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

  // console.log('leagueInfo : ', leagueInfo);

  const newLeagueInfo = indicateLeagueInfo(leagueInfo);

  injectLeagueInfo(newLeagueInfo);
};

const handleNavBar = () => {
  alert('Access Denied');
};

const handleInve24UpdateInfo = () => {
  alert('Access Denied');
};

const handleModal = () => {
  // document.getElementById('modal-wrap').style.display = 'flex';
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

// const showLoadingSpinner = () => {
//   document.getElementById('bg').style.display = 'flex';
//   document.getElementById('loading').style.display = 'flex';
// };

// const hideLoadingSpinner = () => {
//   document.getElementById('bg').style.display = 'none';
//   document.getElementById('loading').style.display = 'none';
// };

// const handleYesBtnClick = () => {
//   replaceLocation(`${hostBaseUrl}/summoners/spectate/live`);
// };

// const handleNoBtnClick = () => {
//   document.getElementById('modal-wrap').style.display = 'none';
// };
