
MOCHA_OPTS= --check-leaks
REPORTER = spec

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

debug:
	@DEBUG=app,app:* ./app.js -d -p 3000

run:
	@node app.js

.PHONY: test test-unit debug run