# 리그오브레전드 실시간 협곡 시계

---

## v2.1.0

> 플레이 중인 리그오브레전드 계정으로 로그인해 주세요 <br>
> 챔피언 픽 완료 후, 밴픽창에서 조회 버튼을 눌러주세요. <br>
> 챔피언 픽 이전에 조회 시, 이용이 불가능합니다. <br>
> 게임 시작 이후에 조회 시, 이용이 불가능합니다.

## 사용 기술

### Frontend

![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=for-the-badge)![Handlebars.js Badge](https://img.shields.io/badge/Handlebars.js-000?logo=handlebarsdotjs&logoColor=fff&style=for-the-badge)![CSS3 Badge](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff&style=for-the-badge)

### Backend

![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)![NestJS Badge](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=fff&style=for-the-badge)![PM2 Badge](https://img.shields.io/badge/PM2-2B037A?logo=pm2&logoColor=fff&style=for-the-badge)

### DevOps

![Docker Badge](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=for-the-badge)![NGINX Badge](https://img.shields.io/badge/NGINX-009639?logo=nginx&logoColor=fff&style=for-the-badge)![GitHub Actions Badge](https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=githubactions&logoColor=fff&style=for-the-badge)![Amazon EC2 Badge](https://img.shields.io/badge/Amazon%20EC2-F90?logo=amazonec2&logoColor=fff&style=for-the-badge)

### Open API

## ![Riot Games Badge](https://img.shields.io/badge/Riot%20Games-EB0029?logo=riotgames&logoColor=fff&style=for-the-badge)

## 서비스 아키텍쳐 & CICD 파이프라인

![아키텍쳐](https://github.com/okonomiyakki/lol-real-time-watcher/assets/83577128/3116d8f2-3445-411f-b87d-726644a85450)

## 서비스 URL

- [홈페이지 바로가기](https://inve24.com/)

## 서비스 목적

- 흡연 유저들의 인베 참여율을 높입니다.

## 서비스 주요 기능

- RIOT 소셜 로그인
- 소환사 티어 정보 조회
- 실시간 밴픽 및 로딩 상황 조회
- 실시간 협곡 시간 조회

## 구현 기술

- SSR 프로젝트이며, Handlebars 템플릿을 랜더링합니다.
- OAuth 2.0 소셜 로그인을 통해 서비스를 이용합니다.
- Nginx는 포트 리다이렉션을 위한 웹 서버로 사용됩니다. (로드 밸런싱 적용 예정)
- GitHub Actions를 사용하여 CI/CD 파이프라인을 구축하였습니다.
- 도커라이징을 통해 배포합니다.

## 사용 시나리오 & 기능 설명

### 1. 리그오브레전드 OAuth2.0 소셜 로그인 (RSO)

- 리그오브레전드 계정으로 서비스에 로그인합니다.

### 2. 소환사 정보

- 로그인된 계정의 소환사 정보를 확인합니다.

### 3. 밴픽 진행 정보

- 사용자가 챔피언 픽을 완료 후, 조회 버튼을 누르면 밴픽 상태가 타이머 형식으로 반환됩니다.

### 4. 로딩 진행 정보

- 밴픽이 끝나면, 자동으로 게임의 로딩 상태가 타이머 형식으로 반환됩니다.

### 5. 실시간 협곡 시간 정보

- 게임이 시작되면, 실제 협곡 시간이 타이머 형식으로 반환됩니다.

        - 오차 범위는 실제 협곡 시간(s)을 기준으로 1초 이내입니다.

        - 오차 없는 동기화가 가능하지만, 빠른 참여를 위해 1초 정도의 여유를 두었습니다.

## 기능 개선 & 버그 문의

- [디스코드 바로가기](https://discord.gg/3szXq8mpaq)
- [GitHub Issue 바로가기](https://github.com/okonomiyakki/lol-real-time-watcher/issues)

## Dev Implement

- RIOT DEVELOPMENT API KEY 또는 RIOT PERSONAL API KEY를 발급받으시면, 로컬에서 사용 가능합니다.
- RIOT BASE URL 값들은, KEY 발급 후 RIOT Developer 홈페이지 API Docs에서 확인 가능합니다.
- [RIOT Developer 홈페이지 바로가기](https://developer.riotgames.com/)

---

본 프로젝트는 PRODUCTION 승인이 완료된 서비스이며, 제공하는 코드를 활용한 무단 사용 및 도용, 복제 및 배포를 금합니다. © 2024 INVE24, Okonomiyakki
