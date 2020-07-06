# ScalaTemplate

- docker-compose.yaml
- ScalaTemplate
    - build.sbt
    - apiServer
                

## docker-compose sample
```bash
$ sh build.sh

# if success, it will return Dockerfile path
apiServer/target/docker/stage
```
```yaml
version: "3.4"
services:
  api-server:
    restart: always
    build: apiServer/target/docker/stage
    ports:
      - 18080:18080
```          
