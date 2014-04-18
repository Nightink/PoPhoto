
MOCHA_OPTS= --check-leaks
REPORTER = spec

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

debug:
	@DEBUG=app,app:* NODE_ENV=development node app.js -d -p 3000

run:
	@NODE_ENV=release node app.js

.PHONY: test test-unit debug run