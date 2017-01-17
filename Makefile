.PHONY: build

build:
	cat ../threex*.js ./*.js > build/aframe-artoolkit.js 

minify: build
	uglifyjs build/aframe-artoolkit.js > build/aframe-artoolkit.min.js