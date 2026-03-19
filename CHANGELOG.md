## [1.6.0](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.5.0...v1.6.0) (2026-03-13)

### Features

* Sentry 적용 ([9980f3a](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/9980f3a40f2798cd1d369946bf48d28d11cf835d))
* 공통 route handler 적용 ([3c8be3c](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/3c8be3c708efea52690d8b3ed3fb715189e5efed))
* 서버 prefetch 구현 ([f0c59f2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f0c59f22aa9daa10f319852a6420fafdde77f8c8))

### Bug Fixes

* 아바타아이콘 변경 ([53c6395](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/53c6395a77d18d80c3abd921e85b55d5c2d5a691))

## [1.5.0](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.4.1...v1.5.0) (2026-03-05)

### Features

* AI 직무 요약 애니메이션 추가 및 텍스트 수정 ([a2a9268](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/a2a926886087f471c8f3e495a32dc2186030b7ce))
* sliding 갱신 추가 ([c99ce7f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/c99ce7f3f23aac28ba12d57719b0062f51c105b7))
* 검색어 입력창 애니메이션 추가 및 입력 제한 UX 개선 ([9ea457a](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/9ea457aed870142b92fb5ffae10d12444b30a7b0))
* 채팅 검색어 입력창 애니메이션 및 UX 개선 ([7dce02d](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/7dce02db2c34f30e36736d44f5fdd7d3f3768288))
* 채팅 입력창 하단 고정 ([423f331](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/423f33105de91c47e331e3bd5c3b46cdf894ebd4))
* 채팅창 줄바꿈 입력 구현 ([665ed2c](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/665ed2ce52d2feb2c58e4071c19ee99c6c5f7a33))

### Bug Fixes

* lock 해제 타이밍 수정 ([304c2a1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/304c2a11ce83bbb639b6316317a4ab232d83265a))
* OCR 촬영 결과 페이지 UI 수정 ([7d861db](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/7d861db340c3266d8a16301aa10738cfc257c333))
* 실패 페이지에서의 버튼 색상 수정 ([2090a61](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/2090a61f95d9c535143ffd6c8885c92d04cc4266))
* 채팅 검색 안내 텍스트 수정 ([8758190](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/87581901de05dcb0849ca8d12e4b3cb3265d717d))

## [1.4.1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.4.0...v1.4.1) (2026-03-02)

### Bug Fixes

* amd 기반으로 변경 ([76fa6c1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/76fa6c19509c1d9acfc6695cdf4db88e1937f602))

## [1.4.0](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.3.0...v1.4.0) (2026-03-02)

### Features

* AI BFF 프록시 라우터 구현 ([549f99e](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/549f99e08505b411cf651fdc035c2e78520c41bb))
* BFF 적용으로 헬스체크 추가 ([b8ae623](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b8ae623c0da73e0769e990b828b4fdb4f71ec264))
* BFF 프록시 레이어를 위한 인증 흐름과 route 정책 구현 (Close [#101](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/101)) ([972b491](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/972b491a175f3c7badd16715f3f7eec0c87dbb79))
* BFF를 위한 Redis 구조 설정 (Close [#99](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/99)) ([e814d22](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/e814d227b36f9c73def02e98e2d2c0522f7fe445))
* container prod에 적용 ([bc87c0c](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/bc87c0c252fa322883f4be6f477805d8f508077e))
* containerfile 생성 ([ebf4160](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/ebf4160bada79b59dbcb4c78e826edcecd6b684d))
* container화 ci/cd 반영 ([6830807](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/683080752a7fb785ec76433a04b20a76be923214))
* endpoint 변경 및 프로바이더 수정 ([b8b388b](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b8b388b8795e2773f9ea04fdf71f557eae106657))
* OCR API 실제 연동 및 Mock 제거 ([ea8c504](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/ea8c504073c5e480d8c0f1121b271d7073ce0267))
* OCR mock model, API 초기 구조 추가 ([768c627](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/768c6279b6ae2e29db826bdd88be04a658cdd949))
* OCR start/poll 프록시 사용 ([cbbd1e3](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/cbbd1e35de32c28af8d1b22840d8014b9712e6ab))
* OCR 도메인 타입 정의 ([353b68f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/353b68fabf2c103e650e882750e35d61b003ac31))
* OCR 라우트 그룹 및 페이지 연결 ([eceb302](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/eceb30280782aaf1a288ac1c97f62fdb2db32492))
* OCR 작업 저장공간 추가 ([8445e71](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8445e71b86c979de46bc822f5f460a32d5e070e5))
* OCR 촬영, 결과확인, 실패 페이지 구현 ([80bbc79](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/80bbc79cf34d28703882a95e3547fad68163e53f))
* OCR 타입 설정 및 저장 로직 구현 ([1371d35](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/1371d35cb0a141ec369bd7fd217c21ac21d7b82d))
* STOMP 클라이언트와 구독 프로바이더 구현 ([3bc69b8](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/3bc69b81b1e5e4c03a80ae27daeae73fceb6ea0f))
* TSID사용으로 정밀도 손실 방지 방안 구현 ([874c2f9](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/874c2f90b485d5399d8a0ee3cf97a45e2d4f8ccb))
* 레이아웃 연결 ([10bb682](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/10bb682835b19158d1655d5905be75e308f36946))
* 레이아웃 프로바이더 적용 ([155b85b](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/155b85b1638976ee6c01b14c792864fa9f441bcc))
* 방 생성 이후 부분 패치를 위한 캐시 적용 ([07662b8](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/07662b85877c204a0c507f45a4b251e48155a29b))
* 비회원 전용 명함 상세 페이지 구현 ([5646d01](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/5646d014b67accfb20cf09b9d73b2beba8b26d81))
* 서버 측 세션 관리 및 CSRF 보호 기능 구현 (Close [#100](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/100)) ([fb350d4](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/fb350d480fadde0988ba0b8dced1d22267a7b152))
* 스로틀링 적용 ([b2e7d37](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b2e7d37432e6a107c896b450540ec18a7883636f))
* 실시간 읽음 이벤트 타입 정의 ([8e51f41](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8e51f416c72741a07dec79aede6fbd9fc5c995b3))
* 인피니티 구현 및 부분 패치 구현 ([f4fcdb1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f4fcdb19bdfc18d860aed9b545b5de1ac32676d8))
* 채팅 UI 컴포넌트(및 feature 단위 page 컴포넌트) 구현 ([48b01da](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/48b01dabb1820029c876f44e6e4d7c7023bc5c61))
* 채팅 WebSocket 이벤트 기반 React Query 캐시 동기화 로직 구현 ([c8736f8](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/c8736f80178217f2693c4f505d47178fd7c3a2e9))
* 채팅 WebSocket 이벤트 및 인증 타입 정의 ([14086f6](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/14086f68b3b96dcf156fd1b07f63bb950143d561))
* 채팅 도메인 모델 및 목 데이터 추가 ([4ea6f8f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/4ea6f8f74163ef12bee5f2fdc73c20dd3443816d))
* 채팅 메세지 응답 스키마 전환 ([1bde52b](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/1bde52b3cacdd7075430c461c39f37eea9e2aa19))
* 채팅방 목록을 실제 API 기반 무한 스크롤로 전환 ([19d7e45](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/19d7e4595edc5658e29ab8ff67ebb1ea21e11d4c))
* 채팅방 생성 API 연결 ([a5faac3](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/a5faac37144fcdaed5a1f0d90a48dcf6fb7132c3))
* 채팅방 페이지를 실제 메시지 API 기반으로 전환 ([0b36370](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/0b3637094f17f944be438d1d3d1eeacab64fda92))
* 채팅방 화면과 연동 ([9cbe0ff](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/9cbe0ffaa2b7fce471b5b96ce70298a79ef4b504))
* 채팅방/메시지 API 명세 추가 ([b7a5000](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b7a5000e6557c14cbd82bf1ab9c6cedbecdfa6d2))
* 채팅창 역방향 무한스크롤 구현 (Close [#118](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/118)) ([78e938b](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/78e938ba71d4f8bfcb51cefed71f1b6445d587d3))
* 컴포넌트 활용하여 페이지 채팅방 목록, 채팅방 페이지 구현 ([6175aea](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/6175aea7c9b0a52eec0b45e18c9cc8ad72cd10ee))
* 쿼리 캐시 확장 ([39bcc21](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/39bcc21228ae37d4ca9854d6a1b810e797d187a4))
* 홈 FAB와 연결 및 진입 모달 연결 ([ba9cab2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/ba9cab24fc94cdab7ab53d7ae491b0b47c85d03c))

### Bug Fixes

* BFF 도입으로 인한 api 경로 충돌 해결 (Close [#104](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/104)) ([312409f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/312409f333b8a09e1d499e268abec5af098f21d4))
* container 이미지 변경 ([7f12c9c](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/7f12c9c35adb99e2f22dba0b59324f812779b733))
* env 빌두/런타임 변경 ([818f688](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/818f68875014e7d9ba320ef78480e481c0ffe3fa))
* grant nextjs ownership for .next runtime cache ([50d8d0a](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/50d8d0a217ed3aed145a86b6eca60733801e6dad))
* image option error ([0b662ef](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/0b662ef761a8128e292d90709043838a79b541b7))
* my-card Suspense 추가 및 bff route params 타입 정정 ([ed2eb7e](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/ed2eb7edd1b4b08587e78078bc9fa6034e564e86))
* OLS 헤더 문제 해결 ([bc24688](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/bc24688c7562ab065ad4e7551740060e5069c6a6))
* release id 수정 ([1fa11c2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/1fa11c201d6a50cf84bbac45d360e51ed2aa9ee6))
* release id 추가 ([2a25c2c](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/2a25c2c8afaf10fe03d631f80a0985d09d016106))
* 빌드 환경 고정 ([1cf4369](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/1cf43694ebf01351aad5e18b0803fe2051ba87a3))
* 헤더 정리로 디코딩 문제 해결 (Close [#98](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/98)) ([28b8814](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/28b88144db4190f13da2f2ee5afd94e73f247aee))
* 환경 변수 주입 스크립트 수정 ([30daea1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/30daea170f6a1b4700962f2919c3bc53ae53e789))

## [1.3.0](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.2.1...v1.3.0) (2026-02-08)

### Features

* develop 프리릴리즈와 main 정식 릴리즈 파이프라인 분리 ([a55adb0](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/a55adb070ac329c4d189bee4185302d93ba136b7))

## [1.2.1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.2.0...v1.2.1) (2026-02-07)

### Bug Fixes

* 상대 명함 조회 api 연결 수정 (Close [#88](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/88)) ([8dc402d](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8dc402d745ecb02aa14eecdf125699ac4286beef))

## [1.2.1-dev.1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.2.0...v1.2.1-dev.1) (2026-02-05)

### Bug Fixes

* 상대 명함 조회 api 연결 수정 (Close [#88](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/88)) ([8dc402d](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8dc402d745ecb02aa14eecdf125699ac4286beef))

## [1.2.0-dev.6](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.2.0-dev.5...v1.2.0-dev.6) (2026-02-05)

### Bug Fixes

* 상대 명함 조회 api 연결 수정 (Close [#88](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/88)) ([8dc402d](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8dc402d745ecb02aa14eecdf125699ac4286beef))

## [1.2.0-dev.5](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.2.0-dev.4...v1.2.0-dev.5) (2026-02-05)

### Bug Fixes

* [#34](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/34) ([b7bb13f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b7bb13f9e3285ffae54f263a483fb77d2eaafb45))

## [1.2.0-dev.4](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.2.0-dev.3...v1.2.0-dev.4) (2026-02-05)

### Bug Fixes

* 경력 없을 때 생성 페이지로 연결 (Close [#83](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/83)) ([e67fe35](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/e67fe35cf0fa4d049f5b34f949c0a75ff0630676))

## [1.2.0-dev.3](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.2.0-dev.2...v1.2.0-dev.3) (2026-02-04)

### Bug Fixes

* 기본이미지에서 동작하던 삭제 버튼 수정 (Close [#66](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/66)) ([610337f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/610337ffca1fbfd15f35b7693a9d87c7a67721ab))

## [1.2.0-dev.2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.2.0-dev.1...v1.2.0-dev.2) (2026-02-03)

### Features

* 로그인 URL에 다음 작업 경로 반영 ([811fb07](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/811fb07b63b10b99ce4bc02976e73f49b7d5dac4))

### Bug Fixes

* SearchParams 사용으로 Suspense 적용 ([f318bd2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f318bd230ac902d1a4601b8b54f41689f384ba0f))

## [1.2.0-dev.1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.1.1-dev.1...v1.2.0-dev.1) (2026-02-03)

### Features

* 카카오 공유하기 및 링크 공유하기 기능 추가 ([8bfcd04](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8bfcd04b424445aba332964f0cfada20ece468fb))

## [1.1.1-dev.1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.1.0...v1.1.1-dev.1) (2026-02-03)

### Bug Fixes

* Github token 수정 ([b970d31](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b970d316fa27ce7052c92a357b263eb875255e3c))
* Github token 수정 ([9483db8](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/9483db873355023fe503148cfee5568e9b5c63ac))

## [1.1.0-dev.2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.1.0-dev.1...v1.1.0-dev.2) (2026-02-03)

### Bug Fixes

* Github token 수정 ([9483db8](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/9483db873355023fe503148cfee5568e9b5c63ac))
## [1.1.0](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0...v1.1.0) (2026-02-01)

### Features

* DateRangePicker 컴포넌트 추가 ([b27e0e6](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b27e0e6e7d77fd95c7be71c8f4493ebeae8722e4))
* 경력 목록 API 연동 및 삭제 기능 추가 ([d0aff58](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/d0aff5898d45a66e1c2ca1633733c2ba0967733c))
* 경력 생성/수정/삭제 기능 구현 ([cdf6e57](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/cdf6e5756b88d1118cdaf88cb63724a0c840c1bb))
* 경력 없을 때 빈 상태 UI 표시 ([8983dff](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8983dffa3c8fc8e4985a305406cef8ab2214f541))

### Bug Fixes

* FAB, Dialog 430px 레이아웃 내 배치 ([b5d9709](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b5d9709c79f8f3c1c25e93081276171c7ecf6104))

## [1.1.0-dev.1](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0...v1.1.0-dev.1) (2026-02-01)

### Features

* DateRangePicker 컴포넌트 추가 ([b27e0e6](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b27e0e6e7d77fd95c7be71c8f4493ebeae8722e4))
* 경력 목록 API 연동 및 삭제 기능 추가 ([d0aff58](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/d0aff5898d45a66e1c2ca1633733c2ba0967733c))
* 경력 생성/수정/삭제 기능 구현 ([cdf6e57](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/cdf6e5756b88d1118cdaf88cb63724a0c840c1bb))
* 경력 없을 때 빈 상태 UI 표시 ([8983dff](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8983dffa3c8fc8e4985a305406cef8ab2214f541))

### Bug Fixes

* FAB, Dialog 430px 레이아웃 내 배치 ([b5d9709](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b5d9709c79f8f3c1c25e93081276171c7ecf6104))

## [1.0.0-dev.29](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.28...v1.0.0-dev.29) (2026-02-01)

### Features

* DateRangePicker 컴포넌트 추가 ([b27e0e6](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b27e0e6e7d77fd95c7be71c8f4493ebeae8722e4))
* 경력 목록 API 연동 및 삭제 기능 추가 ([d0aff58](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/d0aff5898d45a66e1c2ca1633733c2ba0967733c))
* 경력 생성/수정/삭제 기능 구현 ([cdf6e57](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/cdf6e5756b88d1118cdaf88cb63724a0c840c1bb))
* 경력 없을 때 빈 상태 UI 표시 ([8983dff](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8983dffa3c8fc8e4985a305406cef8ab2214f541))

### Bug Fixes

* FAB, Dialog 430px 레이아웃 내 배치 ([b5d9709](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b5d9709c79f8f3c1c25e93081276171c7ecf6104))

## [1.0.0-dev.28](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.27...v1.0.0-dev.28) (2026-02-01)

### Bug Fixes

*  static/ standalone 파일 밑으로 경로 복사 ([835d20f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/835d20f1f8121c7f26057b11ab7655ec21c4b816))

## [1.0.0-dev.27](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.26...v1.0.0-dev.27) (2026-02-01)

### Bug Fixes

*  static/ standalone 파일 밑으로 경로 복사 ([7fff3d5](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/7fff3d52c28a65ade9f318fc45a762c3b01f21ed))

## [1.0.0-dev.26](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.25...v1.0.0-dev.26) (2026-02-01)

### Features

* CardView 공통 컴포넌트 생성 ([d9122cd](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/d9122cd4749cf7c69786c261e9961edb371c8ee3))
* 설정 페이지 추가 ([bda1a14](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/bda1a14df81898b4b2fc1064e7823d0415b75fec))
* 특정 유저 프로필 조회 API 및 훅 추가 ([8dd1fa7](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/8dd1fa7ab188db155b61965a3a6ce56874ba413c))
* 홈에서 명함 클릭 시 유저 상세 페이지로 이동 ([1110492](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/111049276e4da0254385204971ca7d6425799428))

## [1.0.0-dev.25](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.24...v1.0.0-dev.25) (2026-01-31)

### Features

* 이미지 삭제 기능과 이미지 저장 로직 별도 분리 ([403cfa5](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/403cfa577988fea3b95c025de86d8fdf3fc2df8a))
* 이미지 업로드 및 수정 기능 구현 ([1857547](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/1857547cc05a46f83b9c4d681d0bba86bd717284))

## [1.0.0-dev.24](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.23...v1.0.0-dev.24) (2026-01-31)

### Features

* 명함 목록 구현[#32](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/32) 및 무한 스크롤 적용 ([a13b215](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/a13b215df73b54996ecefa9d46dc390d2af17c77))
* 화면 적용 및 명함 추가시 invalidate 적용 ([6e39271](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/6e39271a611397008182c10e264b42c0447c2fc8))

## [1.0.0-dev.23](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.22...v1.0.0-dev.23) (2026-01-30)

### Features

* public cp 추가 경로 수정 ([e78676e](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/e78676eb79358c5beb3bd853c4ed5de09b0d9c0e))

## [1.0.0-dev.22](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.21...v1.0.0-dev.22) (2026-01-30)

### Features

* public/ cp 추가 ([08220b9](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/08220b9f756da489c009aa74f0bea9c896047047))

## [1.0.0-dev.21](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.20...v1.0.0-dev.21) (2026-01-30)

### Bug Fixes

* 시크릿 변경 ([f1e8bab](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f1e8bab56946b1e4270e1f367beba643ee8c720a))

## [1.0.0-dev.20](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.19...v1.0.0-dev.20) (2026-01-30)

### Bug Fixes

* 디렉토리 구조 변경 ([797bd60](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/797bd600d2112308984e2e874f77daafd8288033))

## [1.0.0-dev.19](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.18...v1.0.0-dev.19) (2026-01-30)

### Bug Fixes

* pnpm-lock 변경 ([f955146](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f95514646a3091d769a964aba04fbc562e486567))
* prettier ([39cf4e6](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/39cf4e6b724d6a7c19c807c99b4a3cb769a5e541))

## [1.0.0-dev.18](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.17...v1.0.0-dev.18) (2026-01-30)

### Bug Fixes

* test code 롤백 ([b40cf5a](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b40cf5a079a0d791abb2fc30c8b2d530d6e8feb4))

## [1.0.0-dev.17](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.16...v1.0.0-dev.17) (2026-01-30)

### Bug Fixes

* 동적 렌더링 고정방식으로 수정 ([21781f4](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/21781f45bc29a06e4d2db04d62fd8d8401e87208))

## [1.0.0-dev.16](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.15...v1.0.0-dev.16) (2026-01-29)

### Features

* FABMenu에 QR 스캔/공유 네비게이션 연결 ([094b369](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/094b3699f56f0f98ee6f30caae74ca77a32c18ee))
* QR 스캔/공유/결과 페이지 라우트 추가 ([004dcb2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/004dcb265f85e8311e69151524bbbbc2fee60a94))
* QR 코드 공유 기능 구현 ([2b99e63](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/2b99e633cbc406c87b827c3a65d0279d2d6bf43c))
* QR 코드 스캔 기능 구현 ([95c85ca](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/95c85ca8ff085529b2cb10167b71cd2bdb9feedb))
* 스캔 화면 디자인 추가 및 스캔 프레임 추가 ([eb6cd98](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/eb6cd980b51f3c6e89e67d78ae809b4049b9fc9d))

### Bug Fixes

* 카카오 로그인 시 redirectUri 전달 방식 수정 ([b8af6c2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b8af6c202cd37998c169132b8afbffb95b84a4aa))

## [1.0.0-dev.15](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.14...v1.0.0-dev.15) (2026-01-28)

### Features

* 내 명함 상세 정보 페이지 퍼블리싱 ([ebf7566](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/ebf7566c445697a1fef208c730c2785ff2ddb51d))
* 내 명함 페이지 연결 ([52a376d](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/52a376d71936baedc9246a5a88db438088bd90ba))
* 내 명함 페이지 퍼블리싱 ([c354820](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/c3548206560d8bfdabf4c50cf693b5708cf78f84))
* 리프레시 토큰 미구현으로 임시 로그인 방식 구현 ([f6eb8aa](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f6eb8aabf15af212d9d8be5984b4dfcd86e17e0f))
* 명함 정보 표시 개선 ([3cb849a](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/3cb849a7e7a1c037b605bb3146dc908f1a5fae20))
* 사용자 정보 조회 API 및 쿼리 훅 추가 ([cacea56](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/cacea56e20632e12cd4d01e77926c3421b3e9240))
* 프로필 수정 기능 화면 구현 API 연동 ([21a2198](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/21a21989fe43ca7dfbdfe92c7648cf3d8a27c550))
* 프로필 수정 시 변경사항 확인 및 알림 추가 ([85d6740](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/85d67406d123077e650ce688687e577208b65a20))
* 홈 페이지 화면 퍼블리싱 및 명함 상세 페이지 구조 문서 추가 ([e80679c](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/e80679c3301def474edb31560d02772d382d42bd))
* 홈 화면 퍼블리싱 Merge ([5f76a2d](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/5f76a2dfc42efc0924c933aadf2547ec24ef4afd))

### Bug Fixes

* FAB 버튼 위치 조정 ([9628d37](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/9628d3708e9a16197721d9c1ddb65ce34713f48d))
* 로그인 및 로그아웃 accessToken 처리방식 수정 ([618cb2d](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/618cb2d49f422927281b27db980ed53e681e61f5))
* 프로필 업데이트 요청 타입의 필드에 null 허용 ([fbca6c5](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/fbca6c520de4c95e4ca8bb36925808a1929a7694))

## [1.0.0-dev.14](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.13...v1.0.0-dev.14) (2026-01-25)

### Features

* prod cd 파이프라인 추가 ([f29af15](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f29af1585fdbc8c56a24bf8b0eaff1870f36b65e))

### Bug Fixes

* 버저닝 자동 쓰기 변경 추가 ([c0e5fa9](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/c0e5fa9a71ce0111dbde04876a897efd1933d8f4))

## [1.0.0-dev.13](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.12...v1.0.0-dev.13) (2026-01-25)

### Features

* httpOnly 쿠키 기반 인증 API Route 추가 ([e3e18d6](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/e3e18d655168e7b35267f0bc22c0abc2227ea595))
* TanStack Query 기반 인증 상태 관리 추가 ([3f244ba](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/3f244ba3a18b66fb57eeb29b9a0e388467824974))
* 인증 미들웨어 및 공통 API 클라이언트 추가 ([15e5dc2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/15e5dc21899b5a1d8fceda311189d8e0a3afdca8))
* 카카오 로그인 콜백 페이지 및 인증 모델 추가 ([f4e2650](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f4e2650992601e9647573b7e89828d5a7b056ac8))
* 카카오 로그인 페이지 추가 ([0717aab](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/0717aabf50a82ff1c649870e1b3f1aefb20061b0))
* 홈 페이지 추가 ([5fc5a01](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/5fc5a01caec0aa18f4f374d2093ab34f61d15fe9))

## [1.0.0-dev.12](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.11...v1.0.0-dev.12) (2026-01-25)

### Bug Fixes

* standalone 제거 ([85fa05f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/85fa05f11acf73269258b84ec2bd12f345b05001))

## [1.0.0-dev.11](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.10...v1.0.0-dev.11) (2026-01-25)

### Bug Fixes

* 로그 추가 ([1468a97](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/1468a97b1a1bdf14cbb6a5725183c160358ee92b))

## [1.0.0-dev.10](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.9...v1.0.0-dev.10) (2026-01-25)

### Bug Fixes

* trigger 만들기 ([846c91f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/846c91f1d064b905de905a4663215d839477353b))

## [1.0.0-dev.9](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.8...v1.0.0-dev.9) (2026-01-25)

### Bug Fixes

* cache 설정 끄기 ([c5de966](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/c5de966b8ffa0e064eeffaf903b6dc510574a206))

## [1.0.0-dev.8](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.7...v1.0.0-dev.8) (2026-01-25)

### Bug Fixes

* s3 새버전 overwrite으로 수정 ([32c3b56](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/32c3b5649ef1318efb7766cb17c292f3499a77d9))

## [1.0.0-dev.7](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.6...v1.0.0-dev.7) (2026-01-25)

### Bug Fixes

* 헬스체크 임시 변경 ([522cf23](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/522cf235d59af286f5df1b6f21fc2bcc4a83af57))

## [1.0.0-dev.6](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.5...v1.0.0-dev.6) (2026-01-25)

### Bug Fixes

* merge conflict ([1f584c0](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/1f584c03c01204dc3d4e1bd91f283ef014791ac0))
* 조건문 수정 ([05c6287](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/05c628712b83b2555ccee9f3b5b272f433c41ee1))

## [1.0.0-dev.5](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.4...v1.0.0-dev.5) (2026-01-25)

### Bug Fixes

* 경로 수정 ([f90f489](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f90f48939aa4a518f8e162b5d2bf91d1c117b5d7))

## [1.0.0-dev.4](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.3...v1.0.0-dev.4) (2026-01-25)

### Bug Fixes

* cd 파이프라인 경로 수정 ([921c104](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/921c104a66aa1e49e198c5dbb42366996c799b57))

## [1.0.0-dev.3](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.2...v1.0.0-dev.3) (2026-01-25)

### Bug Fixes

* appespec.yml 경로 수정 ([49827f3](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/49827f38ee74a2ceab0049a8d406b8467dd7ec50))

## [1.0.0-dev.2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/compare/v1.0.0-dev.1...v1.0.0-dev.2) (2026-01-25)

### Bug Fixes

* cd 파이프라인 내 경로 수정 ([749c772](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/749c772c9f34b5500b95ed92cf537f0bc6e3b7b7))

## 1.0.0-dev.1 (2026-01-25)

### Features

* configure Next.js output to standalone ([b739fd4](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/b739fd4d0746ec1ad821d9f0e9df11225e5ce690))
* configure Next.js output to standalone ([258c551](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/258c551fb9ded9f774c57fdbb46d2584661c44fe))
* initialize Next.js project ([264ad43](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/264ad4374838043b7d4895322dad8f2b5376e6d8))
* shadcn/ui 추가 ([3f10b1a](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/3f10b1aaa8e08648bb0cbe819921d568e63c9024))
* ShareCard 컴포넌트 추가 ([495db20](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/495db203e1f3a10f7382f24b28bf0fc66e5d3441))
* shared components 구현 ([f17dc19](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f17dc190775cf3c8d4ff6a1a3856c785fd06f5d6))
* update global styles and add utility functions ([6d7ea2d](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/6d7ea2db81ad7c560b005c34bcb8ab534c989360))
* 리뷰 관련 컴포넌트 추가 ([e469039](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/e469039bd0391c7281f648ed406c32b6e59e02f3))
* 명함 공유 컴포넌트 추가 ([c157e9b](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/c157e9b08e7c283bf953bace35595f95908603dd))
* 명함 관련 컴포넌트 추가 및 검색 입력 기능 구현 ([ea2b6ba](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/ea2b6ba19e787d29a99cc16d61722da4fb8ce116))
* 명함 정보에 필요한 폼 컴포넌트 추가 ([daa738a](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/daa738afc34e26c92d60cbe58c5db614abb3631c))
* 사용자 세부 정보 컴포넌트 추가 ([f5281a5](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f5281a5255ea62ee12f9d5407107ac643e5e29ac))
* 설정 컴포넌트 추가 ([a682b8b](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/a682b8b9523f6d9208e2646f5d6ce9cdc1bd481e))
* 인증 관련 컴포넌트 추가 ([99d7804](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/99d7804c9e4a26b789d61251b1701183f834f4b0))
* 차트 컴포넌트 추가 ([a3f6f19](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/a3f6f197a55ee1f003c8c5188e6e9deb2b998a3e))
* 카드 상세 정보 컴포넌트 추가 및 하단 내비게이션 구현 ([d403e52](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/d403e52cea432022e8b496fec3184731b7f9d0b4))
* 카메라 권한 오류 및 스캔 실패 상태 컴포넌트 추가 ([dfaba14](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/dfaba143cfcd0384b71b48d0748d4a9c7a0867f1))
* 카카오 로그인 및 약관 동의 다이얼로그 추가 ([08393db](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/08393db9534e125015995ee928e1e42479eb0a38))
* 컴포넌트 테스트 UI 페이지구현 ([347346e](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/347346e7955ef63f892cad94c1763e9c7066293b))

### Bug Fixes

* .prettierignore 파일 경로 수정 ([3fc87eb](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/3fc87eb679a60de70dc93efa50b5e89cc0315c6f))
* .prettierignore에 template 추가 ([5993088](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/5993088a9aa80177ad631f3a69f242046954b42b))
* [#2](https://github.com/100-hours-a-week/18-team-18TEAM-fe/issues/2) UI 컴포넌트 개선 및 드롭다운 이벤트 버블링 해결 ([f22149a](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/f22149ac184c7dbfc79d80924e98b0e21a9a2794))
* eslint 버전에 따른 flat config false 처리 ([3dbf843](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/3dbf843363f66d8323a93155981fafd42c319af9))
* eslint 실행 패턴 추가 ([543fc3a](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/543fc3a7483a76721cbb0a7942ef4fdafc07fdff))
* eslint 확장자 추가 ([dc9125d](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/dc9125d211b924003a85b0baa82f60a1e3a2800c))
* eslint.config 변경 ([9a3018f](https://github.com/100-hours-a-week/18-team-18TEAM-fe/commit/9a3018ff6f443957a95b72307ad37936bf6a275a))
