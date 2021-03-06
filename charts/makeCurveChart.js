function makeCurveChart(svg, data, width, height) {

    svg.selectAll("*").remove();
    var xScale = d3.scaleLinear()
        .domain([-5, 25])
        .range([0, width - margin.right - margin.left]);
    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.top - margin.bottom, 0]);

    function getPoint(x) {
        return (-1 * Math.pow(x, 2))
    }
    //data = data.slice(0, 1000)
    data.forEach(function (d, i) {
        var rand = Math.random()
        d.SHOT_DISTANCE = +d.SHOT_DISTANCE;
        d.SHOT_MADE_FLAG = +d.SHOT_MADE_FLAG;

        if (d.SHOT_DISTANCE > 23) {
            // 3 point
            x1 = 0 - (d.SHOT_DISTANCE - 23)

        } else {
            //2 point
            x1 = 0 + (23 - d.SHOT_DISTANCE)
        }

        x1 -= rand

        y1 = 0;

        if (x1 < 0) {
            // 3 point
            x2 = randomNumber(12, 20)
            y2 = randomNumber(85, 98)

        } else if (x1 < 5) {
            // Long 2
            x2 = randomNumber(16, 22)
            y2 = randomNumber(75, 85)
        } else if (x1 < 12) {
            // short shot
            x2 = randomNumber(18, 23)
            y2 = randomNumber(75, 85)
        } else if (x1 < 16) {
            // v short shot
            x2 = randomNumber(20, 24)
            y2 = randomNumber(72, 78)

        } else {
            // layup
            x2 = randomNumber(23, 24)
            y2 = randomNumber(70, 75)
        }

        x3 = randomNumber(24, 25)
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

        redraw(svg, curve, width, height, margin, d.SHOT_MADE_FLAG, xScale, yScale);
    })



    var x_axis = d3.axisBottom()
        .scale(xScale)
        .ticks(30, "f")
        .tickSize(0)
        .tickFormat(function (d) {
            d = -d + 23
            var mapper = {
                23: "~23 ft.",
                14: "~14 ft.",
                4: "4 ft.",
                0: "Under Rim"
            }

            return mapper[d]
        })

    svg.append("g")
        .attr("transform", "translate(0," + (height - 20) + ")")
        .call(x_axis);

}


function redraw(svg, curve, width, height, margin, made, xScale, yScale) {
    var interpolation = "d3.curveMonotoneX";
    var graphGroup = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' +
            margin.top + ')');

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
            class: 'curve-path',
            d: line,
            stroke: 'steelBlue',
            'stroke-width': 0.5,
            fill: 'none',
            opacity: 0.2
        }).on("mouseover", function (d) {
            path = d3.select(this)
            path.attrs({
                stroke: 'red',
                'stroke-width': 1,
                opacity: 1
            })
            dist = Math.floor(d[0].x)
            var x1;
            if (dist > 23) {
                // 3 point
                x1 = 0 - (dist - 23)

            } else {
                //2 point
                x1 = 0 + (23 - dist)
            }
            hoverChanges_curve(x1, "on")
        })
        .on("mouseout", function (d) {
            path = d3.select(this)
            path.attrs({
                stroke: 'steelBlue',
                'stroke-width': 0.5,
                opacity: 0.2
            })

            dist = Math.floor(d[0].x)
            var x1;
            if (dist > 23) {
                // 3 point
                x1 = 0 - (dist - 23)

            } else {
                //2 point
                x1 = 0 + (23 - dist)
            }
            hoverChanges_curve(x1, "off")
        });
}

function randomNumber(min, max) {
    var highlightedNumber = Math.random() * (max - min) + min;

    return highlightedNumber;
};
