# aframe-artoolkit
Augmented reality for a-frame

```html
<!-- add artoolkit into your scene -->
<a-scene artoolkit>
        <!-- define a marker -->
        <a-marker>
                <!-- define the content to be displayed on top of the marker -->
                <a-cube>
        </a-marker>
        <!-- define a simple camera -->
        <a-entity camera></a-entity>
</a-scene>
```

# Show, Don't Tell
Here are the demos

- [basic.html](https://jeromeetienne.github.io/aframe-artoolkit/examples/basic.html) 
basic minimal examples. Good to get started
- [demo.html](https://jeromeetienne.github.io/aframe-artoolkit/examples/demo.html) 
shows you all the possibilities of aframe-artoolkit. You can play around
- [marker-camera.html](https://jeromeetienne.github.io/aframe-artoolkit/examples/marker-camera.html):
Move the camera instead of using the usual "camera looking toward negative-z and modelViewMatrix"
- [multiple-independant-maker.html](https://jeromeetienne.github.io/aframe-artoolkit/3examples/multiple-independant-maker.html):
Handle multiple indepant markers in a single scene.
- [minecraft.html](https://jeromeetienne.github.io/aframe-artoolkit/examples/minecraft.html): 
include a minecraft on the marker
- [hatsune.html](https://jeromeetienne.github.io/aframe-artoolkit/examples/hatsune.html) 
include a hatsune miku on the marker


# <a-marker-camera>
Usually the model used in augmented reality is about changing the modelViewMatrix 
based on the marker position. the camera being static in 0,0,0 looking toward negative z.

We define as well a model where we move the camera, instead of the object.
It changes the camera transform matrix.
This cameraTransform mode seems more instinctive than the modelView mode.
cameraTransform would fit well a room-scale setup, with *multiple markers connected to each other*.
modelView is able to provide multiple *independant* markers.

```html
<!-- add artoolkit into your scene -->
<a-scene artoolkit>
        <!-- define your scene as usual -->
        <a-cube>
        <!-- define a camera inside the <a-marker-camera> -->
        <a-marker-camera>
                <a-entity camera></a-entity>
        <a-marker-camera>
</a-scene>
```

# Links

- [slides about aframe-artoolkit](http://jeromeetienne.github.io/slides/artoolkit-aframe/)
- Augmented reality is about [understand the view matrix](http://www.3dgep.com/understanding-the-view-matrix/)
- [jsartoolkit5](https://github.com/artoolkit/jsartoolkit5)
- [artoolkit5](https://github.com/artoolkit/artoolkit5/)
- good collection of [marker patterns](https://github.com/artoolkit/artoolkit5/tree/master/doc/patterns)
