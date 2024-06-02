const handleDisplayLoadingSpinner = () => {
  displayComponent('spinner');
};

const handleHideLoadingSpinner = () => {
  hideComponent('spinner');
};

const handleDisplayModal = () => {
  displayComponent('modal');
  displayComponent('modal_background');
};

const handleHideModal = () => {
  hideComponent('modal');
  hideComponent('modal_background');
};

const handleComponentLoginAfter = () => {
  hideComponent('rso_login_container');

  displayComponent('summoner_container');
};

const handleComponentCurrentGameFetchAfter = () => {
  hideComponent('summoner_league');

  hideComponent('summoner_fetch');

  displayComponent('crrent_game');

  displayComponent('spectate_cancel');
};

const handleComponentGameStartAfter = () => {
  hideComponent('current_game_status');

  displayComponent('current_game_timer');
};
