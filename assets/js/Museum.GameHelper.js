var Museum = window.Museum || {};
Museum.GameHelper = Museum.GameHelper || {};

Museum.GameHelper.CameraHelper = function(camera) {
    this.translation = 5;
    this.rotation = 0.035;
    this.origin = {
        position: {
            x: 0,
            y: 0,
            z: 0,
            mapX: 0,
            mapY: 0,
            mapZ: 0
        },
        x: 0,
        y: 0,
        z: 0
    };
    
    this.camera = camera;
};