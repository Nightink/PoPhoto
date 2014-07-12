
MOCHA_OPTS = --check-leaks
REPORTER = spec

install:
	@npm install --registry=http://registry.npm.taobao.org \
		--disturl=http://npm.taobao.org/dist \
		--cache=$HOME/.npm/.cache/cnpm

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--harmony \
		--require should \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

debug:
	@DEBUG=* NODE_ENV=development node --harmony index.js -d -p 3000

run:
	@DEBUG=app,app:* NODE_ENV=release node --harmony index.js

jshint:
	@./node_modules/.bin/jshint ./

.PHONY: install test debug run
