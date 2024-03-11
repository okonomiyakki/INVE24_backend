# 리그오브레전드 실시간 협곡 시계

---

## v.1.3.1

> 챔피언 픽은 게임중으로 간주하지 않습니다. <br>
> 로딩 중일 때 조회하셔야 정상적인 인게임 시간이 반환됩니다. <br>
> 이미 시작된 게임은 조회가 불가능합니다.

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

- 소환사 티어 정보 조회
- 소환사 게임 중 여부 확인
- 실시간 협곡 시간 조회

## 구현 기술

- SSR 프로젝트이며, Handlebars 템플릿을 랜더링합니다.
- Nginx는 포트 리다이렉션을 위한 웹 서버로 사용됩니다. (로드 밸런싱 적용 예정)
- GitHub Actions를 사용하여 CI/CD 파이프라인을 구축하였습니다.
- 도커라이징을 통해 배포합니다.

## 로컬 환경 변수 설정

- RIOT DEVELOPMENT API KEY 또는 RIOT PERSONAL API KEY를 발급받으시면, 로컬에서 사용 가능합니다.
- RIOT BASE URL 값들은, KEY 발급 후 RIOT Developer 홈페이지 API Docs에서 확인 가능합니다.
- [RIOT Developer 홈페이지 바로가기](https://developer.riotgames.com/)

```bash
touch .env.dev
```

```
/.env.dev

HOST_BASE_URL={http://localhost:서버포트}

RIOT_BASE_URL_ASIA={라이엇 아시아 BASE URL}

RIOT_BASE_URL_KR={라이엇 한국 BASE URL}

RIOT_API_APP_KEY={라이엇 API 키}

```

## 로컬 실행 방법

```bash
npm i

npm run start:dev
```

---

## 사용 시나리오 & 기능 설명

### 1. 소환사 검색

- 소환사 닉네임과 태그를 입력하여 소환사를 검색합니다.

### 2. 소환사 정보

- 소환사의 티어 정보를 확인합니다.

### 3. 로딩 진행 여부 조회

- 챔피언 픽이 끝난 후, 조회 버튼을 누르면 로딩 중 상태가 동기화됩니다.

### 4. 실시간 협곡 시간 조회

- 게임이 시작되면, 실제 협곡 시간이 타이머 형식으로 반환됩니다.

        - 오차 범위는 실제 협곡 시간(s) - 1s 정도입니다.

        - 오차 없는 동기화가 가능하지만, 빠른 참여를 위해 1초 정도의 여유를 두었습니다.

### 5. 조회 버튼 연타 방지 (추가)

- 무분별한 API 호출을 막기 위한 연타 방지 스크립트가 존재합니다.

        - n 초 동안 n 번 이상 클릭 시, 조회 버튼이 m 초 동안 비활성화됩니다.

        - 브라우저를 새로고침하거나 종료하더라도 버튼 비활성화는 풀리지 않습니다.

## 기능 개선 & 버그 문의

- [디스코드 바로가기](https://discord.gg/3szXq8mpaq)
- [GitHub Issue 바로가기](https://github.com/okonomiyakki/lol-real-time-watcher/issues)

---

본 프로젝트는 RIOT으로부터 PRODUCTION 승인이 완료된 서비스이며, 제공하는 코드를 활용한 무단 사용 및 도용, 복제 및 배포를 금합니다. © 2024 INVE24, Okonomiyakki
