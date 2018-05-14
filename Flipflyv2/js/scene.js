/*global THREE */     // This is a rapid fix to avoid ESlint throwing errors for "THREE" Object
/*global Stats */     // This is a rapid fix to avoid ESlint throwing errors for "Stats" Object
/*global SimplexNoise */
'use strict';

let stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom

// let xPanel = stats.addPanel( new Stats.Panel( 'x', '#ff8', '#221' ) );
// let yPanel = stats.addPanel( new Stats.Panel( 'y', '#f8f', '#212' ) );
// stats.showPanel( 3 );

document.body.appendChild( stats.dom );

window.addEventListener('load', function() {

    let container, camera, scene, renderer, controls, geometry, material, mesh, dirLight, hemiLight;
    let simplex = new SimplexNoise();
    // let s = 700;
    let s = Math.max(window.innerWidth, window.innerHeight) * 0.3;
    let t = 0;

    // let timeOfTheDay = ['morning', 'noon', 'storm', 'sunset', 'night'];

    let camToWorldDirection = new THREE.Vector3( );
    let planeDirection = new THREE.Vector3();
    let planeTarget = new THREE.Vector3( );


    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 3000);

    controls = new THREE.DeviceOrientationControls( camera );

    scene = new THREE.Scene();

    // ADDING THE PLANE MESHES
    // TODO : Use a LoadingManager to load the whole scene, and use loading management to avoid repeating "castshadow = true" etc. for every meshes of the plane

    let planeGroup = new THREE.Group();
    let loader = new THREE.JSONLoader();

    let fuselageWings;
    loader.load( 'assets/planejson/Plane_Propre_8_decimate_Fuselage.json', function afterLoadJsonCallback( geometry, materials ) {
        materials = new THREE.MeshPhongMaterial( { color: 0xafafaf, side: THREE.DoubleSide } );
        // material = materials[ 0 ];
        fuselageWings = new THREE.Mesh( geometry, materials );
        fuselageWings.castShadow = true;
        fuselageWings.receiveShadow = true;

        planeGroup.add( fuselageWings );
    } );

    let perso;
    loader.load( 'assets/planejson/Plane_Propre_8_decimate_Perso.json', function( geometry, materials ) {
        materials = new THREE.MeshLambertMaterial( { color: 0x222222, side: THREE.DoubleSide } );
        // material = materials[ 0 ];
        perso = new THREE.Mesh( geometry, materials );
        perso.castShadow = true;
        perso.receiveShadow = true;

        planeGroup.add( perso );
    } );

    let roues;
    loader.load( 'assets/planejson/Plane_Propre_8_decimate_Roues.json', function( geometry, materials ) {
        materials = new THREE.MeshPhongMaterial( { color: 0x222222, side: THREE.DoubleSide } );
        // material = materials[ 0 ];
        roues = new THREE.Mesh( geometry, materials );
        roues.castShadow = true;
        roues.receiveShadow = true;

        planeGroup.add( roues );
    } );

    let structure;
    loader.load( 'assets/planejson/Plane_Propre_8_decimate_Structure.json', function( geometry, materials ) {
        materials = new THREE.MeshLambertMaterial( { color: 0xafafaf, side: THREE.DoubleSide } );
        // material = materials[ 0 ];
        structure = new THREE.Mesh( geometry, materials );
        structure.castShadow = true;
        structure.receiveShadow = true;

        planeGroup.add( structure );
    } );

    let helice;
    loader.load( 'assets/planejson/Plane_Propre_8_decimate_Helice.json', function( geometry, materials ) {
        materials = new THREE.MeshLambertMaterial( { color: 0x212121, side: THREE.DoubleSide } );
        // material = materials[ 0 ];
        helice = new THREE.Mesh( geometry, materials );
        helice.castShadow = true;
        helice.receiveShadow = true;

        planeGroup.add( helice );

        geometry = new THREE.CircleBufferGeometry( 1.5, 16 );
        // material = new THREE.MeshBasicMaterial( {
        //   color: 0x303030,
        //   transparent: true,
        //   opacity: 0.35,
        //   side: THREE.DoubleSide,
        //   wireframe: false
        // } );
        material = new THREE.MeshLambertMaterial( {
          color: 0x404040,
          side: THREE.DoubleSide,
          premultipliedAlpha: true,
          transparent: true,
          opacity: 0.8,
        } );
        material.blending = THREE.CustomBlending;
        material.blendEquation = THREE.ReverseSubtractEquation;
        material.blendSrc = THREE.SrcAlphaFactor; //default
        material.blendDst = THREE.OneFactor; //default
        let circle = new THREE.Mesh( geometry, material );

        circle.position.z = +1.72;

        planeGroup.add( circle );

    } );
    // planeGroup.scale.set(8.5, 8.5, 8.5);
    planeGroup.scale.set(s*0.037, s*0.037, s*0.037);
    // TODO: The following for-loop cannot work without proper loading management (planeGroup children meshes are still loading when this executes)
    // if (planeGroupLoaded == true) {
    //   for (let i=0 ; i < planeGroup.children.length ; i++) {
    //     planeGroup.children[i].castShadow = true;
    //     planeGroup.children[i].receiveShadow = true;
    //   }
    // }
    scene.add( planeGroup );

    // ADDING THE BACKGROUND SPHERES

    let colorsLayer1, colorsLayer2, colorsLayer3;

    // TODO : Loading management et callback/Promises qui fonctionnent (!!!) pour les textures en fonction de la phase de la journée
    // let time = 'morning';
    // switch(timeOfTheDay[time]) {
    //   case 'morning':
    //     colorsLayer3 = new THREE.TextureLoader().load( 'assets/img/morning_3.jpg', function(texture) { bgMaterial3.map = texture; } );
    //     colorsLayer2 = new THREE.TextureLoader().load( 'assets/img/morning_2.jpg', function(texture) { bgMaterial2.map = texture; } );
    //     colorsLayer1 = new THREE.TextureLoader().load( 'assets/img/morning_1.jpg', function(texture) { bgMaterial1.map = texture; } );
    //     break;
    //   case 'noon':
    //     colorsLayer1 = new THREE.TextureLoader().load( 'assets/img/noon_1.jpg' );
    //     colorsLayer2 = new THREE.TextureLoader().load( 'assets/img/noon_2.jpg' );
    //     colorsLayer3 = new THREE.TextureLoader().load( 'assets/img/noon_3.jpg' );
    //     break;
    //   case 'sunset':
    //     colorsLayer1 = new THREE.TextureLoader().load( 'assets/img/sunset_1.jpg' );
    //     colorsLayer2 = new THREE.TextureLoader().load( 'assets/img/sunset_2.jpg' );
    //     colorsLayer3 = new THREE.TextureLoader().load( 'assets/img/sunset_3.jpg' );
    //     break;
    //   case 'night':
    //     colorsLayer1 = new THREE.TextureLoader().load( 'assets/img/night_1.jpg' );
    //     colorsLayer2 = new THREE.TextureLoader().load( 'assets/img/night_2.jpg' );
    //     colorsLayer3 = new THREE.TextureLoader().load( 'assets/img/night_3.jpg' );
    //     break;
    // }

    geometry = new THREE.SphereBufferGeometry( s, 128, 64 );
    geometry.scale( - 2, 2, 2 );
    colorsLayer3 = new THREE.TextureLoader().load( 'assets/img/sunset_3.jpg');
    let bgMaterial3 = new THREE.MeshBasicMaterial({
      map: colorsLayer3,
      transparent: true,
      // premultipliedAlpha: true,
      side: THREE.FrontSide,
      opacity: 1
    });
    let alphaMap = new THREE.TextureLoader().load( 'assets/img/alphaMap_3.png' );
    bgMaterial3.alphaMap = alphaMap;
    mesh = new THREE.Mesh( geometry, bgMaterial3 );
    scene.add( mesh );

    geometry = new THREE.SphereBufferGeometry( s, 128, 64 );
    geometry.scale( - 1.60, 1.60, 1.60 );
    colorsLayer2 = new THREE.TextureLoader().load( 'assets/img/sunset_2.jpg');
    let bgMaterial2 = new THREE.MeshBasicMaterial({
      map: colorsLayer2,
      transparent: true,
      // premultipliedAlpha: true,
      side: THREE.FrontSide,
      opacity: 1
    });
    alphaMap = new THREE.TextureLoader().load( 'assets/img/alphaMap_2.png' );
    bgMaterial2.alphaMap = alphaMap;
    mesh = new THREE.Mesh( geometry, bgMaterial2 );
    scene.add( mesh );


    geometry = new THREE.SphereBufferGeometry( s, 128, 64 );
    geometry.scale( -1.2, 1.2, 1.2 );
    colorsLayer1 = new THREE.TextureLoader().load( 'assets/img/sunset_1.jpg');
    let bgMaterial1 = new THREE.MeshBasicMaterial({
      map: colorsLayer1,
      transparent: true,
      // premultipliedAlpha: true,
      side: THREE.FrontSide,
      depthWrite: false,
      opacity: 1
    });
    alphaMap = new THREE.TextureLoader().load( 'assets/img/alphaMap_1.png' );
    bgMaterial1.alphaMap = alphaMap;
    mesh = new THREE.Mesh( geometry, bgMaterial1 );
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
    // alphaMap = new THREE.TextureLoader().load( 'assets/img/alphaMap_3.png' );
    // material.alphaMap = alphaMap;

    // let meshNuages = new THREE.Mesh( geometry, materialNuages );
    // scene.add( meshNuages );



    //--------------
    // PARTICLES

    // create the sky's particles
    let skyParticleCount = s*.5,
        skyParticles = new THREE.Geometry(),
        skyParticlesMaterial = new THREE.PointsMaterial({
          color: 0xFFFFFF,
          size: s*0.004
        });
    // now create the individual skyParticles
    for (let p = 0; p < skyParticleCount; p++) {
      // create a particle with random
      // position values, -250 -> 250
      let pX = Math.random() * s*2 - s,
          pY = Math.random() * s*2 - s,
          pZ = Math.random() * s*2 - s,
          particle = new THREE.Vector3(pX, pY, pZ);
      // add it to the geometry
      skyParticles.vertices.push(particle);
    }
    // create the particle system
    let skyParticleSystem = new THREE.Points(
        skyParticles,
        skyParticlesMaterial);
    // add it to the scene
    scene.add( skyParticleSystem );

    // create the plane's smoke particles
    let smokeEmitter = new THREE.Vector3();

    let smokeParticleCount = s*4,
        smokeParticles = new THREE.Geometry(),
        smokeParticlesMaterial = new THREE.PointsMaterial({
          color: 0xFFFF77,
          transparent: true,
          opacity: 0.15,
          size: s*0.027
        });
    // now create the individual skyParticles
    for (let p = 0; p < smokeParticleCount; p++) {
      // create a particle with random
      // position values, -250 -> 250
      let pX = planeGroup.position.x + smokeEmitter.x - Math.random()*s,
          pY = planeGroup.position.y + smokeEmitter.y,
          pZ = planeGroup.position.z + smokeEmitter.z,
          particle = new THREE.Vector3(pX, pY, pZ);
      // add it to the geometry
      smokeParticles.vertices.push(particle);
    }
    // create the particle system
    let smokeParticleSystem = new THREE.Points(
        smokeParticles,
        smokeParticlesMaterial);
    // add it to the scene
    scene.add( smokeParticleSystem );


    //--------------
    // LIGHTS

    //morning
    hemiLight = new THREE.HemisphereLight( 0x8f5ade, 0x1c2b52, 1 );
    dirLight = new THREE.DirectionalLight( 0xf7f1cd, 0.7 );
    dirLight.position.set( -1, 0.2, 1 );
    //noon
    hemiLight = new THREE.HemisphereLight( 0x6bb7f7, 0x426686, 0.8 );
    dirLight = new THREE.DirectionalLight( 0xffffff, 1.1 );
    dirLight.position.set( 0, 1, 0 );
    //sunset
    hemiLight = new THREE.HemisphereLight( 0xe2687b, 0x624e99, 0.9 );
    dirLight = new THREE.DirectionalLight( 0xffc27c, 1 );
    dirLight.position.set( 1, 0.3, -1 );
    //night
    // hemiLight = new THREE.HemisphereLight( 0x313a4f, 0x1f202f, 1 );
    // dirLight = new THREE.DirectionalLight( 0x9ee2e0, 0.5 );
    // dirLight.position.set( -1, 1, -1 );

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    dirLight.shadow.camera.left = -s;
    dirLight.shadow.camera.right = s;
    dirLight.shadow.camera.top = s;
    dirLight.shadow.camera.bottom = -s;

    // dirLight.shadow.camera.near = -500;
    // dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.near = -s;
    dirLight.shadow.camera.far = s*2;
    dirLight.shadow.bias = - s*0.00002;

    scene.add( hemiLight );
    scene.add( dirLight );

    // let shadowCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
    // shadowCameraHelper.visible = true;
    // scene.add( shadowCameraHelper );




    //--------------
    // RENDERER

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    container.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    //--------------
    // CAMERA

    window.addEventListener('resize', function() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

    }, false);


    //--------------
    // ANIMATE

    let animate = function(){

        stats.begin();

        window.requestAnimationFrame( animate );
        controls.update();

        camToWorldDirection = camera.getWorldDirection(camToWorldDirection);
        camToWorldDirection.multiplyScalar(-s);
        camera.position.set(
          camToWorldDirection.x,
          camToWorldDirection.y,
          camToWorldDirection.z
        );

        if (fuselageWings != null && helice != null) {

            planeTarget.copy( camToWorldDirection );
            planeTarget.multiplyScalar( -0.75 );

            let d = new THREE.Vector3( );
            d.copy( planeTarget.sub(planeGroup.position) );
            d.multiplyScalar(0.09);

            planeGroup.position.add( d );

            let planeRotTarget = new THREE.Quaternion;
            planeRotTarget.copy(camera.quaternion);
            // let rotationAwayFromCam = new THREE.Quaternion( 0, 0.5, 0, 0.75 ); // Look RIGHT
            // let rotationAwayFromCam = new THREE.Quaternion( 0, 0.5, 0, -0.75 ); // Look LEFT
            // let rotationAwayFromCam = new THREE.Quaternion( 0.5, 0, 0.75, 0 ); // Look RIGHT , head's down
            // let rotationAwayFromCam = new THREE.Quaternion( 0.5, 0, -0.75, 0 ); // Look LEFT , head's down
            // let rotationAwayFromCam = new THREE.Quaternion( 0.4156, 0.4156, 0.5721, -0.5721 ); // Look UP
            let rotationAwayFromCam = new THREE.Quaternion( 0.4156, 0.4156, -0.5721, 0.5721 ); // Look DOWN

            // var a = new THREE.Euler( Math.PI*0.6, Math.PI, Math.PI*0.5, 'XYZ' );
            // let rotationAwayFromCam = new THREE.Quaternion;
            // rotationAwayFromCam.setFromEuler(a); _w: -0.5720614028176844 _x: 0.4156269377774535 _y: 0.4156269377774534 _z: 0.5720614028176844
            // if (test){
            //   console.log(rotationAwayFromCam);
            //   test = false;
            // } //

            // if (t > 180) {
            //   rotationAwayFromCam = new THREE.Quaternion( 0, 1, 0, 0 );
            //   if (t > 200) {rotationAwayFromCam = new THREE.Quaternion( 0, 0.5, 0, 0.75 );}
            // }
            rotationAwayFromCam.normalize();
            planeRotTarget.multiply(rotationAwayFromCam);

            // planeRotTarget.setFromAxisAngle(camera.up, Math.PI*0.5);

            planeGroup.quaternion.slerp(planeRotTarget, 0.03);

            //TODO : Use 1D noise instead of 2D... OR USE MULTI-DIMENTIONNAL NOISE EFFICIENTLY ?????
            let turbulenceVforPos = new THREE.Vector3(
              // simplex.noise2D(t*0.02, 0) * 0.8,
              // simplex.noise2D(t*0.035 + 1.5, 0) * 1.5,
              // simplex.noise2D(t*0.01 + 3.5, 0) * 0.6
              simplex.noise2D(t*0.02, 0) * s*0.002,
              simplex.noise2D(t*0.035 + 1.5, 0) * s*0.003,
              simplex.noise2D(t*0.01 + 3.5, 0) * s*0.0015
            );

            //TODO : The noise for the rotation is not really good yet... Have to get a better understanding of quaternion operations
            // and maybe : the two .slerp() operations are conflicting and giving jolts (à-coups)
            // let turbulenceVforRot = new THREE.Vector3(
            //   simplex.noise2D(t*0.01, 0) * s*0.015,
            //   simplex.noise2D(t*0.01 + 1.5, 0) * s*0.01,
            //   simplex.noise2D(t*0.005 + 3.5, 0) * s*0.03
            // );
            // let turbulenceRot = new THREE.Quaternion();
            // turbulenceRot.setFromUnitVectors(planeDirection, turbulenceVforRot);
            // planeGroup.quaternion.slerp(turbulenceRot, 0.0035);

            planeGroup.position.add( turbulenceVforPos );

            // planeGroup.rotation.x += t * 0.008;
            // planeGroup.rotation.y += t * 0.003;

            helice.rotation.z   += 0.87;

            planeGroup.getWorldDirection( planeDirection );

        }

        // ---------------------------------------------------------
        // TODO: REMPLACER LES TRAJECTOIRES DES PARTICULES PAR DES VECTEURS (en fonction de l'orientation de l'avion)
        // ---------------------------------------------------------

        smokeEmitter.copy(planeDirection);
        smokeEmitter.multiplyScalar(-s*0.14);
        smokeEmitter.add(planeGroup.position);

        if (smokeParticles != null && skyParticles != null)
        {
          let particlesDirection = new THREE.Vector3();
          particlesDirection.copy(planeDirection);
          particlesDirection.multiplyScalar(-s*0.03);

          // Smoke Particles ----------------------------

          for (let i = 0; i < smokeParticleCount; i++) {
            if (smokeParticles.vertices[i].distanceTo(planeGroup.position) < s) {
              smokeParticles.vertices[i].add(particlesDirection);
              // TODO: Prevoir durée de vie de la particule avec baisse de l'opacité (cf. https://stackoverflow.com/questions/12337660/three-js-adjusting-opacity-of-individual-particles)
              // ---- Gérer la réaparition de la particule en fonction de sa durée de "vie" et non en fonction de sa distance de l'avion
              smokeParticles.vertices[i].x += simplex.noise2D(t*0.05 + i*0.17, 0)* s*0.005;
              smokeParticles.vertices[i].y += simplex.noise2D(t*0.05 + i*0.26, 0)* s*0.005;
              smokeParticles.vertices[i].z += simplex.noise2D(t*0.05 + i*0.29, 0)* s*0.005;
            } else {
              // smokeParticles.vertices[i] = smokeEmitter;    // >>>> SEEMS TO DO SOMETHING ELSE THAN EXPECTED (unexpected iteration?)
              smokeParticles.vertices[i].x = smokeEmitter.x + Math.random()*4-2;
              smokeParticles.vertices[i].y = smokeEmitter.y + Math.random()*4-2;
              smokeParticles.vertices[i].z = smokeEmitter.z + Math.random()*4-2;
            }
          }
          smokeParticles.verticesNeedUpdate  = true;

          // Sky Particles ----------------------------
          for (let i = 0; i < skyParticleCount; i++) {
            if (skyParticles.vertices[i].distanceTo(planeGroup.position) < s) {
              skyParticles.vertices[i].add(particlesDirection);
              skyParticles.vertices[i].alpha -= 0.01;
            } else {
              skyParticles.vertices[i].x = -particlesDirection.x*20 + Math.random() * s - s*0.5;
              skyParticles.vertices[i].y = -particlesDirection.y*20 + Math.random() * s - s*0.5;
              skyParticles.vertices[i].z = -particlesDirection.z*20 + Math.random() * s - s*0.5;
            }
          }
          skyParticles.verticesNeedUpdate  = true;
        }
        // if (smokeParticles != null) {
        //   for (let i = 0; i < smokeParticleCount; i++) {
        //     if (smokeParticles.vertices[i].x > -s) {
        //       smokeParticles.vertices[i].x -= 20 + Math.random() * 20;
        //       smokeParticles.vertices[i].y += simplex.noise2D(t*0.05 + i*0.26, 0)*3;
        //       smokeParticles.vertices[i].z += simplex.noise2D(t*0.05 + i*0.29, 0)*3;
        //     } else {
        //       smokeParticles.vertices[i].x = planeGroup.position.x-50;
        //       smokeParticles.vertices[i].y = planeGroup.position.y;
        //       smokeParticles.vertices[i].z = planeGroup.position.z;
        //     }
        //   }
        //   smokeParticles.verticesNeedUpdate  = true;
        // }

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
