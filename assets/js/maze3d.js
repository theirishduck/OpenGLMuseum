(function() {
    var width = window.innerWidth * 0.995;
    var height = window.innerHeight * 0.995;
    var canvasContainer = document.getElementById("canvasContainer");
    var renderer, camera, scene;
    var input, miniMap, CameraHelper;
    var map = [[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1,1,1,1,2],
                [2,2,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,2],
                [2,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2],
                [2,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2],
                [2,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,2,1,1,1,1,2],
                [2,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,2,1,1,1,1,2],
                [2,2,2,2,1,1,2,2,2,2,2,2,2,2,1,1,2,2,2,1,1,2,2],
                [2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,2,2],
                [2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,2],
                [2,"M",1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2],
                [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2],
                [2,1,1,1,1,1,2,2,2,1,1,1,1,"D",1, 1,1,2,1,1,1,1,2],
                [2,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,2,1,1,1,1,2],
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]];
    var running = true;

    function initializeEngine() {
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setSize(width, height);
        renderer.clear();

        scene = new THREE.Scene();
        //scene.fog = new THREE.Fog(0x777777, 25, 1000);

        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

        document.getElementById("canvasContainer").appendChild(renderer.domElement);

        input = new Museum.Input();
        cameraHelper = new Museum.GameHelper.CameraHelper(camera);
    }

    function initializeScene() {
        miniMap = new Museum.Gui.MiniMap(map[0].length, map.length, "canvasContainer");
        miniMap.create();

        var loader = new THREE.TextureLoader();
        var platformWidth = map[0].length * 300;
        var platformHeight = map.length * 300;

        var floorGeometry = new THREE.BoxGeometry(platformWidth, .1, platformHeight);
        var ground = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({
            map: loader.load("assets/images/marmol.jpg"),
        }));

        repeatTexture(ground.material.map, 2);

        ground.position.set(-50, 1, -50);
        scene.add(ground);

        var topMesh = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({
            map: loader.load("assets/images/roof.jpg")
        }));

        repeatTexture(topMesh.material.map, 16);
        //Size of the roof
        topMesh.position.set(-50, 200, -50);
        scene.add(topMesh);

        //Walls size
        var size = {
            x: 100,
            y: 300,
            z: 100
        };

        var position = { 
            x: 0, 
            y: 0, 
            z: 0 
        };

        var mona = {
            x: 50,
            y: 50,
            z: 0
        };

        var wallGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        var wallMaterial = new THREE.MeshPhongMaterial({
            map: loader.load("assets/images/pared.jpg")
        });

        repeatTexture(wallMaterial.map, 2);

        var monaGeometry = new THREE.PlaneGeometry(mona.x, mona.y, mona.z);
        var monaMaterial = new THREE.MeshPhongMaterial({
            map: loader.load("assets/images/mona.jpg")
        });


        // Map generation
        for (var y = 0, ly = map.length; y < ly; y++) {
            for (var x = 0, lx = map[x].length; x < lx; x++) {
                position.x = -platformWidth / 2 + size.x * x;
                position.y = 50;
                position.z = -platformHeight / 2 + size.z * y;

                //Go to another room
                if (x == 0 && y == 0) {
                    cameraHelper.origin.x = position.x;
                    cameraHelper.origin.y = position.y;
                    cameraHelper.origin.z = position.z;
                }

                //Paint the walls
                if (map[y][x] > 1) {
                    var wall3D = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall3D.position.set(position.x, position.y, position.z);
                    scene.add(wall3D);
                }

                //Set camera perspective
                if (map[y][x] === "D") {
                    camera.position.set(position.x, position.y, position.z);
                    cameraHelper.origin.position.x = position.x;
                    cameraHelper.origin.position.y = position.y;
                    cameraHelper.origin.position.z = position.z;
                    cameraHelper.origin.position.mapX = x;
                    cameraHelper.origin.position.mapY = y;
                    cameraHelper.origin.position.mapZ = 0;
                }

                if (map[y][x] === "M") {
                    var mona3D = new THREE.Mesh(monaGeometry, monaMaterial);
                    mona3D.position.set(position.x, position.y, position.z);
                    scene.add(mona3D);
                }

                miniMap.draw(x, y, map[y][x]);
            }
        }

        // Lights
        var directionalLight = new THREE.HemisphereLight(0xBDBDBD, 0x28343A, 1.2);
        directionalLight.position.set(1, 1, 0);
        scene.add(directionalLight);
    }

    function update() {
        if (input.keys.up) {
            moveCamera("up");
        } else if (input.keys.down) {
            moveCamera("down");
        }

        if (input.keys.left) {
            moveCamera("left");
        } else if (input.keys.right) {
            moveCamera("right");
        }

        // Virtual pad
        var params = {
            rotation: 0.05,
            translation: 5
        };

        if (input.joykeys.up) {
            moveCamera("up", params);
        } else if (input.joykeys.down) {
            moveCamera("down", params);
        }

        if (input.joykeys.left) {
            moveCamera("left", params);
        } else if (input.joykeys.right) {
            moveCamera("right", params);
        }
    }

    function draw() {
        renderer.render(scene, camera);
    }

    function moveCamera(direction, delta) {
        var collides = false;
        var position = {
            x: camera.position.x,
            z: camera.position.z
        };
        var rotation = camera.rotation.y;
        var offset = 50;

        var moveParamaters = {
            translation: (typeof delta != "undefined") ? delta.translation : cameraHelper.translation,
            rotation: (typeof delta != "undefined") ? delta.rotation : cameraHelper.rotation
        };

        switch (direction) {
            case "up":
                position.x -= Math.sin(-camera.rotation.y) * -moveParamaters.translation;
                position.z -= Math.cos(-camera.rotation.y) * moveParamaters.translation;
                break;
            case "down":
                position.x -= Math.sin(camera.rotation.y) * -moveParamaters.translation;
                position.z += Math.cos(camera.rotation.y) * moveParamaters.translation;
                break;
            case "left":
                rotation += moveParamaters.rotation;
                break;
            case "right":
                rotation -= moveParamaters.rotation;
                break;
        }

        // Current position on the map
        var tx = Math.abs(Math.floor(((cameraHelper.origin.x + (camera.position.x * -1)) / 100)));
        var ty = Math.abs(Math.floor(((cameraHelper.origin.z + (camera.position.z * -1)) / 100)));

        // next position
        var newTx = Math.abs(Math.floor(((cameraHelper.origin.x + (position.x * -1) + (offset)) / 100)));
        var newTy = Math.abs(Math.floor(((cameraHelper.origin.z + (position.z * -1) + (offset)) / 100)));

        // Stay on the map
        if (newTx >= map[0].length) {
            newTx = map[0].length;
        }
        if (newTx < 0) {
            newTx = 0;
        }
        if (newTy >= map.length) {
            newTy = map.length;
        }
        if (newTy < 0) {
            newTy = 0;
        }

        if (map[newTy][newTx] != 1 && !isNaN(map[newTy][newTx])) {
            collides = true;
        }

        if (collides == false) {
            camera.rotation.y = rotation;
            camera.position.x = position.x;
            camera.position.z = position.z;

            miniMap.update({
                x: newTx,
                y: newTy
            });
        } 
    }

    function mainLoop(time) {
        if (running) {
            update();
            draw();
            window.requestAnimationFrame(mainLoop, renderer.domElement);
        } 
    }

    function repeatTexture(texture, size) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = size;
        texture.repeat.y = size;
        return texture;
    }

    window.onload = function() {
        initializeEngine();
        initializeScene();
        mainLoop();
    };
})();