FROM golang:1.13 as builder

ARG PORT=${PORT:-18080}
ARG GO_FILE_PATH=${GO_FILE_PATH:-.}

ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

WORKDIR /go/src/github.com/BambooTuna/k8s-infra/apiServer
COPY ${GO_FILE_PATH} .
RUN go get ./... && \
    go build -o app && \
    mv ./app /app

FROM scratch
# 軽量のalpineには必要ファイルがないため注意
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /app /app
EXPOSE ${PORT}
ENTRYPOINT ["/app"]
