function random (min, max) {
    return Math.random() * (max - min) + min;
}

// использование Math.round() даст неравномерное распределение!
function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setValue (object, path, value) {
    for (var i = 0, ln = path.length - 1, prop; i < ln; ++i) {
        prop = path[i];

        if (!object.hasOwnProperty(prop)) {
            object[prop] = {};
        }
        
        object = object[prop];
    }

    object[path[ln]] = value;
}

function createSource (startDate, countPoint, path, step) {
    var source = new Array(countPoint);
    path = path.split('.');
    var date = startDate;

    for (var i = 0; i < countPoint; ++i) {
        source[i] = {};
        date = new Date(date.getTime() + randomInt.apply(null, step) *1000);

        setValue(source[i], path, date);
    }

    return source;
}

function addData (source, path, range, changeDirection, step) {
    path = path.split('.');

    var minValue = range[0];
    var maxValue = range[1];

    var value = random(minValue, maxValue);
    var directon = randomInt(0, 1) ? 1 : -1;
    var count = 0;

   for (var i = 0, ln = source.length; i < ln; ++i) {
        value += random.apply(null, step) * directon;

        if (value > maxValue) {
            value = maxValue;
            directon = -1;
            count = randomInt.apply(null, changeDirection);
        }

        if (value < minValue) {
            value = minValue;
            directon = 1;
            count = randomInt.apply(null, changeDirection);
        }

        if (--count <= 0) {
            directon = directon === 1 ? -1 : 1;
            count = randomInt.apply(null, changeDirection);
        }

        setValue(source[i], path, value);
   }

   return source.length;
}
