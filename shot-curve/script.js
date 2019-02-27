function makeShortChart(x, y) {
    d3.csv("James-Harden.csv", function (error, data) {
        if (error) throw error;
        var width = document.getElementById('viz').offsetWidth;
        var height = document.getElementById('viz').offsetHeight;
        var margin = {
            top: 20,
            right: 0,
            bottom: 0,
            left: 30
        }

        var div = d3.select("#viz")
        var svg = div
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        function getPoint(x) {
            return (-1 * Math.pow(x, 2))
        }
        //data = data.slice(0, 4000)
        data.forEach(function (d, i) {
            var rand = Math.random()
            d.SHOT_DISTANCE = +d.SHOT_DISTANCE;
            d.SHOT_MADE_FLAG = +d.SHOT_MADE_FLAG;

            if (d.SHOT_DISTANCE > 23) {
                // 3 point
                x1 = 0 - (d.SHOT_DISTANCE - 23)

            } else {
                //2 point
                x1 = 0 + ((23 - d.SHOT_DISTANCE) / 1.5)
            }

            x1 -= rand

            y1 = 0;

            if (x1 < 0) {
                // 3 point
                x2 = randomNumber(12, 20)
                y2 = randomNumber(85, 92)

            } else if (x1 < 5) {
                // Long 2
                x2 = randomNumber(16, 22)
                y2 = randomNumber(80, 85)
            } else if (x1 < 10) {
                // V short shot
                x2 = randomNumber(18, 23)
                y2 = randomNumber(75, 85)
            } else {
                // layup
                x2 = randomNumber(20, 23)
                y2 = randomNumber(75, 80)
            }

            x3 = 25
            y3 = 69
            var curve = []
            curve.push({
                x: x1,
                y: y1
            }, {
                x: x2,
                y: y2
            }, {
                x: x3,
                y: y3
            })

            redraw(svg, curve, width, height, margin, d.SHOT_MADE_FLAG);
        })
    })
}

function redraw(svg, curve, width, height, margin, made) {
    var interpolation = "d3.curveMonotoneX";
    var graphGroup = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' +
            margin.top + ')');

    var xScale = d3.scaleLinear()
        .domain([-15, 25])
        .range([0, width - margin.right - margin.left]);
    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.top - margin.bottom, 0]);

    graphGroup.selectAll('path').remove();

    var line = d3.line()
        .x(function (d) {
            return xScale(d.x);
        })
        .y(function (d) {
            return yScale(d.y);
        });
    line.curve(eval(interpolation));

    graphGroup.append('path')
        .datum(curve)
        .attrs({
            d: line,
            stroke: 'steelBlue',
            'stroke-width': 0.1,
            fill: 'none',
            opacity: 0.1
        });
}

function randomNumber(min, max) {
    var highlightedNumber = Math.random() * (max - min) + min;

    return highlightedNumber;
};

makeShortChart()
