
module.exports = (function () {
    "use strict";
    var shake = {};

    var watchId = null;

    var options = {
        frequency: 1
    };

    var previousAcceleration = {
        x: null,
        y: null,
        z: null
    };

    var shakeCallBack = null;
    var sensitivity = 30;
    var timestamp = null;

    // Start watching the accelerometer for a shake gesture
    shake.startWatch = function (onShake, _sensitivity, onError) {
        if (typeof (onShake) !== "function") {
            return;
        }

        if (typeof (_sensitivity) === "number") {
            sensitivity = _sensitivity;
        }

        shakeCallBack = debounce(onShake);

        watchId = navigator.accelerometer.watchAcceleration(assessCurrentAcceleration, onError, options);
    };

    // Stop watching the accelerometer for a shake gesture
    shake.stopWatch = function () {
        if (watchId !== null) {
            navigator.accelerometer.clearWatch(watchId);
            watchId = null;

            previousAcceleration = {
                x: null,
                y: null,
                z: null
            };
        }
    };

    // Assess the current acceleration parameters to determine a shake
    var assessCurrentAcceleration = function (acceleration) {
        var accelerationChange = {};
        if (previousAcceleration.x !== null) {
            accelerationChange.x = Math.abs(previousAcceleration.x - acceleration.x);
            accelerationChange.y = Math.abs(previousAcceleration.y - acceleration.y);
            accelerationChange.z = Math.abs(previousAcceleration.z - acceleration.z);
        }
        
        previousAcceleration = {
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z
        };
        
        console.log("Acceleration: " +acceleration + " Acceleration Change: " + accelerationChange + " Previous Acceleration: " + previousAcceleration);

        if (accelerationChange.x + accelerationChange.y + accelerationChange.z > sensitivity) {
            // Shake detected
        	timestamp = acceleration.timestamp;
            shakeCallBack();
        }
    };

    // can be used to prevent duplicate shakes within x ms where x is he timeout value
    var debounce = function (onShake) {
        var timeout;
        return function () {
            if (timeout) {
                return;
            }

            timeout = setTimeout(function () {
                clearTimeout(timeout);
                timeout = null;
            }, 50);

            onShake(timestamp);
        };
    };

    return shake;
})();
