install: install-deps

develop:
	npx webpack-serve

install-deps:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .
