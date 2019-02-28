function scaleShotsX(x, width) {
    var scaleX = d3.scaleLinear().domain([-250, 250]).range([50, 0]);
    return scaleX(x).toFixed(0);
}

function scaleShotsY(y, height) {
    var scaleY = d3.scaleLinear().domain([-50, 350]).range([37.375, 0]);
    return scaleY(y).toFixed(0);
}

function fgScale(percent) {
    var color = d3.scaleLinear().domain([0, .65]).range(["#0000FF", "#FF0000"]);
    return color(percent);
}

function makeShotChart(svg, data, n, WIDTH, HEIGHT) {
    /*  ==============================================
        || Below is the code to make the shot chart ||
        ==============================================*/

    // Aggregate the data, aggregate data is how many x, y points to cluster together
    var nestedShotPos = getCombinedPos(data, n);

    // Draw the court
    drawCourt(svg.select("g"));

    // Add the shots to the SVG
    svg.select(".shot-chart-court")
        .selectAll("shots")
        .data(nestedShotPos)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return scaleShotsX(d.key[0], WIDTH);
        })
        .attr("cy", function (d) {
            return scaleShotsY(d.key[1], HEIGHT);
        })
        .attr("r", .5)
        .style("fill", function (d) {
            return fgScale(d.value.shootingPercentage);
        })
        .style("opacity", .25)
        .on("mouseover", function (d) {
            console.log(d.value.shootingPercentage)
            console.log(d.value.distance)
        });
}
