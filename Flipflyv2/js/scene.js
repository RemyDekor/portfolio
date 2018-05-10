/*global THREE */     // This is a rapid fix to avoid ESlint throwing errors for "THREE" Object
/*global Stats */     // This is a rapid fix to avoid ESlint throwing errors for "Stats" Object
'use strict';

let stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom

// let xPanel = stats.addPanel( new Stats.Panel( 'x', '#ff8', '#221' ) );
// let yPanel = stats.addPanel( new Stats.Panel( 'y', '#f8f', '#212' ) );
// stats.showPanel( 3 );

document.body.appendChild( stats.dom );

window.addEventListener('load', function() {

    let container, camera, scene, renderer, controls, geometry, material, mesh, dirLight, hemiLight;
    let t = 0;

    let camToWorldDirection = new THREE.Vector3( );
    let planeTarget = new THREE.Vector3( );


    container = document.getElementById( 'container' );

    // camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );

    // let rapportHL, cameraWidth;
    // cameraWidth = 175;
    // cameraWidth += window.innerWidth;
    // cameraWidth /= 3;
    // rapportHL = window.innerHeight/window.innerWidth;
    // camera = new THREE.OrthographicCamera( -cameraWidth, cameraWidth, cameraWidth*rapportHL, -cameraWidth*rapportHL     , -500, 1500 );
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 3000);

    controls = new THREE.DeviceOrientationControls( camera );

    scene = new THREE.Scene();

    geometry = new THREE.SphereBufferGeometry( 500, 128, 64 );
    geometry.scale( - 1.85, 1.85, 1.85 );
    let colorsForLayersLandscape = new THREE.TextureLoader().load( 'Test3Plans_v9_matin_3.jpg' );
    material = new THREE.MeshBasicMaterial({
      map: colorsForLayersLandscape,
      transparent: true,
      premultipliedAlpha: true,
      side: THREE.FrontSide,
      // alphaTest: 0.5,
      opacity: 1
    });
    let alphaMap = new THREE.TextureLoader().load( 'alphaMap_3.png' );
    material.alphaMap = alphaMap;
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    geometry = new THREE.SphereBufferGeometry( 500, 128, 64 );
    geometry.scale( - 1.25, 1.25, 1.25 );
    colorsForLayersLandscape = new THREE.TextureLoader().load( 'Test3Plans_v9_matin_2.jpg' );
    material = new THREE.MeshBasicMaterial({
      map: colorsForLayersLandscape,
      transparent: true,
      premultipliedAlpha: true,
      side: THREE.FrontSide,
      opacity: 1
    });
    alphaMap = new THREE.TextureLoader().load( 'alphaMap_2.png' );
    material.alphaMap = alphaMap;
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );


    geometry = new THREE.SphereBufferGeometry( 500, 128, 64 );
    geometry.scale( - 0.95, 0.95, 0.95 );
    colorsForLayersLandscape = new THREE.TextureLoader().load( 'Test3Plans_v9_matin_1.jpg' );
    material = new THREE.MeshBasicMaterial({
      map: colorsForLayersLandscape,
      transparent: true,
      side: THREE.FrontSide,
      // alphaTest: 0.5,
      depthWrite: false,
      opacity: 1
    });
    alphaMap = new THREE.TextureLoader().load( 'alphaMap_1.png' );
    material.alphaMap = alphaMap;
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );





    // geometry = new THREE.SphereBufferGeometry( 500, 64, 32 );
    // geometry.scale( - 0.25, 0.25, 0.25 );
    // colorsForLayersLandscape = new THREE.TextureLoader().load( 'Nuages.jpg' );
    // // let colorsForLayersLandscape = new THREE.TextureLoader().load( 'Test3Plans_matin.jpg' );
    // colorsForLayersLandscape.magFilter = THREE.LinearFilter;
    // colorsForLayersLandscape.minFilter = THREE.LinearFilter;
    // // let material = new THREE.MeshBasicMaterial( {
    // //       // map: new THREE.TextureLoader().load( 'Test_01.jpg' )
    // //       //color: 0xff00ff,
    // //       map: colorsForLayersLandscape
    // // } );
    // let materialNuages = new THREE.MeshBasicMaterial({
    //   map: colorsForLayersLandscape,
    //   transparent: true,
    //   side: THREE.DoubleSide,
    //   opacity: 0.1
    // });
    // alphaMap = new THREE.TextureLoader().load( 'alphaMap_3.png' );
    // material.alphaMap = alphaMap;

    // let meshNuages = new THREE.Mesh( geometry, materialNuages );
    // scene.add( meshNuages );

    let planeGroup = new THREE.Object3D();

    let loader = new THREE.JSONLoader();

    let plane;
    loader.load( 'PlaneJSON/Plane_Propre_7_Fuselage.json', function afterLoadJsonCallback( geometry, materials ) {
        // let material = new THREE.MeshBasicMaterial( { color: 0xff00ff, side: THREE.BackSide, wireframe: true } );
        // let material = materials[ 0 ];
        plane = new THREE.Mesh( geometry, materials );
        materials.shadowSide = THREE.DoubleSide;
        plane.castShadow = true;
        plane.receiveShadow = true;

        planeGroup.add( plane );
    } );

    let perso;
    loader.load( 'PlaneJSON/Plane_Propre_7_Perso.json', function( geometry, materials ) {
        perso = new THREE.Mesh( geometry, materials );
        materials.shadowSide = THREE.DoubleSide;
        perso.castShadow = true;
        perso.receiveShadow = true;

        planeGroup.add( perso );
    } );

    let roues;
    loader.load( 'PlaneJSON/Plane_Propre_7_Roues.json', function( geometry, materials ) {
        roues = new THREE.Mesh( geometry, materials );
        materials.shadowSide = THREE.DoubleSide;
        roues.castShadow = true;
        roues.receiveShadow = true;

        planeGroup.add( roues );
    } );

    let structure;
    loader.load( 'PlaneJSON/Plane_Propre_7_Structure.json', function( geometry, materials ) {
        structure = new THREE.Mesh( geometry, materials );
        materials.shadowSide = THREE.DoubleSide;
        structure.castShadow = true;
        structure.receiveShadow = true;

        planeGroup.add( structure );
    } );

    let helice;
    loader.load( 'PlaneJSON/Plane_Propre_7_Helice.json', function( geometry, materials ) {
        //side: THREE.BackSide
        // let material = materials[ 0 ];
        helice = new THREE.Mesh( geometry, materials );

        //mesh.position.z = -50;
        materials.shadowSide = THREE.DoubleSide;
        helice.castShadow = true;
        helice.receiveShadow = true;

        planeGroup.add( helice );

        geometry = new THREE.CircleBufferGeometry( 1.5, 16 );
        // Check si je dois faire un disque à deux faces pour le probleme de transparence
        material = new THREE.MeshStandardMaterial( {
          color: 0x303030,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
          wireframe: false
        } );
        let circle = new THREE.Mesh( geometry, material );

        circle.position.x = +1.72;
        circle.rotation.y = Math.PI/2;

        planeGroup.add( circle );


    } );
    // planeGroup.scale.set(8.5, 8.5, 8.5);
    planeGroup.scale.set(14, 14, 14);
    scene.add( planeGroup );

    // let geometry = new THREE.BoxBufferGeometry( 100, 100, 100, 3, 3, 3 );
    // let material = new THREE.MeshBasicMaterial( { color: 0xff00ff, transparent: true, opacity: 0.07, side: THREE.BackSide, wireframe: true } );
    // let mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );

    // PARTICLES

    // create the particle variables
    let particleCount = 180,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.PointsMaterial({
          color: 0xFFFFFF,
          size: 1
        });

    // now create the individual particles
    for (let p = 0; p < particleCount; p++) {
      // create a particle with random
      // position values, -250 -> 250
      let pX = Math.random() * 500 - 250,
          pY = Math.random() * 500 - 250,
          pZ = Math.random() * 500 - 250,
          particle = new THREE.Vector3(pX, pY, pZ);
      // add it to the geometry
      particles.vertices.push(particle);
    }

    // create the particle system
    let particleSystem = new THREE.Points(
        particles,
        pMaterial);

    // add it to the scene
    scene.add( particleSystem );


    // LIGHTS

    let ambientLight = new THREE.AmbientLight( 0x8888aa );
    scene.add( ambientLight );

    //

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
    hemiLight.color.setHSL( 0.6, 0.9, 0.6 );
    hemiLight.groundColor.setHSL( 0.48, 0.2, 0.4 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    //

    dirLight = new THREE.DirectionalLight( 0xffffff, 1.4 );
    let shdwBx = 384;
    // dirLight.color.setHSL( 0.1, 1, 0.95 );
    // dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.set( 0, shdwBx, 0 );

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    dirLight.shadow.camera.left = -shdwBx;
    dirLight.shadow.camera.right = shdwBx;
    dirLight.shadow.camera.top = shdwBx;
    dirLight.shadow.camera.bottom = -shdwBx;

    // dirLight.shadow.camera.near = -500;
    // dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = shdwBx*2;
    dirLight.shadow.bias = -5;
    scene.add( dirLight );

    // let shadowCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
    // shadowCameraHelper.visible = true;
    // scene.add( shadowCameraHelper );





    // RENDERER

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    container.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    window.addEventListener('resize', function() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

    }, false);

    let animate = function(){

        stats.begin();

        window.requestAnimationFrame( animate );
        controls.update();

        camToWorldDirection = camera.getWorldDirection(camToWorldDirection);
        camera.position.set(0,0,0);
        camera.position.add( camToWorldDirection.multiplyScalar(-500) );

        if (plane != null && helice != null) {
            planeGroup.rotation.x   += 0.01;
            planeGroup.rotation.y   += 0.002;
            helice.rotation.x   += 0.87;

            planeTarget.copy( camToWorldDirection );
            planeTarget.multiplyScalar( -0.75 );

            let d = new THREE.Vector3( );
            d.copy( planeTarget.sub(planeGroup.position) );
            d.multiplyScalar(0.1);

            planeGroup.position.add( d );
            let turbulence = new THREE.Vector3( Math.sin(t*0.12), Math.sin(t*0.09), Math.sin(t*0.06) );
            planeGroup.position.add( turbulence );
        }

        // if (materialNuages != null) {
        //     materialNuages.opacity = Math.sin(t*0.05) * 0.4 + 0.4;
        //     meshNuages.rotation.y += 0.05;
        //     // meshNuages.position.set(0,0,0);
        //     meshNuages.position.copy( camera.position );
        // }
        t++;
        // shadowCameraHelper.update();
        renderer.render(scene, camera);

        stats.end();

    };

    window.requestAnimationFrame( animate );

    }, false);
