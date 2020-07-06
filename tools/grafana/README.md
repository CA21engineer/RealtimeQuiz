# grafana

## datasources.yaml sample

```yaml
apiVersion: 1

datasources:
  - name: prometheus
    type: prometheus
    access: proxy
    url: prometheus:9090

  - name: mysql
    type: mysql
    access: proxy
    url: mysql:3306
    database: sample-database
    user: user
    password: password
```
