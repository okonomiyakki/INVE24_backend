FROM nginx:latest

# COPY <nginx 하위의 nginx.conf 복사> <도커 이미지 /etc/nginx/conf.d/default.conf 에다가 붙여넣기>
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/nginx.conf

# riot.txt 파일 추가

# 랭크 이미지 파일 추가

# 컨테이너가 내부적으로 사용하는 포트를 명시적으로 지정
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]