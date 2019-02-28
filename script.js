var WIDTH_1 = document.getElementById('viz-1').offsetWidth;
var HEIGHT_1 = document.getElementById('viz-1').offsetHeight;

var WIDTH_2 = document.getElementById('viz-2').offsetWidth;
var HEIGHT_2 = document.getElementById('viz-2').offsetHeight;

var WIDTH_3 = document.getElementById('viz-3').offsetWidth;
var HEIGHT_3 = document.getElementById('viz-3').offsetHeight;

var WIDTH_B = document.getElementById('sidebar').offsetWidth - 10;
var HEIGHT_B = document.getElementById('sidebar').offsetHeight / 4;

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

var bioSVG = d3.select('#bio')
    .append("svg")
    .attr("id", "bioSVG")
    .attr("width", WIDTH_B)
    .attr("height", HEIGHT_B)


document.getElementById("playerSelect").onchange = function () {
    changePlayer()
};

function changePlayer() {
    var name = document.getElementById("playerSelect");
    console.log(name.value)
    player_name = name.value
    makeCharts(player_name)
    //Send name.value to the update function!
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
    d3.csv("/Resources/" + player_name + "_shots.csv").then(function (data, error) {
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

    d3.csv("/Resources/" + player_name + "info.csv").then(function (data, error) {
        if (error) {
            throw error;
        }
        data.forEach(function (d) {
            //Store the data
            d.name = d.DISPLAY_FIRST_LAST;
            d.pos = d.POSITION;
            d.height = d.HEIGHT;
            d.weight = d.WEIGHT;
            d.school = d.SCHOOL;
            d.draftYear = d.DRAFT_YEAR;
            d.draftRound = d.DRAFT_ROUND;
            d.draftPick = d.DRAFT_NUMBER;
            d.team = d.TEAM_ABBREVIATION;
            d.country = d.COUNTRY;
        });
        bioSVG.append("g").attr("id", "playerbio");
        makeBio(bioSVG, data[0], WIDTH_B, HEIGHT_B);
    });

}


makeCharts(player_name)

// interactivity on hover
function hoverChanges(data, distance, event) {
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
                stroke: 'black',
                'stroke-width': 1,
                fill: 'none',
                opacity: 1
            })
        console.log(lineSVG)
        drawVertLine(lineSVG, distance, WIDTH_2, HEIGHT_2);

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

    }
}
