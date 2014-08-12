
MOCHA_OPTS = --check-leaks
REPORTER = spec
REGISTRY = --registry=http://registry.npm.taobao.org

TESTS = test/*

init:
	@if ! test -f config.json; then \
		cp config.json.default config.json; \
	fi

install:
	@npm install $(REGISTRY) --disturl=http://npm.taobao.org/dist
	@$(MAKE) init

test: install
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		$(TESTS) \
		$(MOCHA_OPTS)

development:
	@DEBUG=app,app:* NODE_ENV=development node app.js -d -p 3000

production:
	@NODE_ENV=production node app.js

jshint:
	@./node_modules/.bin/jshint ./

.PHONY: test
