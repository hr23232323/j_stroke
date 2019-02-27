function scaleShotsX(x, width) {
    var scaleX = d3.scaleLinear().domain([-245, 245]).range([50, 0]);
    return scaleX(x).toFixed(0);
}

function scaleShotsY(y, height) {
    var scaleY = d3.scaleLinear().domain([-50, 325]).range([37.375, 0]);
    return scaleY(y).toFixed(0);
}

function fgScale(percent) {
    var color = d3.scaleLinear().domain([0, .65]).range(["#0000FF", "#FF0000"]);
    return color(percent);
}

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
