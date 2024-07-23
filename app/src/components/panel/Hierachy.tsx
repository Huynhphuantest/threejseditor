import * as THREE from 'three';
import { Dropdown, DropdownList, DropdownTrigger } from '../Dropdown';
import { Button, Text, Icon, IconProps, Menu, MenuButton, MenuItem, MenuList, Flex, Box } from '@chakra-ui/react';

import { useReducer } from 'react';
import { OrbitControls, TransformControls } from 'three/examples/jsm/Addons.js';

export function Hierachy({scene, orbitControl, transformControl, objects} : {
    scene: THREE.Scene,
    orbitControl: OrbitControls,
    transformControl: TransformControls,
    objects: THREE.Object3D[]
}) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const defaultMaterial = new THREE.MeshBasicMaterial({color:'red'});
    const createMesh = (geometry:THREE.BufferGeometry, name = "Object") => {
        const mesh = new THREE.Mesh(
            geometry,
            defaultMaterial
        );
        mesh.name = name;
        scene.add(mesh);
        objects.push(mesh);
        forceUpdate();
    }
    return <Flex
        padding={2}
        gap={1}
        flexDirection="column"
        justifyContent="start"
    >
        <HierachyDropdown scene={scene} createMesh={createMesh}/>
        <HierachyList objects={objects} orbitControl={orbitControl} transformControl={transformControl}/>
    </Flex>
}
function HierachyDropdown(
    {scene, createMesh} : {
        scene: THREE.Scene
        createMesh: (geometry:THREE.BufferGeometry, name?:string) => void
    }
) {
    return <Dropdown>
            <DropdownTrigger>
                +
            </DropdownTrigger>
            <DropdownList>
                <Menu>
                    <MenuButton>Shapes</MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => {createMesh(
                            new THREE.BoxGeometry(1,1,1),
                            "Box"
                        )}}>
                            Box
                        </MenuItem>
                        <MenuItem onClick={() => {createMesh(
                            new THREE.SphereGeometry(0.5),
                            "Sphere"
                        )}}>
                            Sphere
                        </MenuItem>
                        <MenuItem onClick={() => {createMesh(
                            new THREE.CylinderGeometry(0.5,1,1),
                            "Cylinder"
                        )}}>
                            Cylinder
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton>Lights</MenuButton>
                    <MenuList>
                        <MenuItem><Button onClick={() => {
                            scene.add(new THREE.AmbientLight());
                        }}>
                            Ambient
                        </Button></MenuItem>
                    </MenuList>
                </Menu>
            </DropdownList>
        </Dropdown>
}
function HierachyList(props: {
    objects:THREE.Object3D[],
    orbitControl: OrbitControls,
    transformControl: TransformControls
}) {
    const elements = props.objects.map(e => {
        return <Button
            padding="1rem"
            className='hierachy-element'
            display="flex"
            justifyContent={"start"}
            gap={5}
            onClick={() => {
                //console.log(JSON.stringify(props.transformControl));
                //props.controls.transform.attach(e)
            }}
            leftIcon={<CircleIcon/>}
        >
            {e.name}
        </Button>
    });
    return <Flex flexDirection="column" gap="1">
        {elements}
    </Flex>
}
function CircleIcon(props:IconProps) {
    return <Icon viewBox='0 0 200 200' {...props}>
      <path
        fill='gray.500'
        d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
      />
    </Icon>
}