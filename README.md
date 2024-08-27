# 롤 인게임 시간 조회 서비스

---

## [INVE24 - v2.1.1](https://inve24.com/)

> 플레이 중인 리그오브레전드 계정으로 로그인해 주세요 <br>
> 챔피언 픽 완료 후, 밴픽창에서 조회 버튼을 눌러주세요. <br>
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

## 서비스 목적

- 흡연 유저들의 인베 참여율을 높입니다.

## 서비스 주요 기능

- 롤 계정으로 로그인
- 소환사 티어 정보 조회
- 실시간 밴픽 및 로딩 상황 조회
- 실시간 게임 진행 시간 조회

## 서비스 아키텍쳐 & CICD 파이프라인

![아키텍쳐](https://github.com/okonomiyakki/INVE24_backend/assets/83577128/e820dca6-0ebe-4959-994d-d57192be5248)

### CICD Workflow

1. main 브랜치로 코드를 PR 합니다.
2. 변경사항이 merge 되면, GitHub Actions가 해당 이벤트를 트리거 합니다.
3. CI 작업을 하기 위해 깃허브 빌드 머신으로 접속합니다.
4. 최신으로 반영된 코드를 해당 빌드 머신에 체크아웃(클론) 하고, Dockerfile을 기반으로 NestJS와 Nginx를 각각 빌드 합니다.
5. 빌드 된 이미지들을 DockerHub 레포지토리에 푸시(업로드) 합니다.
6. CD 작업을 하기 위해 EC2(호스트 머신)에 접속합니다.
7. DockerHub로부터 최신 버전의 이미지들을 풀(다운로드) 합니다.
8. 기존에 띄워진 Docker 컨테이너들을 종료 및 제거하고, 최신 이미지들을 실행합니다.

## 구현 기술

### 클라이언트

- SSR 프로젝트로, Handlebars 템플릿을 랜더링합니다.

### 서버

- Riot OAuth 2.0 소셜 로그인 기능을 사용하여 사용자 정보를 조회합니다.
- Riot Open API를 사용하여 사용자의 게임 데이터를 가공하고 반환합니다.

### 인프라

- AWS EC2에서 서버를 운영합니다.
- Nginx는 정적 파일 반환과 로드 밸런싱을 위한 리버스 프록시 웹 서버로 사용됩니다.
- GitHub Actions와 Docker를 사용하여 서비스 배포를 자동화합니다.

## 사용 시나리오 & 기능 설명

### 1. RSO(Riot Sign On) OAuth 2.0 소셜 로그인

- 리그오브레전드 계정으로 서비스에 로그인합니다.

### 2. 소환사 정보

- 로그인된 계정의 소환사 정보를 확인합니다.

### 3. 밴픽 진행 정보

- 사용자가 챔피언 픽을 완료 후, 조회 버튼을 누르면 밴픽 상태가 <u>로딩 바</u> 형식으로 반환됩니다.

### 4. 로딩 진행 정보

- 밴픽이 종료되면, 자동으로 게임의 로딩 상태가 <u>로딩 바</u> 형식으로 반환됩니다.

### 5. 실시간 협곡 시간 정보

- 게임이 시작되면, 실제 협곡 시간이 <u>타이머</u> 형식으로 반환됩니다.

        - 오차 범위는 실제 협곡 시간(s)을 기준으로 1초 이내입니다.

        - 오차 없는 동기화가 가능하지만, 빠른 참여를 위해 1초 정도의 여유를 두었습니다.

### 6. 로그아웃

- 로그아웃은 라이엇 공식 홈페이지 세션에 의해 동작합니다.

## 버그 신고하는 곳

- [디스코드 바로가기](https://discord.gg/3szXq8mpaq)
- [GitHub Issue 바로가기](https://github.com/okonomiyakki/lol-real-time-watcher/issues)

## Dev Implement

- RIOT DEVELOPMENT API KEY 또는 RIOT PERSONAL API KEY를 발급받으시면, 로컬에서 사용 가능합니다.
- RIOT BASE URL 값들은, KEY 발급 후 RIOT Developer 홈페이지 API Docs에서 확인 가능합니다.
- [RIOT Developer 홈페이지 바로가기](https://developer.riotgames.com/)

---

본 프로젝트는 PRODUCTION 승인이 완료된 서비스이며, 제공하는 코드를 활용한 무단 사용 및 도용, 복제 및 배포를 금합니다. © 2024 INVE24
