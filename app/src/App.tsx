import './App.css';
import * as THREE from 'three';
import { ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { OrbitControls, TransformControls } from 'three/examples/jsm/Addons.js';
import { Hierachy } from './components/panel/Hierachy';

import { log, Log } from './components/Debug';

export type Controls = {
  orbit: OrbitControls,
  transform: TransformControls
}

export const Config = {
  visual: {
    far:  1000,
    near: 0.1,
    fov:  75
  }
}
const Global : {
  scene: THREE.Scene,
  objects: THREE.Object3D[],
  controls: Controls
} = {
  scene: new THREE.Scene(),
  objects: [],
  // Not initialized yet
  controls: {
    orbit: {} as OrbitControls,
    transform: {} as TransformControls
  }
}

function App() {
  console.log = log;
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(canvasContainerRef.current == null) return;
    const boundingBox = canvasContainerRef.current.getBoundingClientRect();
    const aspect = boundingBox.width / boundingBox.height;
    const camera = new THREE.PerspectiveCamera(
      Config.visual.fov,
      aspect,
      Config.visual.near,
      Config.visual.far,
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(boundingBox.width, boundingBox.height); 
    

    Global.controls = {
      orbit: new OrbitControls(camera, renderer.domElement),
      transform: new TransformControls(camera, renderer.domElement)
    }
    Global.scene.add(Global.controls.transform);

    camera.position.set(2,10,10);
    Global.controls.orbit.update();

    addControl(
      camera,
      Global.controls.orbit,
      Global.controls.transform,
      renderer.domElement
    );

    canvasContainerRef.current.appendChild(renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      
      renderer.render(Global.scene, camera);
    }
    animate();

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
            scene={Global.scene}
            controls={Global.controls}
            objects={Global.objects} />
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

function addControl(
  camera:THREE.PerspectiveCamera,
  orbit:OrbitControls,
  transform:TransformControls,
  dom:HTMLElement
) {
  const bounding = dom.getBoundingClientRect();
  dom.addEventListener('pointerdown', (event) => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( new THREE.Vector2(
      ( (event.clientX - bounding.left) / bounding.width  ) * 2 - 1,
      -( (event.clientY - bounding.top ) / bounding.height ) * 2 + 1
    ), camera);
    
    Global.scene.add(new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin ));
    
    const intersects = raycaster.intersectObjects( Global.objects);
    if(intersects.length == 0) return;
    transform.attach(intersects[0].object);
  });
  transform.addEventListener('mouseDown', () => {
    orbit.enabled = false;
  });
}

export default App;