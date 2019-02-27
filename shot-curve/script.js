function makeShortChart(x, y) {
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

    var numlines = 100;
    for (var i = 0; i < numlines; i++) {
        var rand = Math.random() / 10
        var x, y;

        var curve = d3.range(-9, 1).map(function (d) {

            x = d + (i * rand)
            y = getPoint(d)
            if (d == -9) {
                console.log(x)
            }
            return {
                x: x,
                y: y
            };
        });

        console.log(curve)

        curve.push({
            x: 10,
            y: -27
        })

        redraw(svg, curve, width, height, margin);
    }
}

function redraw(svg, curve, width, height, margin) {
    var interpolation = "d3.curveMonotoneX";
    var graphGroup = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' +
            margin.top + ')');

    var xScale = d3.scaleLinear()
        .domain([-10, 10])
        .range([0, width - margin.right - margin.left]);
    var yScale = d3.scaleLinear()
        .domain(d3.extent(curve, function (d) {
            return d.y;
        }))
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
            stroke: 'steelblue',
            'stroke-width': 1,
            fill: 'none',
            opacity: 0.3
        });
}

makeShortChart()
