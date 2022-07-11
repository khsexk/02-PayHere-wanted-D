<h1 align=center><strong>2주차: PayHere 기업과제</strong></h1>

<p align=center>
<img src="https://img.shields.io/badge/Node.js-339933?style=badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/NestJS-E0234E?style=badge&logo=NestJS&logoColor=white">
</p>
<p align=center>
    <img src=https://img.shields.io/badge/Node.js-16.15.1-green.svg>
    <img src=https://img.shields.io/badge/NestJS-8.2.1-pink.svg>
    <img src=https://img.shields.io/badge/npm-8.5.5-white.svg>
</p>

### **RUN**
- 배포 링크: http://15.164.22.69:3000
```shell
$ git clone https://github.com/3rd-wanted-pre-onboarding-team-D/02-PayHere-wanted-D.git
$ cd 02-PayHere-wanted-D
$ npm i
$ npm run start
```

### **환경변수 설정**
```.env
# mysql
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# jwt
JWT_ACCESS_TOKEN_SECRET=
JWT_ACCESS_TOKEN_EXPIRATION_TIME=
JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_TOKEN_EXPIRATION_TIME=
```

### **API 명세 문서**
- Swagger 사용
- 로컬: http://localhost:3000/api/
- 배포: http://15.164.22.69:3000/api/

### **요구사항 분석**
1. 고객은 `이메일과 비밀번호 입력을 통해서 회원 가입`을 할 수 있습니다.
    - 유저는 이메일과 비밀번호 속성을 가진다.
    - 중복 회원 가입은 할 수 없다.
    - 비밀번호는 보안을 위해 해싱해서 저장한다.
    - 비밀번호는 문자, 숫자, 특수문자를 최소 한 개 포함하며 최소 8글자에서 최대 16글자이다.
    
2. 고객은 회원 가입이후, `로그인과 로그아웃`을 할 수 있습니다.
    - 이미 회원 가입된 유저만 로그인 할 수 있다.
    - 이메일과 비밀번호가 같은 유저만 로그인 할 수 있다.
    - 로그인에 성공하면 유저에게 토큰 모듈을 통해 토큰을 발급한다.
    - 로그인한 유저만 로그아웃 할 수 있다.
    - 로그아웃에 성공하면 유저의 리프레시 토큰을 삭제한다.
    
3. 가계부에 `오늘 사용한 돈의 금액과 관련된 메모`를 남길 수 있습니다.
    - 로그인 후 지출, 수입, 날짜, 내용을 입력하여 메모를 작성할 수 있습니다.
4. 가계부에서 수정을 원하는 내역은 `금액과 메모를 수정` 할 수 있습니다.
    - `PUT /financial-ledgers/:id` 를 통해 수입, 지출, 메모 정보를 수정할 수 있다.
    
5. 가계부에서 삭제를 원하는 내역은 `삭제` 할 수 있습니다.
6. `삭제한 내역은 언제든지 다시 복구` 할 수 있어야 한다.
    - 삭제한 내역은 복구할 수 있어야 하므로 실제 데이터를 삭제하지 않고 soft delete가 필요하다.
    - `deletedAt` 컬럼을 사용해 삭제여부 확인 및 삭제 날짜를 알 수 있다.
    - `PUT /financial-ledgers/:id/cancellation` 가계부 삭제
    - `PUT /financial-ledgers/:id/restoration` 삭제된 가계부 복구
    
7. 가계부에서 이제까지 기록한 `가계부 리스트`를 볼 수 있습니다.
    - `GET /financial-ledgers` 본인이 작성한 가계부 내역을 일자별로 확인할 수 있다.
    - 삭제한 메모는 볼 수 없다.
    - 날짜 (date) - 하루단위
        - 사용금액 (money)
        - 리스트 (memolist)
            - 글번호 (id)
            - 지출 (expenditure)
            - 수입 (income)
            - 내용 (remarks)
    
8. 가계부에서 `상세한 세부 내역`을 볼 수 있습니다.
    - `GET /financial-ledgers/:id` 입력한 아이디를 가진 가계부 내역을 확인할 수 있다.
    - 삭제한 메모는 볼 수 없다.

9. 로그인하지 않은 고객은 가계부 내역에 대한 `접근 제한 처리`가 되어야 합니다.
    - `401 Unauthorized` 로 로그인을 하지 않은 경우 접근이 제한된다.
    
10. 설치되어 있는 os, node 버전에 상관없이 `Docker를 기반으로 서버를 실행`
    - docker-compose를 통해 mysql을 설치하여 CI를 구성한다.
    - docker image와 container를 통해 CD를 구성한다.

### **ERD**
<img src='https://user-images.githubusercontent.com/56003992/178000483-efd7e0a5-d1a3-495a-afac-129ee9d2088b.png' width=512>

### **DFD**
<img src='https://user-images.githubusercontent.com/56003992/178000152-fe542cdc-4ac1-4c70-b33b-66d0cba5eae5.png' width=1024>

### **Auth Flow**
<img width="512" alt="스크린샷 2022-07-08 오후 9 50 15" src="https://user-images.githubusercontent.com/56003992/178000996-339b1768-8092-443c-9b38-9c8c50e854b0.png">

### **CICD**
<img width="1024" alt="cicd" src="https://user-images.githubusercontent.com/56003992/178000813-e1a86a43-02da-449b-86a6-04c9f4ce9d00.png">

### **팀원별 역할**
- 프로젝트 세팅 및 배포 자동화
    - 담당: [@khsexk](https://github.com/khsexk)
    - NestJS 프로젝트 세팅, DevOps
- JWT 토큰 인증 및 사용자 인증 처리
    - 담당: [@YongsHub](https://github.com/YongsHub)
    - 토큰 모듈 제작 및 테스트
    - User Login시, Access Token 및 Refresh Token 발급
    - Refresh Token 암호화 하여 Database에 저장
    - Access Token 만료시 Database에 있는 Refresh Token 비교 후, 재발급
    - User Logout시, Refresh Token Delete
- 고객 회원가입, 로그인, 로그아웃 기능 구현
    - 담당: [@JuyeopJang](https://github.com/JuyeopJang)
    - 유저 모듈 제작 및 테스트
- 가계부 생성 및 조회 기능 구현
    - 담당: [@reumachoi](https://github.com/reumachoi)
    - 가계부 모듈 (작성, 세부내역조회, 리스트조회) 제작 및 테스트
- 가계부 수정 및 삭제 기능 구현
    - 담당: [@username1103](https://github.com/username1103)
    - 가계부 모듈 (수정, 삭제, 복구) 제작 및 테스트
