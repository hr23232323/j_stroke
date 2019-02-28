function makeBio(svg, player) {
    svg.select("#playerbio")
        .append("text")
        .text(player.name)
        .attr("x", BIOWIDTH / 10)
        .attr("y", BIOHEIGHT / 5)
        .attr("font-size", 18)
        .attr("font-color", "black");
    // Add pos + team
    svg.select("#playerbio")
        .append("text")
        .text(player.pos + ", " + player.team)
        .attr("x", BIOWIDTH / 10)
        .attr("y", BIOHEIGHT * (2 / 5))
        .attr("font-size", 14)
        .attr("font-color", "black");
    // Physical
    svg.select("#playerbio")
        .append("text")
        .text(player.height + "/" + player.weight)
        .attr("x", BIOWIDTH / 10)
        .attr("y", BIOHEIGHT * (3 / 5))
        .attr("font-size", 14)
        .attr("font-color", "black");
    //prior
    svg.select("#playerbio")
        .append("text")
        .text(player.school + "/" + player.country)
        .attr("x", BIOWIDTH / 10)
        .attr("y", BIOHEIGHT * (4 / 5))
        .attr("font-size", 14)
        .attr("font-color", "black");
    //draft
    svg.select("#playerbio")
        .append("text")
        .text(player.draftYear + " Round:" + player.draftRound + " Pick: " + player.draftPick)
        .attr("x", BIOWIDTH / 10)
        .attr("y", BIOHEIGHT * (5 / 5))
        .attr("font-size", 14)
        .attr("font-color", "black");
}
