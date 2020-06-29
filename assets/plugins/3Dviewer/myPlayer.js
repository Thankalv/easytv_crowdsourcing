

import * as THREE from '../build/three.module.js';

import Stats from './jsm/libs/stats.module.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { FBXLoader } from './jsm/loaders/FBXLoader.js';

var container, stats, controls, containter3D, canvasCol;
var camera, scene, renderer, light;
var runningAction;
var clips = [4,8];
var nextClip = 1;

var clock = new THREE.Clock();

var mixer;
var pauseClick, deltaPaused;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    canvasCol = document.getElementById("canvasCol");
    containter3D = document.getElementById("3dContainer");
    containter3D.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 100, 200, 300 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add( light );

    // scene.add( new CameraHelper( light.shadow.camera ) );

    // ground
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    // model
    var loader = new FBXLoader();
    loader.load( '../plugins/3Dviewer/models/fbx/'+motionFile, function ( objectMotion ) {
      loader.load( '../plugins/3Dviewer/models/fbx/EmilioAvatar_BodyModel.fbx', function ( object ) {

        mixer = new THREE.AnimationMixer( object );
        runningAction = mixer.clipAction( objectMotion.animations[ 0 ] );
        runningAction.play();

        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        scene.add( object );

      }); 
    });

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 0.6*window.innerWidth, 0.8*window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize, false );

    // stats
    //stats = new Stats();
    //container.appendChild( stats.dom );
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width  = canvasCol.width;
    canvas.height = canvasCol.height;

    onWindowResize();
}

$("#stop").on("click", function () {
    console.log("Pause clicked!");
    //deltaPaused = clock.getDelta();
    //pauseClick = true;
    clock.stop();
});
$("#play").on("click", function () {
    console.log("Play clicked!");
    //pauseClick = false;
    clock.start();
});


$("#change").on("click", function () {
    console.log("New-motion requested!");
    //pauseClick = false;
    // model
    var loader = new FBXLoader();
    loader.load( '../plugins/3Dviewer/models/fbx/Motion_Emilio-'+clips[nextClip]+'_new.fbx', function ( objectMotion ) {
        nextClip = (nextClip+1)%2;
        mixer._deactivateAction(runningAction);
        runningAction = mixer.clipAction( objectMotion.animations[ 0 ] );
        runningAction.play();
    });
});

function onWindowResize() {

    var newWidth = 0.6*window.innerWidth;
    camera.aspect = newWidth / (0.8*window.innerHeight);
    camera.updateProjectionMatrix();

    renderer.setSize( newWidth, 0.8*window.innerHeight );
}

//
function animate() {
    //if (pauseClick) return;

    requestAnimationFrame( animate );

    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );

    renderer.render( scene, camera );

    //stats.update();

}
