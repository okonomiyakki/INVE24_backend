document.addEventListener('DOMContentLoaded', function () {
  handleCarousel('usage_carousel');
});

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

  slideNode.querySelectorAll('.usage_carousel_slide').forEach((_, index) => {
    const button = document.createElement('button');

    button.classList.add('usage_carousel_dot');

    button.addEventListener('click', () => slide.scrollTo(index));

    dotContainer.appendChild(button);
  });

  dotContainer.children[0].classList.add('usage_carousel_dot--selected');
};

const handleRiotOAuth2Redirect = () => {
  const hostBaseUrl = document.getElementById('host').dataset.hostBaseUrl;
  const riotAuthUrl = document.getElementById('auth').dataset.riotBaseUrlAuth;

  riotOAuthDataFetcher(hostBaseUrl, riotAuthUrl);
};

const riotOAuthDataFetcher = (hostBaseUrl, riotAuthUrl) => {
  axios.get(`${hostBaseUrl}/api/v1.0/oauth`).then((res) => {
    const { clientId, redirectUri } = res.data.data;

    const riotSignOnFormURL = `${riotAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+offline_access`;

    replaceLocation(riotSignOnFormURL);
  });
};

const handleBugReportToDiscord = () => {
  const discord = document.getElementById('discord').dataset.discordBaseUrl;

  replaceLocation(discord);
};

const handleBugReportToGitHub = () => {
  const github = 'https://github.com/okonomiyakki/lol-real-time-watcher/issues';

  replaceLocation(github);
};

const handleLeagueOfLegendsPatchNotes = () => {
  const lol =
    'https://www.leagueoflegends.com/ko-kr/news/game-updates/patch-14-7-notes/';

  replaceLocation(lol);
};

const handleInve24UpdateInfo = () => {
  alert('no contents');
};

const handleNavBar = () => {
  alert('no contents');
};

const replaceLocation = (URL) => {
  window.location.href = URL;
};
