
MOCHA_OPTS= --check-leaks
REPORTER = spec

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--globals setImmediate,clearImmediate \
		$(MOCHA_OPTS)

run:
	@node app.js -d -p 3000


.PHONY: test test-unit run
