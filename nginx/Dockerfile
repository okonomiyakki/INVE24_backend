FROM nginx:alpine

# SSL 인증서를 저장할 디렉토리를 생성
RUN mkdir -p /etc/letsencrypt

# COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# riot.txt 파일 추가

# 랭크 이미지 파일 추가

# 컨테이너가 내부적으로 사용하는 포트를 명시적으로 지정
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]