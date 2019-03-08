//author: Bhaskar Sharma March 8, 2019
//filename: Lab07
//purpose: a useful base for threejs applications

var camera, scene, renderer;
			var plane, cube;
			var mouse, raycaster, isShiftDown = false;
			var rollOverMesh, rollOverMaterial;
            var cubeGeo, cubeMaterial;
			var objects = [];

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 500, 800, 1300 );
    camera.lookAt( 0, 0, 0 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    
    // roll-over helpers
    var rollOverGeo = new THREE.BoxBufferGeometry( 50, 50, 50 );
    rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.5, transparent: true } );
    rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    scene.add( rollOverMesh );
    
    
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
    geometry.rotateX( - Math.PI / 2 );
    plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    scene.add( plane );
    objects.push( plane );
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );
    
    window.addEventListener( 'resize', onWindowResize, false );
}
function createCameraAndLights() {
    // position and point the camera to the center of the scene
   // camera.position.x = -30;
    //camera.position.y = 40;
    //camera.position.z = 30;
    //camera.lookAt(scene.position);

    // add subtle ambient lighting
   // lights
   var ambientLight = new THREE.AmbientLight( 0x606060 );
   scene.add( ambientLight );

    // add spotlight for the shadows
    //var spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
    //spotLight.position.set(-40, 60, -10);
    //spotLight.castShadow = true;
    //scene.add(spotLight);

}
function createGeometry(){
// cubes
cubeGeo = new THREE.BoxBufferGeometry( 50, 50, 50 );
cubeMaterial = new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load( '../assets/textures/square.png' ) } );

var gridHelper = new THREE.GridHelper( 1000, 20 );
scene.add( gridHelper );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        var intersect = intersects[ 0 ];
        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
    }
    render();
}
function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        var intersect = intersects[ 0 ];
        // delete cube
        if ( isShiftDown ) {
            if ( intersect.object !== plane ) {
                scene.remove( intersect.object );
                objects.splice( objects.indexOf( intersect.object ), 1 );
            }
            // create cube
        } else {
            var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
            voxel.position.copy( intersect.point ).add( intersect.face.normal );
            voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
            scene.add( voxel );
            objects.push( voxel );
        }
        render();
    }
}
function onDocumentKeyDown( event ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = true; break;
    }
}
function onDocumentKeyUp( event ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = false; break;
    }
}


function render() {
//    orbitControls.update();
  renderer.render(scene, camera); 
    
    requestAnimationFrame(render);
}

window.onload = () => {

    init();
    createGeometry();
    createCameraAndLights();
    render();

}