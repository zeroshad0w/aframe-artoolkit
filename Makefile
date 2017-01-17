.PHONY: build

build:
	cat aframe-artoolkit.js ./vendor/jsartoolkit/artoolkit.api.js ./vendor/jsartoolkit/artoolkit.debug.js > build/aframe-artoolkit.js 

minify: build
	uglifyjs build/aframe-artoolkit.js > build/aframe-artoolkit.min.js
