FROM golang:1.13

ARG APP_HOME=${APP_HOME:-/app}
RUN mkdir -p $APP_HOME

ARG GRPC_HOME=${GRPC_HOME:-/grpc}
RUN mkdir -p $GRPC_HOME
WORKDIR $GRPC_HOME

USER root

RUN apt-get update && apt-get install -y unzip
RUN curl -L -O https://github.com/protocolbuffers/protobuf/releases/download/v3.11.2/protoc-3.11.2-linux-x86_64.zip
RUN curl -L -O https://github.com/grpc/grpc-web/releases/download/1.0.7/protoc-gen-grpc-web-1.0.7-linux-x86_64
RUN unzip protoc-3.11.2-linux-x86_64.zip && cp ./bin/protoc /usr/local/bin/. && chmod +x /usr/local/bin/protoc && mv ./include/google /usr/local/include/google
RUN cp protoc-gen-grpc-web-1.0.7-linux-x86_64 /usr/local/bin/protoc-gen-grpc-web && chmod +x /usr/local/bin/protoc-gen-grpc-web
RUN go get -u github.com/golang/protobuf/protoc-gen-go && \
    go get -u github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc && \
    go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway && \
    go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger

RUN curl -L https://www.nuget.org/api/v2/package/Grpc.Tools/2.26.0 -o temp.zip \
  && unzip -p temp.zip tools/linux_x64/grpc_csharp_plugin > /usr/local/bin/grpc_csharp_plugin \
  && chmod +x /usr/local/bin/grpc_csharp_plugin \
  && rm temp.zip

WORKDIR $APP_HOME
