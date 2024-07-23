import './App.css';
import * as THREE from 'three';
import { ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { OrbitControls, TransformControls } from 'three/examples/jsm/Addons.js';
import { Hierachy } from './components/panel/Hierachy';

import { log, Log } from './components/Debug';
import { useWindowDimensions } from './hooks/windowDimensionHook';

export const Config = {
  visual: {
    far:  1000,
    near: 0.1,
    fov:  75
  }
}

type Bounding = {
  top:number,
  left:number,
  width:number,
  height:number
}

function App() {
  console.log = log;
  
  // Template Area
  const windowAspect = 5 * (3/2);
  const windowDimension = useWindowDimensions();
  const windowBounding:Bounding = {
    top:0,
    left: 0,
    width: windowDimension.width * windowAspect,
    height: windowDimension.height
  };

  const objects:THREE.Object3D[] = [];
  const scene = new THREE.Scene();

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(windowBounding.width, windowBounding.height);

  const aspect = windowBounding.width / windowBounding.height;
  const camera = new THREE.PerspectiveCamera(
    Config.visual.fov,
    aspect,
    Config.visual.near,
    Config.visual.far,
  );

  const [orbitControl, setOrbitControl] = useState<OrbitControls>(
    new OrbitControls(camera, renderer.domElement)
  );
  camera.position.set(2,10,10);
  orbitControl.update();

  const [transformControl, setTransformControl] = useState<TransformControls>(
    new TransformControls(camera, renderer.domElement)
  );
  scene.add(transformControl);

  addControl(
    objects,
    camera,
    orbitControl,
    transformControl,
    renderer.domElement,
    windowBounding
  );

  const animate = () => {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
  }
  animate();

  useEffect(() => {
    if(canvasContainerRef.current == null) return;

    canvasContainerRef.current.appendChild(renderer.domElement);

  }, []);
  return (
    <ChakraProvider>
      <Log />
      <Grid
        gridTemplateAreas={`"view hierachy"`}
        w="100vw"
        h="100vh"
        gridTemplateColumns={"3fr 2fr"}>
        <GridItem area="view" ref={canvasContainerRef}>
        </GridItem>
        <GridItem area="hierachy">
          <Hierachy
            scene={scene}
            orbitControl={orbitControl}
            transformControl={transformControl}
            objects={objects} />
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

function addControl(
  objects:THREE.Object3D[],
  camera:THREE.PerspectiveCamera,
  orbit:OrbitControls,
  transform:TransformControls,
  dom:HTMLElement,
  bounding:Bounding
) {
  const last = {x: 0, y:0};
  let dist = 0;
  dom.addEventListener('pointerdown', (e) => {
    last.x = e.clientX;
    last.y = e.clientY;
  });
  dom.addEventListener('pointerup', (e) => {
    dist = (
      (last.x - e.clientX) * (last.x - e.clientX) +
      (last.y - e.clientY) * (last.y - e.clientY)
    );
  });
  dom.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( new THREE.Vector2(
      ( (event.clientX - bounding.left) / bounding.width  ) * 2 - 1,
      -( (event.clientY - bounding.top ) / bounding.height ) * 2 + 1
    ), camera);

    const intersects = raycaster.intersectObjects( objects);
    if(intersects.length == 0) {
      if(dist != 0) return;
      transform.detach();
      return;
    }
    transform.attach(intersects[0].object);
  });
  transform.addEventListener('mouseDown', () => {
    orbit.enabled = false;
  });
  transform.addEventListener('mouseUp', () => {
    orbit.enabled = true;
  });
}

export default App;