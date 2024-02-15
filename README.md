# 롤 실시간 협곡 시계

---

## v.1.2.1

> 챔피언 픽은 게임중으로 간주하지 않습니다. <br>
> 로딩 중일 때 조회하셔야 정상적인 인게임 시간이 반환됩니다. <br>
> 이미 시작된 게임은 조회가 불가능합니다.

## 사용 기술

### Frontend

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/><img src="https://img.shields.io/badge/Handlebars.js-000?&style=for-the-badge&logo=handlebarsdotjs&logoColor=fff"/><img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>

### Backend

<img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"/><img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">

---

## 서비스 목적

- 흡연 유저들의 인베 참여율을 높입니다.

## 서비스 주요 기능

- 소환사 티어 정보 조회
- 소환사 게임 중 여부 확인
- 실시간 협곡 시간 조회

## 배포 주소

-

## 참고

- SSR 프로젝트 이며, Handlebars 템플릿을 랜더링합니다.
- 본 서비스는 배포되었지만, RIOT으로부터 PRODUCTION 승인을 기다리고 있습니다.
- RIOT DEVELOPMENT API KEY 또는 RIOT PERSONAL API KEY를 발급받으시면, 로컬에서 사용 가능합니다.
- 환경 변수에서 BASE URL 값들은, KEY 발급 후 RIOT Developer 홈페이지 API Docs에서 확인 가능합니다.
- [RIOT Developer 홈페이지 바로가기](https://developer.riotgames.com/)

## 로컬 환경 변수 설정

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

## 사용 시나리오

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
