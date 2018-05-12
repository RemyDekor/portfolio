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

    let camToWorldDirection = new THREE.Vector3( );
    let planeDirection = new THREE.Vector3();
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

    // ADDING THE PLANE MESHES
    // TODO : Use a LoadingManager to load the whole scene, and use loading management to avoid repeating "castshadow = true" etc. for every meshes of the plane

    let planeGroup = new THREE.Group();
    let loader = new THREE.JSONLoader();

    let plane;
    loader.load( 'PlaneJSON/Plane_Propre_7_Fuselage.json', function afterLoadJsonCallback( geometry, materials ) {
        materials = new THREE.MeshPhongMaterial( { color: 0xafafaf, side: THREE.DoubleSide } );
        // material = materials[ 0 ];
        plane = new THREE.Mesh( geometry, materials );
        plane.castShadow = true;
        plane.receiveShadow = true;

        planeGroup.add( plane );
    } );

    let perso;
    loader.load( 'PlaneJSON/Plane_Propre_7_Perso.json', function( geometry, materials ) {
        materials = new THREE.MeshLambertMaterial( { color: 0x222222, side: THREE.DoubleSide } );
        // material = materials[ 0 ];
        perso = new THREE.Mesh( geometry, materials );
        perso.castShadow = true;
        perso.receiveShadow = true;

        planeGroup.add( perso );
    } );

    let roues;
    loader.load( 'PlaneJSON/Plane_Propre_7_Roues.json', function( geometry, materials ) {
        materials = new THREE.MeshPhongMaterial( { color: 0x222222, side: THREE.DoubleSide } );
        // material = materials[ 0 ];
        roues = new THREE.Mesh( geometry, materials );
        roues.castShadow = true;
        roues.receiveShadow = true;

        planeGroup.add( roues );
    } );

    let structure;
    loader.load( 'PlaneJSON/Plane_Propre_7_Structure.json', function( geometry, materials ) {
        materials = new THREE.MeshLambertMaterial( { color: 0xafafaf, side: THREE.DoubleSide } );
        // material = materials[ 0 ];
        structure = new THREE.Mesh( geometry, materials );
        structure.castShadow = true;
        structure.receiveShadow = true;

        planeGroup.add( structure );
    } );

    let helice;
    loader.load( 'PlaneJSON/Plane_Propre_7_Helice.json', function( geometry, materials ) {
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
          transparent: true,
        } );
        material.blending = THREE.CustomBlending;
        material.blendEquation = THREE.ReverseSubtractEquation;
        material.blendSrc = THREE.SrcAlphaFactor; //default
        material.blendDst = THREE.OneFactor; //default
        let circle = new THREE.Mesh( geometry, material );

        circle.position.x = +1.72;
        circle.rotation.y = Math.PI*0.5;

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

    geometry = new THREE.SphereBufferGeometry( s, 128, 64 );
    geometry.scale( - 2, 2, 2 );
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

    geometry = new THREE.SphereBufferGeometry( s, 128, 64 );
    geometry.scale( - 1.60, 1.60, 1.60 );
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


    geometry = new THREE.SphereBufferGeometry( s, 128, 64 );
    geometry.scale( -1.2, 1.2, 1.2 );
    colorsForLayersLandscape = new THREE.TextureLoader().load( 'Test3Plans_v9_matin_1.jpg' );
    material = new THREE.MeshBasicMaterial({
      map: colorsForLayersLandscape,
      transparent: true,
      premultipliedAlpha: true,
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

    let smokeParticleCount = s*3,
        smokeParticles = new THREE.Geometry(),
        smokeParticlesMaterial = new THREE.PointsMaterial({
          color: 0xF5A5F5,
          transparent: true,
          opacity: 0.4,
          size: s*0.03
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

    let ambientLight = new THREE.AmbientLight( 0x8888aa );
    scene.add( ambientLight );

    //

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
    hemiLight.color.setHSL( 0.6, 0.9, 0.6 );
    hemiLight.groundColor.setHSL( 0.48, 0.2, 0.4 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    //

    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    // dirLight.color.setHSL( 0.1, 1, 0.95 );
    // dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.set( 0, s, 0 );

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    dirLight.shadow.camera.left = -s;
    dirLight.shadow.camera.right = s;
    dirLight.shadow.camera.top = s;
    dirLight.shadow.camera.bottom = -s;

    // dirLight.shadow.camera.near = -500;
    // dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = s*2;
    dirLight.shadow.bias = -0.002;
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

        if (plane != null && helice != null) {
            planeTarget.copy( camToWorldDirection );
            planeTarget.multiplyScalar( -0.75 );

            let d = new THREE.Vector3( );
            d.copy( planeTarget.sub(planeGroup.position) );
            d.multiplyScalar(0.08);

            planeGroup.position.add( d );

            let turbulence = new THREE.Vector3(
              // simplex.noise2D(t*0.02, 0) * 0.8,
              // simplex.noise2D(t*0.035 + 1.5, 0) * 1.5,
              // simplex.noise2D(t*0.01 + 3.5, 0) * 0.6
              simplex.noise2D(t*0.02, 0) * s*0.002,
              simplex.noise2D(t*0.035 + 1.5, 0) * s*0.003,
              simplex.noise2D(t*0.01 + 3.5, 0) * s*0.0015
            );

            planeGroup.position.add( turbulence );

            // planeGroup.rotation.x = simplex.noise2D(t*0.01, 0)*0.14;
            // planeGroup.rotation.y = simplex.noise2D(t*0.01 + 1.5, 0)*0.02;
            // planeGroup.rotation.z = simplex.noise2D(t*0.01 + 3.5, 0)*0.08;
              planeGroup.rotation.x = simplex.noise2D(t*0.01, 0) * s*0.000243;
             planeGroup.rotation.y = simplex.noise2D(t*0.01 + 1.5, 0) * s*0.000035;
             planeGroup.rotation.z = simplex.noise2D(t*0.01 + 3.5, 0) * s*0.000139;

            // planeGroup.rotation.x += t * 0.008;
            // planeGroup.rotation.y += t * 0.003;
            helice.rotation.x   += 0.87;

            planeGroup.getWorldDirection( planeDirection );
            planeGroup.rotation.y += -Math.PI*0.5;
        }

        // ---------------------------------------------------------
        // TODO: REMPLACER LES TRAJECTOIRES DES PARTICULES PAR DES VECTEURS (en fonction de l'orientation de l'avion)
        // ---------------------------------------------------------

        smokeEmitter.copy(planeDirection);
        smokeEmitter.multiplyScalar(-s*0.15);
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
