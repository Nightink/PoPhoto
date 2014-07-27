
MOCHA_OPTS = --check-leaks
REPORTER = spec
REGISTRY = --registry=http://registry.npm.taobao.org

install:
	@npm install $(REGISTRY) --disturl=http://npm.taobao.org/dist

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

development:
	@DEBUG=app,app:* NODE_ENV=development node app.js -d -p 3000

production:
	@NODE_ENV=production node app.js

jshint:
	@./node_modules/.bin/jshint ./

.PHONY: test
