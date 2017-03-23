/** @namespace */
var Museum = Museum || {};

Museum.Input = function() {
    this.keys = {
        up: false,
        down: false,
        left: false,
        right: false,
        
    };

    this.keyboardState = {
        current: null,
        last: null
    };

    this.joykeys = {
        up: false,
        down: false,
        left: false,
        right: false,
        upLeft: false,
        upRight: false,
        downLeft: false,
        downRight: false
    };

    this.joykeyState = {
        current: null,
        last: null
    };

    var _this = this;

    // Clavier
    this._onKeyboardDown = function(event) {
        _this._onKeyStateChange(event, true);
    };

    this._onKeyboardUp = function(event) {
        _this._onKeyStateChange(event, false);
    };

    document.addEventListener('keydown', this._onKeyboardDown, false);
    document.addEventListener('keyup', this._onKeyboardUp, false);

    // Joystick virtuel
    this.virtualJoyKeys = document.getElementsByClassName("joykey");

    this._onJoykeyDown = function(event) {
        _this._onJoykeyStateChange(event, true);
    };

    this._onJoykeyUp = function(event) {
        _this._onJoykeyStateChange(event, false);
    };

    for (var i = 0, l = this.virtualJoyKeys.length; i < l; i++) {
        this.virtualJoyKeys[i].addEventListener("mousedown", this._onJoykeyDown, false);
        this.virtualJoyKeys[i].addEventListener("mouseup", this._onJoykeyUp, false);
        this.virtualJoyKeys[i].addEventListener("touchstart", this._onJoykeyDown, false);
        this.virtualJoyKeys[i].addEventListener("touchend", this._onJoykeyUp, false);
    }
};

Museum.Input.prototype.destroy = function() {
    document.removeEventListener('keydown', this._onKeyboardDown, false);
    document.removeEventListener('keyup', this._onKeyboardUp, false);

    for (var i = 0, l = this.virtualJoyKeys.length; i < l; i++) {
        this.virtualJoyKeys[i].removeEventListener("mousedown", this._onJoykeyDown, false);
        this.virtualJoyKeys[i].removeEventListener("mouseup", this._onJoykeyUp, false);
        this.virtualJoyKeys[i].removeEventListener("touchstart", this._onJoykeyDown, false);
        this.virtualJoyKeys[i].removeEventListener("touchend", this._onJoykeyUp, false);
    }
};

Museum.Input.prototype._onKeyStateChange = function(event, pressed) {
    event.preventDefault();

    switch (event.keyCode) {
        case 37:
            this.keys.left = pressed;
            break; // Gauche
        case 38:
            this.keys.up = pressed;
            break; // Haut
        case 39:
            this.keys.right = pressed;
            break; // Droite
        case 40:
            this.keys.down = pressed;
            break; // Bas
    }
};

Museum.Input.prototype._onJoykeyStateChange = function(event, pressed) {
    event.preventDefault();
    var id = event.currentTarget.id;
    switch (id) {
        case "keyup":
            this.joykeys.up = pressed;
            break;
        case "keydown":
            this.joykeys.down = pressed;
            break;
        case "keyleft":
            this.joykeys.left = pressed;
            break;
        case "keyright":
            this.joykeys.right = pressed;
            break;

        case "keyUpLeft":
            this.joykeys.upLeft = pressed;
            break;
        case "keyUpRight":
            this.joykeys.upRight = pressed;
            break;
        case "keyDownLeft":
            this.joykeys.downLeft = pressed;
            break;
        case "keyDownRight":
            this.joykeys.downRight = pressed;
            break;
    }
};

Museum.Input.prototype.pressed = function(key) {
    return this.keys[key];
};