#!/bin/bash
SHELL := /bin/bash

include ./.env

KILL=kill -9
KILLALL=killall -9
NGINX_CONF=/etc/nginx/nginx.conf

NPM=npm
NODE=node

all:
	$(MAKE) clean
	$(MAKE) build

build:
	$(MAKE) setEnvironment
	$(MAKE) nginxUp
	$(MAKE) frontUp
	$(MAKE) producerUp
	$(MAKE) tokenUp
	$(MAKE) customerUp
	$(MAKE) backUp
	@echo "All services are up"

setEnvironment:
	@sudo cp ./.env ./apc_server/.env \
	&& export PORT=$(PORT) \
	&& export FRONT_PORT=$(FRONT_PORT) \
	&& export NGINX_PORT=$(NGINX_PORT) \
	&& export TOKEN_PORT=$(TOKEN_PORT) \
	&& export CUSTOMER_PORT=$(CUSTOMER_PORT) \
	&& export PRODUCER_PORT=$(PRODUCER_PORT) \
	&& export API_KEY=$(API_KEY) \
	&& export AUTH_DOMAIN=$(AUTH_DOMAIN) \
	&& export DATABASE_URL=$(DATABASE_URL) \
	&& export PROJECT_ID=$(PROJECT_ID) \
	&& export STORAGE_BUCKET=$(STORAGE_BUCKET) \
	&& export MESSAGING_SENDER_ID=$(MESSAGING_SENDER_ID) \
	&& export APP_ID=$(APP_ID) \
	&& export MEASUREMENT_ID=$(MEASUREMENT_ID) \
	&& export TOKEN_SECRET_KEY=$(TOKEN_SECRET_KEY) \
	&& sudo -E envsubst '$${FRONT_PORT}' \
	 < ./apc_front/.env.template > ./apc_front/.env \
	&& sudo -E envsubst '$${PRODUCER_PORT} $${API_KEY} $${AUTH_DOMAIN} $${DATABASE_URL} $${PROJECT_ID} $${STORAGE_BUCKET} $${MESSAGING_SENDER_ID} $${APP_ID} $${MEASUREMENT_ID}' \
	 < ./producer/.env.template > ./producer/.env \
	&& sudo -E envsubst '$${CUSTOMER_PORT} $${API_KEY} $${AUTH_DOMAIN} $${DATABASE_URL} $${PROJECT_ID} $${STORAGE_BUCKET} $${MESSAGING_SENDER_ID} $${APP_ID} $${MEASUREMENT_ID}' \
	 < ./customer/.env.template > ./customer/.env \
	&& sudo -E envsubst '$${TOKEN_PORT} $${TOKEN_SECRET_KEY}' \
	 < ./token-server/.env.template > ./token-server/.env
ifeq ($(shell uname), Darwin)
	@sed -i '' 's|"homepage": "[^"]*"|"homepage": "$(NGROK_URL)/producer"|' ./producer/package.json
	@sed -i '' 's|"homepage": "[^"]*"|"homepage": "$(NGROK_URL)/customer"|' ./customer/package.json
else
	@sed -i 's|"homepage": "[^"]*"|"homepage": "$(NGROK_URL)/producer"|' ./producer/package.json
	@sed -i 's|"homepage": "[^"]*"|"homepage": "$(NGROK_URL)/customer"|' ./customer/package.json
endif
	@echo "set Environment complete"

nginxUp:
	@export NGROK_URL=$(NGROK_URL) \
	&& export PORT=$(PORT) \
	&& export FRONT_PORT=$(FRONT_PORT) \
	&& export NGINX_PORT=$(NGINX_PORT) \
	&& export TOKEN_PORT=$(TOKEN_PORT) \
	&& export CUSTOMER_PORT=$(CUSTOMER_PORT) \
	&& export PRODUCER_PORT=$(PRODUCER_PORT) \
	&& sudo -E envsubst '$${NGINX_PORT} $${NGROK_URL} $${PORT} $${FRONT_PORT} $${PRODUCER_PORT} $${CUSTOMER_PORT} $${TOKEN_PORT}' < nginx.conf.template > $(NGINX_CONF)
	@sudo -E nginx -c $(NGINX_CONF)

frontUp:
	cd ./apc_front \
	&& export REACT_APP_NGROK_URL=$(NGROK_URL) && nohup $(NPM) start &

producerUp:
	cd ./producer \
	&& export REACT_APP_NGROK_URL=$(NGROK_URL) && nohup $(NPM) start &

customerUp:
	cd ./customer \
	&& export REACT_APP_NGROK_URL=$(NGROK_URL) && nohup $(NPM) start &

tokenUp:
	cd ./token-server \
	&& export REACT_APP_NGROK_URL=$(NGROK_URL) && nohup $(NODE) server.js &

backUp:
	cd ./apc_server \
	&& export NGROK_URL=$(NGROK_URL) && nohup $(NPM) start &

install:
	cd ./apc_front && $(NPM) install
	cd ./apc_server && $(NPM) install
	cd ./producer && $(NPM) install
	cd ./customer && $(NPM) install
	cd ./token-server && $(NPM) install

clean:
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
		echo "No frontend process"; \
	else \
		echo "Killing frontend process $$PID using port $(FRONT_PORT)..."; \
		sudo $(KILL) $$PID; \
		echo "Process $$PID killed."; \
	fi

	@echo "Finding process using port $(PRODUCER_PORT)..."
	@PID=$$(sudo lsof -t -i:$(PRODUCER_PORT)); \
	if [ -z "$$PID" ]; then \
		echo "No frontend process"; \
	else \
		echo "Killing frontend process $$PID using port $(PRODUCER_PORT)..."; \
		sudo $(KILL) $$PID; \
		echo "Process $$PID killed."; \
	fi

	@echo "Finding process using port $(CUSTOMER_PORT)..."
	@PID=$$(sudo lsof -t -i:$(CUSTOMER_PORT)); \
	if [ -z "$$PID" ]; then \
		echo "No frontend process"; \
	else \
		echo "Killing frontend process $$PID using port $(CUSTOMER_PORT)..."; \
		sudo $(KILL) $$PID; \
		echo "Process $$PID killed."; \
	fi

	@echo "Finding process using port $(TOKEN_PORT)..."
	@PID=$$(sudo lsof -t -i:$(TOKEN_PORT)); \
	if [ -z "$$PID" ]; then \
		echo "No frontend process"; \
	else \
		echo "Killing frontend process $$PID using port $(TOKEN_PORT)..."; \
		sudo $(KILL) $$PID; \
		echo "Process $$PID killed."; \
	fi

	@echo "All services are down"

.PHONY: all build nginxUp frontUp backUp producerUp customerUp clean install

