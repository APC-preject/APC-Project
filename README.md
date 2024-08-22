# APC Project
APC management SERVICE

## Technologies Used
+ Nginx
+ Ngrok
+ React
+ Tailwind
+ Node.js
+ express
+ Firebase

## Install
1. 필요 프로그램 설치 (Technologies Used 참고)
2. Ngrok 세팅 및 Ngrok URL 획득 (Ngrok 홈페이지 참조)
    * 단 별도 도메인 존재 및 호스팅이 가능할 경우 생략 가능
    * 이 경우 .env 파일의 NGROK_URL 파트에 해당 도메인 기재
3. Firebase 세팅 및 firebase admin configure json file 등을 획득 (firebase console 사용, Firebase 관련 도움말[https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments] 참조)
4. .env.example 파일을 참고하여, .env파일 작성. 이 때, 위치는 루트 디렉토리로 함
5. 
    ```shell
    sudo make install
    ```

    * 만약 npm 또는 Node 관련 에러 발생 시 Makefile에서 \$(NPM) 및 \$(NODE) 환경변수를 사용하여 npm과 node의 경로 직접 지정 가능 (default: npm, node)
    * nginx의 설정 파일 경로 Makefile 내에서 직접 지정 가능 (default: /etc/nginx/nginx.conf)

## Usage
*   ```shell
    sudo make
    ```
    : 모든 서비스 시작/재시작

*   ```shell
    sudo make clean
    ```
    : 모든 서비스 종료 및 프로세스 정리
