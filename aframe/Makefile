watch: build
	fswatch -0 *.js | xargs -0 -n 1 -I {} make build
	
.PHONY: build
build:
	cat ../threex*.js aframe-artoolkit.js ../vendor/jsartoolkit/artoolkit.api.js ../vendor/jsartoolkit/artoolkit.debug.js > build/aframe-artoolkit.js 

minify: build
	uglifyjs build/aframe-artoolkit.js > build/aframe-artoolkit.min.js
