function makeLineChart(svg, data) {
    var nestedDist = getCombinedDist(data);

    // Add the g
    svg.append("g").attr("id", "lineDots");

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
                    console.log("start");
                    return d3.scaleLinear().domain([0, 60]).range([50, 550])(0);
                } else {
                    console.log("last D = " + lineData[index - 1][1]);
                    return d3.scaleLinear().domain([0, 60]).range([50, 550])(lineData[index - 1][1]);
                }
            })
            .attr("y1", function () {
                if (index == 0) {
                    console.log("start");
                    return 400;
                } else {
                    console.log("last A = " + lineData[index - 1][0]);
                    return d3.scaleLinear().domain([0, .25]).range([400, 10])((lineData[index - 1][0]) / totalShots);
                }
            })
            .attr("x2", function () {
                console.log("curr D = " + lineData[index][1]);
                return d3.scaleLinear().domain([0, 60]).range([50, 550])(lineData[index][1]);
            })
            .attr("y2", function () {
                console.log("curr A = " + lineData[index][0]);
                return d3.scaleLinear().domain([0, .25]).range([400, 10])((lineData[index][0] / totalShots));
            })
            .attr("stroke", "red")
            .attr("stroke-width", 2);
    }
    // draw the circle data points
    svg.select("#lineDots")
        .selectAll("shots")
        .data(nestedDist)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return d3.scaleLinear().domain([0, 60]).range([50, 550])(d.key[0]);
        })
        .attr("cy", function (d) {
            console.log((d.value.attempts / totalShots));
            return d3.scaleLinear().domain([0, .25]).range([400, 10])(d.value.attempts / totalShots);
        })
        .attr("r", 4)
        .attr("fill", "black")
        .on("mouseover", function (d) {
            console.log(d.key[0] + " " + d.value.attempts);
        });

    // draw the axes

    //Y
    svg.append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x1", 50)
        .attr("y1", 10)
        .attr("x2", 50)
        .attr("y2", 400);
    //X
    svg.append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("x1", 50)
        .attr("y1", 400)
        .attr("x2", 50)
        .attr("y2", 400);


    //Y Ticks
    var scale = d3.scaleLinear().domain([0, .25]).range([10, 400]);
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
            .attr("x2", 550)
            .attr("y2", scale(i))
            .attr("opacity", .5);

        svg.append("text")
            .text(i.toFixed(2).toString())
            .attr("x", 10)
            .attr("y", 410 - scale(i))
            .attr("font-size", "14px");
    }

    // 3PT Line
    svg.append("line")
        .attr("stroke", "#333333")
        .attr("stroke-width", 2)
        .attr("x1", d3.scaleLinear().domain([0, 60]).range([50, 550])(23))
        .attr("y1", 10)
        .attr("x2", d3.scaleLinear().domain([0, 60]).range([50, 550])(23))
        .attr("y2", 400)
        .style("opacity", .5)
        .style("stroke-dasharray", [5, 5])
    svg.append("text")
        .text("(3pt Line)")
        .attr("x", d3.scaleLinear().domain([0, 60]).range([50, 550])(23) + 5)
        .attr("y", 120)
        .attr("font-size", "12px")
        .style("font-color", "#333333")
        .style("opacity", .5)
}
