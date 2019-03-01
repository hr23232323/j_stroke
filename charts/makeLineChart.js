function drawVertLine(svg, distance, width, height, color, opa) {
    svg.append("line")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("x1", d3.scaleLinear().domain([0, 60]).range([50, width + 50])(distance))
        .attr("y1", 10)
        .attr("x2", d3.scaleLinear().domain([0, 60]).range([50, width + 50])(distance))
        .attr("y2", height - 50)
        .style("opacity", opa)
        .style("stroke-dasharray", [5, 5])
        .attr("id", "d-" + distance)
        .attr("class", "temp")
}

function makeLineChart(svg, data, WIDTH, HEIGHT) {
    svg.selectAll("*").remove();
    var chartHeight = HEIGHT - 100
    var nestedDist = getCombinedDist(data);
    margin = {
        left: 20,
        right: 100,
        top: 60,
        bottom: 20

    }

    // Add the g
    svg.attr("height", HEIGHT - margin.top - margin.bottom)
        .attr("width", WIDTH - margin.left - margin.right)
        .attr('transform', 'translate(' + margin.left + ', ' +
            margin.top + ')')
        .append("g").attr("id", "lineDots");

    // Since we need to iterate over the attempts and distances to get the d[i-1] element we can use .data(data)
    // The below creates an array of [attempts, distance] that we then iterate through and draw a line
    var attempts = [];
    var lineData = [];
    nestedDist.forEach(function (d) {
        lineData.push([d.value.attempts, d.key[0]]);
        attempts.push(d.value.attempts);
    })

    lineData = lineData.sort(function (a, b) {
        return a[1] - b[1];
    });

    var totalShots = attempts.reduce(add);

    var index;
    for (index = 0; index < lineData.length; index++) {
        svg.select("#lineDots")
            .append("line")
            .attr("x1", function () {
                if (index == 0) {
                    return d3.scaleLinear().domain([0, 60]).range([50, WIDTH + 50])(0);
                } else {
                    return d3.scaleLinear().domain([0, 60]).range([50, WIDTH + 50])(lineData[index - 1][1]);
                }
            })
            .attr("y1", function () {
                if (index == 0) {
                    return chartHeight;
                } else {
                    return d3.scaleLinear().domain([0, .25]).range([chartHeight, 10])((lineData[index - 1][0]) / totalShots);
                }
            })
            .attr("x2", function () {
                return d3.scaleLinear().domain([0, 60]).range([50, WIDTH + 50])(lineData[index][1]);
            })
            .attr("y2", function () {
                return d3.scaleLinear().domain([0, .25]).range([chartHeight, 10])((lineData[index][0] / totalShots));
            })
            .attr("stroke", "steelBlue")
            .attr("stroke-width", 2);
    }

    // draw the axes

    //Y
    svg.append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x1", 50)
        .attr("y1", 10)
        .attr("x2", 50)
        .attr("y2", chartHeight);
    //X
    svg.append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x1", 50)
        .attr("y1", chartHeight)
        .attr("x2", 50)
        .attr("y2", chartHeight);


    //Y Ticks
    var scale = d3.scaleLinear().domain([0, .25]).range([10, chartHeight]);
    var i;
    for (i = 0; i < .3; i = i + .05) {
        svg.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("x1", 45)
            .attr("y1", scale(i))
            .attr("x2", 50)
            .attr("y2", scale(i));
        svg.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", 50)
            .attr("y1", scale(i))
            .attr("x2", WIDTH + 50)
            .attr("y2", scale(i))
            .attr("opacity", .5);

        svg.append("text")
            .text(i.toFixed(2).toString())
            .attr("x", 20)
            .attr("y", chartHeight + 10 - scale(i))
            .attr("font-size", "14px");
    }

    // X Ticks
    var scale2 = d3.scaleLinear().domain([0, 60]).range([50, WIDTH + 50]);
    for (i = 0; i < 60; i = i + 10) {
        svg.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("x1", scale2(i))
            .attr("y1", chartHeight)
            .attr("x2", scale2(i))
            .attr("y2", chartHeight);
        svg.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", scale2(i))
            .attr("y1", chartHeight)
            .attr("x2", scale2(i))
            .attr("y2", 0)
            .attr("opacity", .5);

        svg.append("text")
            .text(function (d) {
                return i + " ft."
            })
            .attr("x", scale2(i))
            .attr("y", chartHeight + 20)
            .attr("font-size", "14px");

    }
    var lh = HEIGHT / 2;
    var lw = 15
    svg.append("text")
        .text("Frequency %")
        .attr("transform", "rotate(270 " + lw + " " + lh + ")")
        .attr("x", lw)
        .attr("y", lh)
        .attr("font-size", "12px");

    // 3PT Line
    svg.append("line")
        .attr("stroke", "#333333")
        .attr("stroke-width", 2)
        .attr("x1", d3.scaleLinear().domain([0, 60]).range([50, WIDTH + 50])(23))
        .attr("y1", 10)
        .attr("x2", d3.scaleLinear().domain([0, 60]).range([50, WIDTH + 50])(23))
        .attr("y2", chartHeight)
        .style("opacity", .1)
        .style("stroke-dasharray", [5, 5])

    svg.append("text")
        .text("(3pt Line)")
        .attr("x", d3.scaleLinear().domain([0, 60]).range([50, WIDTH + 50])(23) + 5)
        .attr("y", 120)
        .attr("font-size", "12px")
        .style("font-color", "#333333")
        .style("opacity", .3)

    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .attr("class", "overlay")
        .attr("height", HEIGHT - margin.top - margin.bottom)
        .attr("width", WIDTH - margin.left - margin.right)
        .on("mouseover", function (e) {})
        .on("mouseout", function (e) {
            d3.select("#temp").remove();

            d3.selectAll(".temp").remove();
            d3.selectAll(".curve-path").attrs({
                stroke: 'steelBlue',
                'stroke-width': 0.5,
                fill: 'none',
                opacity: 0.2
            })
        })
        .on("mousemove", mousemove);

    function mousemove() {
        d3.select("#temp").remove();
        d3.selectAll(".temp").remove();
        d3.selectAll(".curve-path").attrs({
            stroke: 'steelBlue',
            'stroke-width': 0.5,
            fill: 'none',
            opacity: 0.2
        })
        var scale2 = d3.scaleLinear().domain([50, WIDTH + 50]).range([0, 60]);
        var x = d3.event.pageX - document.getElementById("lineSVG").getBoundingClientRect().x

        var dist = Math.ceil(scale2(x))
        hoverChanges_line(dist, "on")

    }
}
