hosting on openshift
=====================

http://hello-webgl.out.ba/


Prvi rezultati ...
===================

Proceduralno kreirana dva dvoslojna kompozitna stakla (staklo + distancer + staklo2)

![interakcija sa 3D modelom - odabir stakla i setovanje dimenzija](https://github.com/hernad/hello_webgl/raw/master/images/glass_composition.png)

good enough version, rotacija i translacija pojedinačnog stakla:

![good-enoug](https://github.com/hernad/hello_webgl/raw/master/images/glass_composition_2.png)

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


third_party
============

https://github.com/mrdoob/three.js/

https://github.com/tparisi/Sim.js

mrdoob-three.js-a8853b8$ cp ./utils/exporters/obj/convert_obj_three.py
