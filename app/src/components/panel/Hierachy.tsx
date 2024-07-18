import * as THREE from 'three';
import { Controls } from '../../App';
import { Dropdown, DropdownList, DropdownTrigger } from '../Dropdown';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
export function Hierachy({scene, controls, objects} : {
    scene: THREE.Scene
    controls: Controls,
    objects: THREE.Object3D[]
}) {
    const defaultMaterial = new THREE.MeshBasicMaterial({color:'red'});
    const createMesh = (geometry:THREE.BufferGeometry) => {
        const mesh = new THREE.Mesh(
            geometry,
            defaultMaterial
        );
        scene.add(mesh);
        objects.push(mesh);
    }
    return <article>
        <Dropdown>
            <DropdownTrigger>
                +
            </DropdownTrigger>
            <DropdownList>
                <Menu>
                    <MenuButton>Shapes</MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => {createMesh(
                            new THREE.BoxGeometry(1,1,1)
                        )}}>
                            Box
                        </MenuItem>
                        <MenuItem onClick={() => {createMesh(
                            new THREE.SphereGeometry(0.5)
                        )}}>
                            Sphere
                        </MenuItem>
                        <MenuItem onClick={() => {createMesh(
                            new THREE.CylinderGeometry(0.5,1,1)
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
    </article>
}