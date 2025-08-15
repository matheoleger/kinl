We use [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/) to monitor our application.

## Prometheus

Prometheus is a monitoring system and time series database. It is used to collect metrics from various sources such as applications, servers, and services. Prometheus scrapes these metrics and stores them in a time series database for analysis and visualization.

## Grafana

Grafana is a data visualization platform that allows you to create and share dashboards with your team. It provides a wide range of features for data visualization, including graphs, charts, and tables.

## Usage

Here is a docker compose file that starts Prometheus and Grafana:

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --web.console.libraries=/usr/share/prometheus/console_libraries
      - --web.console.templates=/usr/share/prometheus/consoles
      - --web.enable-lifecycle
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    ports:
      - '9090:9090'
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./grafana/dashboards:/var/lib/grafana/dashboards
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - '3003:3000'
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    volumes:
      - ./alertmanager:/etc/alertmanager
    command:
      - --config.file=/etc/alertmanager/config.yml
      - --storage.path=/alertmanager
    ports:
      - '9093:9093'
    restart: unless-stopped

volumes:
  prometheus_data: {}
  grafana_data: {}
```

If you want to monitor your server or even containers, you can add services like:

```yaml
node-exporter:
  image: prom/node-exporter:latest
  container_name: node-exporter
  volumes:
    - /proc:/host/proc:ro
    - /sys:/host/sys:ro
    - /:/rootfs:ro
  command:
    - --path.procfs=/host/proc
    - --path.sysfs=/host/sys
    - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($|/)'
  ports:
    - '9100:9100'
  networks:
    - monitoring
  restart: unless-stopped

cadvisor:
  image: gcr.io/cadvisor/cadvisor:latest
  container_name: cadvisor
  volumes:
    - /:/rootfs:ro
    - /var/run:/var/run:rw
    - /sys:/sys:ro
    - /var/lib/docker/:/var/lib/docker:ro
    - /dev/disk/:/dev/disk:ro
  ports:
    - '8080:8080'
  networks:
    - monitoring
  restart: unless-stopped
```

## Prometheus configuration

The Prometheus configuration file is located at `docker/monitoring/prometheus/prometheus.yml`. It contains the scrape configuration for the NestJS application.

## Grafana configuration

The Grafana configuration files is located at `docker/monitoring/grafana`. It contains the dashboard template for the NestJS application monitoring. Also, it contains configuration for the Prometheus data source.

## Sources

We use the following sources to setup monitoring for our application:

- [Monitoring a NestJS Application With Prometheus and Grafana](https://medium.com/@islam.farid16/monitoring-a-nestjs-application-with-prometheus-and-grafana-31436a495d0e)
- [Prometheus with Docker compose](https://last9.io/blog/prometheus-with-docker-compose/)
