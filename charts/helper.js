// Have to check for negative numbers
function getRelativeX(oldX, n) {
    var x = 0;
    if (oldX < 0) {
        //-8 -9 -10 -11 -12 -13 -14 -15 -16

        if (oldX % n < -1 * Math.floor(n / 2)) {
            x = oldX - (n + oldX % n);
        } else {
            x = oldX - oldX % n;
        }
        return x;
    }
    if (oldX % n > Math.floor(n / 2)) {
        x = oldX + n - oldX % n;
    } else {
        x = oldX - (oldX % n);
    }
    return x;

}

function getRelativeY(oldY, n) {
    var y = 0;
    if (oldY < 0) {
        //-103 + 5 - -3
        if (oldY % n < -1 * Math.floor(n / 2)) {
            y = oldY - (n + oldY % n);
        } else {
            y = oldY - oldY % n;
        }
        return y;
    }
    if (oldY % n > Math.floor(n / 2)) {
        y = oldY + n - oldY % n;
    } else {
        y = oldY - (oldY % n);
    }
    return y;

}

function getCombinedPos(data, n) {
    var nestedData = d3.nest()
        .key(function (d) {
            var x = getRelativeX(d.x, n);
            var y = getRelativeY(d.y, n);
            return [x, y];
        })
        .rollup(function (v) {
            //console.log(data)
            return {
                "made": d3.sum(v, function (d) {
                    return d.SHOT_MADE_FLAG;
                }),
                "attempts": v.length,
                "distance": d3.sum(v, function (d) {
                    return d.SHOT_DISTANCE;
                }),
                "shootingPercentage": d3.sum(v, function (d) {
                    return d.SHOT_MADE_FLAG;
                }) / v.length
            }
        })
        .entries(data);
    // change to use a string split and force cast to int
    nestedData.forEach(function (a) {
        a.key = JSON.parse("[" + a.key + "]");
    });

    return nestedData;
};

function add(accumulator, a) {
    return accumulator + a;
}

function getCombinedDist(data, n) {
    var nestedData = d3.nest()
        .key(function (d) {
            return d.distance;
        })
        .rollup(function (v) {
            return {
                "made": d3.sum(v, function (d) {
                    return d.SHOT_MADE_FLAG;
                }),
                "attempts": v.length,
                "shootingPercentage": d3.sum(v, function (d) {
                    return d.SHOT_MADE_FLAG;
                }) / v.length
            }
        })
        .entries(data);
    // change to use a string split and force cast to int
    nestedData.forEach(function (a) {
        a.key = JSON.parse("[" + a.key + "]");
    });

    return nestedData;
};
