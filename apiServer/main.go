package main

import (
	"fmt"
	"github.com/BambooTuna/go-server-lib/config"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/BambooTuna/go-server-lib/metrics"

	// mysql driver
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

const namespace = "k8s_infra"

func main() {
	wg := new(sync.WaitGroup)
	wg.Add(4)

	m := metrics.CreateMetrics(namespace)
	go func() {
		health := m.Gauge("health", map[string]string{})
		health.Set(200)
		ticker := time.NewTicker(time.Minute * 1)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				health.Set(200)
			}
		}
	}()

	connect := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		config.GetEnvString("MYSQL_USER", "user"),
		config.GetEnvString("MYSQL_PASS", "pass"),
		config.GetEnvString("MYSQL_HOST", "127.0.0.1"),
		config.GetEnvString("MYSQL_PORT", "3306"),
		config.GetEnvString("MYSQL_DATABASE", "table"),
	)
	db, _ := gorm.Open("mysql", connect)
	db.Close()

	go func() {
		serverPort := config.GetEnvString("PORT", "18080")
		r := gin.Default()
		r.GET("/", func(ctx *gin.Context) { ctx.Status(200) })
		r.GET("/health", func(ctx *gin.Context) { ctx.Status(200) })
		_ = r.Run(fmt.Sprintf(":%s", serverPort))
		wg.Done()
	}()

	go func() {
		serverPort := "9090"
		r := gin.Default()
		r.Use(
			reverseProxy(
				"/",
				&url.URL{Scheme: "http", Host: config.GetEnvString("PROMETHEUS_NAMESPACE", "prometheus-server")+":80"},
			),
		)
		_ = r.Run(fmt.Sprintf(":%s", serverPort))
		wg.Done()
	}()

	go func() {
		serverPort := "3000"
		r := gin.Default()
		r.Use(
			reverseProxy(
				"/",
				&url.URL{Scheme: "http", Host: config.GetEnvString("GRAFANA_NAMESPACE", "grafana")+":80"},
			),
		)
		_ = r.Run(fmt.Sprintf(":%s", serverPort))
		wg.Done()
	}()

	// monitoring metrics, process
	go func() {
		processCollector := prometheus.NewProcessCollector(prometheus.ProcessCollectorOpts{Namespace: namespace})
		prometheus.MustRegister(m, processCollector)
		http.Handle("/metrics", promhttp.Handler())
		_ = http.ListenAndServe(":2112", nil)
		wg.Done()
	}()
	wg.Wait()
}

func reverseProxy(urlPrefix string, target *url.URL) gin.HandlerFunc {
	proxy := httputil.NewSingleHostReverseProxy(target)
	proxy.FlushInterval = -1

	return func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, urlPrefix) {
			c.Request.URL.Path = strings.Replace(c.Request.URL.Path, urlPrefix, "", 1)
			proxy.ServeHTTP(c.Writer, c.Request)
		}
	}
}
