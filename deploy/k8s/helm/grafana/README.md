```bash
$ kubectl get secret --namespace default grafana-service -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```
