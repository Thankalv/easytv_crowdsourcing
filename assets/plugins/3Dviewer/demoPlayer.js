

import * as THREE from '../build/three.module.js';

import Stats from './jsm/libs/stats.module.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { FBXLoader } from './jsm/loaders/FBXLoader.js';

var container, stats, controls, containter3D, canvasCol;
var camera, scene, renderer, light;
var runningAction;

var clock = new THREE.Clock();

var mixer;
var pauseClick, deltaPaused;

init();
//animate();

function init() {

    container = document.createElement( 'div' );
    container.innerHTML = "<span id='canvas-loading' style='background:#80d680'> <div class='offset-md-4'> Please wait for the 3D-Avatar assets to load</div> <br> \
                            <i style='display:block;width:100%;height:100%;color:green;font-size:150px' class='fa fa-refresh fa-spin fa-4x fa-fw'></i> </span>"
    canvasCol = document.getElementById("canvasCol");
    containter3D = document.getElementById("3dContainer");
    containter3D.appendChild( container );

    var object2load;
    var loaderPromise = new Promise(function(resolve, reject) {
        function loadDone(object) {
            console.log("loader successfully completed loading task");
            loader.load( '../'+motionFile, function ( objectMotion ) {
                mixer = new THREE.AnimationMixer( object );
                runningAction = mixer.clipAction( objectMotion.animations[ 0 ] );
                runningAction.play();
                object.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                resolve(object); // it went ok!
            });
        }
        var loader = new FBXLoader();
        //loader.load("https://codefisher.org/static/images/pastel-svg/256/bullet-star.png", loadDone);
        loader.load( '../plugins/3Dviewer/models/fbx/EmilioAvatar_BodyModel.fbx', loadDone);
    });

    loaderPromise
      .then(function(response) {
            object2load = response;     //assign loaded data to full-scope variable
            initScene();                //initialize the render
            animate( );
            var loaderElement = document.getElementById("canvas-loading");
            loaderElement.parentNode.removeChild(loaderElement);
        }, function(err) {
            console.log(err);
        });

    function initScene() {
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
        scene.add( object2load );

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
        // stats = new Stats();
        //container.appendChild( stats.dom );
        onWindowResize();
    }
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
