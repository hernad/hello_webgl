hosting on openshift
=====================

http://hellowebgl-knowhow.rhcloud.com/hello_webgl/index.html


Chrome extensions 
===================

REJECTED - na kraju obicna web aplikacija

[developing and debugging youtube](http://www.youtube.com/watch?v=IP0nMv_NI1s)

[WebGL up and running](http://assets.en.oreilly.com/1/event/83/WebGL%20Up%20and%20Running%20Presentation.pdf)

https://github.com/vjt/canvas-speedometer

https://github.com/jeromeetienne/threejsboilerplate

https://github.com/jeromeetienne/threex

blender export
================
 
1)

export blender => wavefront obj format


2)

three.js exporter:

python /tmp/convert_obj_three.py -i ~/Documents/kuca.obj -o models/Kuca/kuca.js

3)

format 3.1 u dobijenom json fajlu ispraviti => 3

4)

Chapter 8/game view modeler, dodao load ovog modela sa parametrima:

           { modelClass : JSONModel, url : "../models/Kuca/kuca.js", scale:0.5, position:{x:0, y:0}, 
		              	rotation:{ x: 0, z: 0   }, model:null},


nakon toga se ucita model ok, ali su materijali poremeceni (boje)


