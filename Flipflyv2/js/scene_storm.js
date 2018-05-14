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

    let container, camera, scene, renderer, controls, material, dirLight, hemiLight, ambientLight;
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
    let JSONloader = new THREE.JSONLoader();

      let fuselageWings;
      JSONloader.load( 'assets/planejson/Plane_Propre_8_decimate_Fuselage.json', function afterLoadJsonCallback( geometry, materials ) {
          materials = new THREE.MeshPhongMaterial( { color: 0xafafaf, side: THREE.DoubleSide } );
          // material = materials[ 0 ];
          fuselageWings = new THREE.Mesh( geometry, materials );
          fuselageWings.castShadow = true;
          fuselageWings.receiveShadow = true;
          planeGroup.add( fuselageWings );
      } );
      let perso;
      JSONloader.load( 'assets/planejson/Plane_Propre_8_decimate_Perso.json', function( geometry, materials ) {
          materials = new THREE.MeshLambertMaterial( { color: 0x222222, side: THREE.DoubleSide } );
          // material = materials[ 0 ];
          perso = new THREE.Mesh( geometry, materials );
          perso.castShadow = true;
          perso.receiveShadow = true;
          planeGroup.add( perso );
      } );
      let roues;
      JSONloader.load( 'assets/planejson/Plane_Propre_8_decimate_Roues.json', function( geometry, materials ) {
          materials = new THREE.MeshPhongMaterial( { color: 0x222222, side: THREE.DoubleSide } );
          // material = materials[ 0 ];
          roues = new THREE.Mesh( geometry, materials );
          roues.castShadow = true;
          roues.receiveShadow = true;
          planeGroup.add( roues );
      } );
      let structure;
      JSONloader.load( 'assets/planejson/Plane_Propre_8_decimate_Structure.json', function( geometry, materials ) {
          materials = new THREE.MeshLambertMaterial( { color: 0xafafaf, side: THREE.DoubleSide } );
          // material = materials[ 0 ];
          structure = new THREE.Mesh( geometry, materials );
          structure.castShadow = true;
          structure.receiveShadow = true;
          planeGroup.add( structure );
      } );
      let helice;
      JSONloader.load( 'assets/planejson/Plane_Propre_8_decimate_Helice.json', function( geometry, materials ) {
          materials = new THREE.MeshLambertMaterial( { color: 0x212121, side: THREE.DoubleSide } );
          // material = materials[ 0 ];
          helice = new THREE.Mesh( geometry, materials );
          helice.castShadow = true;
          helice.receiveShadow = true;
          planeGroup.add( helice );

          geometry = new THREE.CircleBufferGeometry( 1.5, 16 );
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
      planeGroup.scale.set(s*0.037, s*0.037, s*0.037);

      scene.add( planeGroup );

    // ADDING THE BACKGROUND SPHERES

    // TODO : Loading management et callback/Promises qui fonctionnent (!!!) pour les textures en fonction de la phase de la journée
    // let time = 'morning';
    // switch(timeOfTheDay[time]) {
    //   case 'morning':
    //     break;
    //   case 'noon':
    //     break;
    //   case 'storm':
    //     break;
    //   case 'sunset':
    //     break;
    //   case 'night':
    //     break;
    // }

    const sphereMeshesCount = 4;

    let sphereMeshes = [];
    let sphereGeometries = [], sphereMaterials = [];
    let indxToSclRatio;

    let textureLoader = new THREE.TextureLoader();
    // morning
    let texturesMorning = [], texturesNoon = [], texturesStorm = [], texturesSunset = [], texturesNight = [];
    let alphaMaps = [];

    // morning
    // for (let i = sphereMeshesCount-1 ; i > 0 ; i--) {
    //   sphereGeometries[i] = new THREE.SphereBufferGeometry( s, 128, 64 );
    //   indxToSclRatio = i*0.33 + 1;
    //   sphereGeometries[i].scale( -indxToSclRatio, indxToSclRatio, indxToSclRatio );
    //   texturesMorning[i] = textureLoader.load( 'assets/img/morning_' + i + '.jpg' );
    //   alphaMaps[i] = textureLoader.load( 'assets/img/alphaMap_' + i + '.png' );
    //   sphereMaterials[i] = new THREE.MeshBasicMaterial({
    //     transparent: true,
    //     // premultipliedAlpha: true,
    //     side: THREE.FrontSide,
    //     opacity: 1,
    //     map: texturesMorning[i],
    //     alphaMap: alphaMaps[i]
    //   });
    //   sphereMaterials[i].depthWrite = false;
    //   sphereMeshes[i] = new THREE.Mesh( sphereGeometries[i], sphereMaterials[i] );
    //   scene.add( sphereMeshes[i] );
    // }

    // noon
    // for (let i = sphereMeshesCount-1 ; i > 0 ; i--) {
    //   sphereGeometries[i] = new THREE.SphereBufferGeometry( s, 128, 64 );
    //   indxToSclRatio = i*0.33 + 1;
    //   sphereGeometries[i].scale( -indxToSclRatio, indxToSclRatio, indxToSclRatio );
    //   texturesNoon[i] = textureLoader.load( 'assets/img/noon_' + i + '.jpg' );
    //   alphaMaps[i] = textureLoader.load( 'assets/img/alphaMap_' + i + '.png' );
    //   sphereMaterials[i] = new THREE.MeshBasicMaterial({
    //     transparent: true,
    //     // premultipliedAlpha: true,
    //     side: THREE.FrontSide,
    //     opacity: 1,
    //     map: texturesNoon[i],
    //     alphaMap: alphaMaps[i]
    //   });
    //   sphereMaterials[i].depthWrite = false;
    //   sphereMeshes[i] = new THREE.Mesh( sphereGeometries[i], sphereMaterials[i] );
    //   scene.add( sphereMeshes[i] );
    // }

    // storm TODO : Exception !! ATTENTION AUX INDEX i   > Modifier pour + clair?
    for (let i = sphereMeshesCount-2 ; i >= 0 ; i--) {
      let y = i;
      if (i == 2) { y = 3; }
      sphereGeometries[i] = new THREE.SphereBufferGeometry( s, 128, 64 );
      indxToSclRatio = i*0.33 + 1;
      sphereGeometries[i].scale( -indxToSclRatio, indxToSclRatio, indxToSclRatio );
      texturesStorm[i] = textureLoader.load( 'assets/img/storm_' + i + '.jpg' );
      alphaMaps[i] = textureLoader.load( 'assets/img/alphaMap_' + y + '.png' );
      sphereMaterials[i] = new THREE.MeshBasicMaterial({
        transparent: true,
        // premultipliedAlpha: true,
        side: THREE.FrontSide,
        opacity: 1,
        map: texturesStorm[i],
        alphaMap: alphaMaps[y]
      });
      sphereMaterials[i].depthWrite = false;
      sphereMeshes[i] = new THREE.Mesh( sphereGeometries[i], sphereMaterials[i] );
      scene.add( sphereMeshes[i] );
    }

    // sunset
    // for (let i = sphereMeshesCount-1 ; i > 0 ; i--) {
    //   sphereGeometries[i] = new THREE.SphereBufferGeometry( s, 128, 64 );
    //   indxToSclRatio = i*0.33 + 1;
    //   sphereGeometries[i].scale( -indxToSclRatio, indxToSclRatio, indxToSclRatio );
    //   texturesSunset[i] = textureLoader.load( 'assets/img/sunset_' + i + '.jpg' );
    //   alphaMaps[i] = textureLoader.load( 'assets/img/alphaMap_' + i + '.png' );
    //   sphereMaterials[i] = new THREE.MeshBasicMaterial({
    //     transparent: true,
    //     // premultipliedAlpha: true,
    //     side: THREE.FrontSide,
    //     opacity: 1,
    //     map: texturesSunset[i],
    //     alphaMap: alphaMaps[i]
    //   });
    //   sphereMaterials[i].depthWrite = false;
    //   sphereMeshes[i] = new THREE.Mesh( sphereGeometries[i], sphereMaterials[i] );
    //   scene.add( sphereMeshes[i] );
    // }

    //night
    // for (let i = sphereMeshesCount-1 ; i > 0 ; i--) {
    //   sphereGeometries[i] = new THREE.SphereBufferGeometry( s, 128, 64 );
    //   indxToSclRatio = i*0.33 + 1;
    //   sphereGeometries[i].scale( -indxToSclRatio, indxToSclRatio, indxToSclRatio );
    //   texturesNight[i] = textureLoader.load( 'assets/img/night_' + i + '.jpg' );
    //   alphaMaps[i] = textureLoader.load( 'assets/img/alphaMap_' + i + '.png' );
    //   sphereMaterials[i] = new THREE.MeshBasicMaterial({
    //     transparent: true,
    //     // premultipliedAlpha: true,
    //     side: THREE.FrontSide,
    //     opacity: 1,
    //     map: texturesNight[i],
    //     alphaMap: alphaMaps[i]
    //   });
    //   sphereMaterials[i].depthWrite = false;
    //   sphereMeshes[i] = new THREE.Mesh( sphereGeometries[i], sphereMaterials[i] );
    //   scene.add( sphereMeshes[i] );
    // }


    // geometry = new THREE.SphereBufferGeometry( 500, 64, 32 );
    // geometry.scale( - 0.25, 0.25, 0.25 );
    // texturesForLayersLandscape = new THREE.TextureLoader().load( 'Nuages.jpg' );
    // // let texturesForLayersLandscape = new THREE.TextureLoader().load( 'Test3Plans_matin.jpg' );
    // texturesForLayersLandscape.magFilter = THREE.LinearFilter;
    // texturesForLayersLandscape.minFilter = THREE.LinearFilter;
    // // let material = new THREE.MeshBasicMaterial( {
    // //       // map: new THREE.TextureLoader().load( 'Test_01.jpg' )
    // //       //color: 0xff00ff,
    // //       map: texturesForLayersLandscape
    // // } );
    // let materialNuages = new THREE.MeshBasicMaterial({
    //   map: texturesForLayersLandscape,
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
    // scene.add( skyParticleSystem );

    // create the plane's smoke particles
    let smokeEmitter = new THREE.Vector3();

    let smokeParticleCount = s*4,
        smokeParticles = new THREE.Geometry(),
        smokeParticlesMaterial = new THREE.PointsMaterial({
          color: 0xFFFFFF,
          transparent: true,
          opacity: 0.12,
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

    // create the RAIN PARTICLES
    let rainParticleCount = s*8,
        rainParticles = new THREE.Geometry(),
        rainParticlesMaterial = new THREE.PointsMaterial({
          color: 0xafafaf,
          size: s*0.006
        });
    // now create the individual skyParticles
    for (let p = 0; p < rainParticleCount; p++) {
      // create a particle with random
      // position values, -250 -> 250
      let pX = Math.random() * s*2 - s,
          pY = Math.random() * s*2 - s,
          pZ = Math.random() * s*2 - s,
          particle = new THREE.Vector3(pX, pY, pZ);
      // add it to the geometry
      rainParticles.vertices.push(particle);
    }
    // create the particle system
    let rainParticleSystem = new THREE.Points(
        rainParticles,
        rainParticlesMaterial);
    // add it to the scene
    scene.add( rainParticleSystem );


    //--------------
    // LIGHTS

    //morning
    ambientLight = new THREE.AmbientLight( 0xffffff, 0.15 );
    hemiLight = new THREE.HemisphereLight( 0x8f5ade, 0x1c2b52, 0.85 );
    dirLight = new THREE.DirectionalLight( 0xf7f1cd, 0.7 );
    dirLight.position.set( -1, 0.2, 1 );
    //noon
    ambientLight = new THREE.AmbientLight( 0xffffff, 0.1 );
    hemiLight = new THREE.HemisphereLight( 0x6bb7f7, 0x426686, 0.8 );
    dirLight = new THREE.DirectionalLight( 0xffffff, 1.1 );
    dirLight.position.set( 0, 1, 0 );
    //storm
    ambientLight = new THREE.AmbientLight( 0xffffff, 0.05 );
    hemiLight = new THREE.HemisphereLight( 0xafafaf, 0x000000, 0.7 );
    dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 ); // DIRECTIONNAL LIGHT CAN BE REMOVED FOR STORM (would be better)
    dirLight.position.set( 0, 1, 0 );
    //sunset
    // ambientLight = new THREE.AmbientLight( 0xffffff, 0.15 );
    // hemiLight = new THREE.HemisphereLight( 0xe2687b, 0x624e99, 0.8 );
    // dirLight = new THREE.DirectionalLight( 0xffc27c, 1 );
    // dirLight.position.set( 1, 0.3, -1 );
    //night
    // ambientLight = new THREE.AmbientLight( 0xffffff, 0.01 );
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

    scene.add( ambientLight );
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
        s = Math.max(window.innerWidth, window.innerHeight) * 0.3;

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

        // Storm Tornado Effect
        if (sphereMeshes[0] != null && sphereMeshes[2] != null) {
          sphereMeshes[0].rotation.y = t* 0.012;
          sphereMeshes[2].rotation.y = -t* 0.008;
        }

        if (fuselageWings != null && helice != null) {

            planeTarget.copy( camToWorldDirection );
            planeTarget.multiplyScalar( -0.75 );

            let d = new THREE.Vector3( );
            d.copy( planeTarget.sub(planeGroup.position) );
            d.multiplyScalar(0.09);

            planeGroup.position.add( d );

            // TODO : Maybe instead of the following (rotate the plane according to the camera's rotation),
            // add a rotation (differents axis for turns) to the the plane according to the difference between its current position and the targeted [position+rotation]
            // and compare it between the current and the targeted, and rotate accordingly.
            // (MAY BE VERY COMPLICATED)

            let planeRotTarget = new THREE.Quaternion;
            planeRotTarget.copy(camera.quaternion);

            // Use this to look either left or right compared to the camera...
            let lookLeft = new THREE.Quaternion;
            let lookRight = new THREE.Quaternion;
            lookLeft.set( 0.4156, 0.4156, 0.5721, -0.5721 ); // Look UP
            lookRight.set( 0.4156, 0.4156, -0.5721, 0.5721 ); // Look DOWN
            lookLeft.normalize();
            lookRight.normalize();
            // ------!!!!!!  USE rounded values (0, 0.5 or -0.5) to have the plane go straight perpendicular to the camera
            // quaternion.set( 0, 0.5, 0, 0.75 ); // Look RIGHT
            // quaternion.set( 0, 0.5, 0, -0.75 ); // Look LEFT
            // quaternion.set( 0.5, 0, 0.75, 0 ); // Look RIGHT , head's down
            // quaternion.set( 0.5, 0, -0.75, 0 ); // Look LEFT , head's down

            planeRotTarget.multiply(lookRight); // Look DOWN
            //TODO : HAVE THE PLANE MAKE A U-TURN WHEN THE CAMERA IS ROTATING IN THE OPPOSITE DIRECTION
            // let rotTransitionTarget = new THREE.Quaternion( 0.5, 0.5, 0, 0 ) ; // Transitionnal rotation to make a U-turn withouth facing to the camera (but instead away from it)
            // if (camera.position.x < 0) {
            //   planeRotTarget.multiply(rotTransitionTarget);
            //   if (rotTransitionTarget) {
            //     planeRotTarget.multiply(lookLeft); // Look UP
            //   }
            // } else {
            //   planeRotTarget.multiply(rotTransitionTarget);
            //   if (rotTransitionTarget) {
            //     planeRotTarget.multiply(lookRight); // Look DOWN
            //   }
            // }

            // planeGroup.quaternion.slerp(planeRotTarget, 0.047);
            planeGroup.quaternion.slerp(planeRotTarget, 0.05);

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

        let particlesDirection = new THREE.Vector3();
        particlesDirection.copy(planeDirection);
        particlesDirection.multiplyScalar(-s*0.03);

        // Smoke Particles ----------------------------
        if (smokeParticles != null) {
          for (let i = 0; i < smokeParticleCount; i++) {
            if (smokeParticles.vertices[i].distanceTo(planeGroup.position) < s) {
              smokeParticles.vertices[i].add(particlesDirection);
              // TODO: Prevoir durée de vie de la particule avec baisse de l'opacité
              // (cf. https://stackoverflow.com/questions/12337660/three-js-adjusting-opacity-of-individual-particles )
              // (cf. https://stemkoski.github.io/Three.js/Particle-Engine.html )
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
        }

        // Sky Particles ----------------------------
        if (skyParticles != null) {
          for (let i = 0; i < skyParticleCount; i++) {
            if (skyParticles.vertices[i].distanceTo(planeGroup.position) < s) {
              skyParticles.vertices[i].add(particlesDirection);
            } else {
              skyParticles.vertices[i].x = -particlesDirection.x*20 + Math.random() * s - s*0.5;
              skyParticles.vertices[i].y = -particlesDirection.y*20 + Math.random() * s - s*0.5;
              skyParticles.vertices[i].z = -particlesDirection.z*20 + Math.random() * s - s*0.5;
            }
          }
          skyParticles.verticesNeedUpdate  = true;
        }

        // Rain Particles ----------------------------
        if (rainParticles != null) {
          let rainParticlesDirection = new THREE.Vector3;
          rainParticlesDirection.copy(particlesDirection);
          rainParticlesDirection.multiplyScalar(0.5);
          rainParticlesDirection.y = -6;
          for (let i = 0; i < rainParticleCount; i++) {
            if (rainParticles.vertices[i].distanceTo(planeGroup.position) < s*2) {
              rainParticles.vertices[i].add(rainParticlesDirection);
            } else {
              rainParticles.vertices[i].x = -particlesDirection.x*20 + Math.random() * s*2 - s;
              rainParticles.vertices[i].y = s -particlesDirection.y*20 + Math.random() * s - s*0.5;
              rainParticles.vertices[i].z = -particlesDirection.z*20 + Math.random() * s*2 - s;
            }
          }
          rainParticles.verticesNeedUpdate  = true;
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
