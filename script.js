var WIDTH_1 = document.getElementById('viz-1').offsetWidth;
var HEIGHT_1 = document.getElementById('viz-1').offsetHeight;

var WIDTH_2 = document.getElementById('viz-2').offsetWidth;
var HEIGHT_2 = document.getElementById('viz-2').offsetHeight;

var WIDTH_3 = document.getElementById('viz-3').offsetWidth;
var HEIGHT_3 = document.getElementById('viz-3').offsetHeight;

var margin = {
    top: 20,
    right: 0,
    bottom: 20,
    left: 30
}

var courtSVG = d3.select("#viz-1")
    .append("svg")
    .attr("id", "courtSVG")
    .attr("width", WIDTH_1 - 5)
    .attr("height", HEIGHT_1);
courtSVG.attr('viewBox', "0 0 " + o.courtWidth + " " + o.visibleCourtLength)
    .append('g')
    .attr('class', 'shot-chart-court')

var lineSVG = d3.select('#viz-2')
    .append("svg")
    .attr("id", "lineSVG")
    .attr("width", WIDTH_2)
    .attr("height", HEIGHT_2);


document.getElementById("playerSelect").onchange = function () {
    changePlayer()
};

function changePlayer() {
    var name = document.getElementById("playerSelect");
    player_name = name.value
    makeCharts(player_name)
}

var select = document.getElementById("playerSelect");
var player_name = select.options[select.selectedIndex].value;



var div = d3.select("#viz-3")
var curveSVG = div
    .append('svg')
    .attr('width', WIDTH_3)
    .attr('height', HEIGHT_3);


function makeCharts(player_name) {
    //Make the Court SVG

    // Load the CSV
    d3.csv("./rec/" + player_name + "_shots.csv").then(function (data, error) {
        if (error) {
            throw error;
        }

        // Only do most recent 1000 points
        data = data.slice(data.length - 1000, data.length)
        data.forEach(function (d) {
            // Print out every line in csv to console
            // console.log(d);
            //Store the data
            d.distance = d.SHOT_DISTANCE;
            d.x = d.LOC_X;
            d.y = d.LOC_Y;
            d.made = d.SHOT_MADE_FLAG;
        });
        // Call makeShotChart.js to make the shot chart in this SVG, with data, aggregate coordinates by n
        makeShotChart(courtSVG, data, 1, WIDTH_1, HEIGHT_1);
        // Call makeLineChart.js to make the line chart in this SVG, with data
        makeLineChart(lineSVG, data, WIDTH_2, HEIGHT_2);
        // Call curve shart
        makeCurveChart(curveSVG, data, WIDTH_3, HEIGHT_3);


    });

    d3.csv("./rec/" + player_name + "info.csv").then(function (data, error) {
        if (error) {
            throw error;
        }
        var p_info = {};

        p_info.name = data[0].DISPLAY_FIRST_LAST;
        p_info.pos = data[0].POSITION;
        p_info.num = data[0].JERSEY;
        p_info.team = data[0].TEAM_NAME;
        p_info.city = data[0].TEAM_CITY;

        updateData(p_info);
    });



}


makeCharts(player_name)

// interactivity on hover
function hoverChanges(distance, event) {
    if (event == "on") {
        d3.selectAll(".curve-path")
            .filter(function (e, j) {
                //console.log(e[0].x, distance)
                dist = Math.floor(e[0].x)
                if (dist > 23) {
                    // 3 point
                    x1 = 0 - (dist - 23)

                } else {
                    //2 point
                    x1 = 0 + (23 - dist)
                }
                return (x1 == distance)
            }).attrs({
                stroke: 'red',
                'stroke-width': 1,
                fill: 'none',
                opacity: 1
            })
        drawVertLine(lineSVG, distance, WIDTH_2, HEIGHT_2, "red", 1);

        makeRad(courtSVG, distance)

    } else {
        d3.selectAll(".curve-path")
            .filter(function (e, j) {
                //console.log(e[0].x, distance)
                dist = Math.floor(e[0].x)
                if (dist > 23) {
                    // 3 point
                    x1 = 0 - (dist - 23)

                } else {
                    //2 point
                    x1 = 0 + (23 - dist)
                }
                return (x1 == distance)
            }).attrs({
                stroke: 'steelBlue',
                'stroke-width': 0.5,
                fill: 'none',
                opacity: 0.2
            })
        d3.select("#d-" + distance).remove();

        d3.select("#temp").remove();

    }
}

// interactivity on hover
function hoverChanges_curve(distance, event) {
    if (event == "on") {
        makeRad(courtSVG, distance)
        drawVertLine(lineSVG, distance, WIDTH_2, HEIGHT_2, "red", 1);
        d3.selectAll(".curve-path")
            .filter(function (e, j) {
                //console.log(e[0].x, distance)
                dist = Math.floor(e[0].x)
                if (dist > 23) {
                    // 3 point
                    x1 = 0 - (dist - 23)

                } else {
                    //2 point
                    x1 = 0 + (23 - dist)
                }
                return (x1 == distance)
            }).attrs({
                stroke: 'red',
                'stroke-width': 1,
                fill: 'none',
                opacity: 1
            })

    } else {
        d3.select("#temp").remove();
        d3.select("#d-" + distance).remove();
        d3.selectAll(".curve-path")
            .filter(function (e, j) {
                //console.log(e[0].x, distance)
                dist = Math.floor(e[0].x)
                if (dist > 23) {
                    // 3 point
                    x1 = 0 - (dist - 23)

                } else {
                    //2 point
                    x1 = 0 + (23 - dist)
                }
                return (x1 == distance)
            }).attrs({
                stroke: 'steelBlue',
                'stroke-width': 0.5,
                fill: 'none',
                opacity: 0.2
            })
    }
}

// interactivity on hover
function hoverChanges_line(distance) {
    makeRad(courtSVG, distance)
    d3.selectAll(".curve-path")
        .filter(function (e, j) {
            //console.log(e[0].x, distance)
            dist = Math.floor(e[0].x)
            if (dist > 23) {
                // 3 point
                x1 = 0 - (dist - 23)

            } else {
                //2 point
                x1 = 0 + (23 - dist)
            }
            return (x1 == distance)
        }).attrs({
            stroke: 'red',
            'stroke-width': 1,
            fill: 'none',
            opacity: 1
        })
    drawVertLine(lineSVG, distance, WIDTH_2, HEIGHT_2, "red", 1);

}


function updateData(player) {
    document.getElementById("p-name").innerHTML = player.name
    document.getElementById("p-pos").innerHTML = player.pos
    document.getElementById("p-num").innerHTML = "#" + player.num
    document.getElementById("p-team").innerHTML = player.team
    document.getElementById("p-city").innerHTML = player.city
}
