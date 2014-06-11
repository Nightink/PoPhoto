
MOCHA_OPTS = --check-leaks
REPORTER = spec
REGISTRY = --registry=http://registry.npm.taobao.org

install:
	@npm install $(REGISTRY) --disturl=http://npm.taobao.org/dist

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --harmony \
		--require should \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

debug:
	@DEBUG=app,app:* NODE_ENV=development node --harmony app.js -d -p 3000

run:
	@NODE_ENV=release node --harmony app.js

watch:
	@grunt watch

.PHONY: install test test-unit debug run
