#!/bin/bash
SHELL := /bin/bash

# NGROK_URL parameter is required
include ./apc_server/secrets/.env

KILL=kill -9
KILLALL=killall -9
NGINX_CONF=/etc/nginx/nginx.conf

NPM=npm
NODE=node

all:
	$(MAKE) clearAll
	$(MAKE) build

build:
	$(MAKE) nginxUp
	$(MAKE) frontUp
	$(MAKE) backUp
	@echo "All services are up"

nginxUp:
	export NGROK_URL=$(NGROK_URL) \
	&& export PORT=$(PORT) \
	&& export FRONT_PORT=$(FRONT_PORT) \
	&& export NGINX_PORT=$(NGINX_PORT) \
	&& sudo -E envsubst '$${NGINX_PORT} $${NGROK_URL} $${PORT} $${FRONT_PORT}' < nginx.conf.template > $(NGINX_CONF)
	@sudo -E nginx -c $(NGINX_CONF)

frontUp:
	cd ./apc_front \
	&& export REACT_APP_NGROK_URL=$(NGROK_URL) && nohup $(NPM) start &

backUp:
	cd ./apc_server \
	&& export NGROK_URL=$(NGROK_URL) && nohup $(NPM) start &

clearAll:
	@echo "Down nginx..."
	@sudo $(KILLALL) nginx || echo
	@echo "Finding process using port $(PORT)..."
	@PID=$$(sudo lsof -t -i:$(PORT)); \
	if [ -z "$$PID" ]; then \
		echo "No backend process"; \
	else \
		echo "Killing backend process $$PID using port $(PORT)..."; \
		sudo $(KILL) $$PID; \
		echo "Process $$PID killed."; \
	fi
	@echo "Finding process using port $(FRONT_PORT)..."
	@PID=$$(sudo lsof -t -i:$(FRONT_PORT)); \
	if [ -z "$$PID" ]; then \
		echo "No backend process"; \
	else \
		echo "Killing backend process $$PID using port $(FRONT_PORT)..."; \
		sudo $(KILL) $$PID; \
		echo "Process $$PID killed."; \
	fi
	@echo "All services are down"

.PHONY: all build nginxUp frontUp backUp clearAll

