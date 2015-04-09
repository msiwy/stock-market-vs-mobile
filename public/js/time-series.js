//Setting the size of our canvas
var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// setup x
var xValue = function(d) { return d["base_ex"];}, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d["BMI"];}, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d["rating"];},
        color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// load data
d3.csv("Pokemon.csv", function(error, data) {
    // change string (from CSV) into number format
    data.forEach(function(d) {
        d["identifier"] = d.identifier;
        d["height"] = +(d["height"]/10);
        d["weight"] = +(d["weight"]/10);
        d["BMI"] = (d["weight"])/((d["height"])*(d["height"]));
        d["base_ex"] = +(d["base_experience"]);
        if (d["BMI"] < 18.5) {
            d["rating"] = "Underweight";
        } else if (d["BMI"] >= 18.5 & d["BMI"] < 25) {
            d["rating"] = "Normal weight";
        } else if (d["BMI"] >=25 & d["BMI"] < 30) {
            d["rating"] = "Overweight";
        } else {
            d["rating"] = "Obesity";
        }
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    // x-axis
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Base Experience");

    // y-axis
    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("BMI");

    // draw dots
    svg.selectAll(".dot")
            .data(data)

            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)

            .style("fill", function(d) { return color(cValue(d));})
            .on("mousedown", animateFirstStep)
            .on("mouseover", function(d) {
                tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);

                var output = "Pokemon: " + d["identifier"] + "<br/>Base Experience: " + xValue(d)
                        + "<br/>BMI: " + yValue(d).toFixed(2) + "<br/>Rating: " + d["rating"];
                tooltip.html(output)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
            })

    $(document).ready(function() {

        $('#Search').click(function() {
            var min = $('#min').val();
            var max = $('#max').val();
            if (min == 0) {
                alert("Please enter min value");
            } else if (max == 0) {
                alert("Please enter max value");
            } else if (min < 0 || min > 160) {
                alert("The value has to be between 0 and 160");
            } else if (max < 0 || max > 160) {
                alert("The value has to be between 0 and 160");
            } else if (min >= max) {
                alert("Seriously? min cannot be greater than max");
            } else {
                svg.selectAll(".dot")
                        .filter(function(d) {
                            return (d["BMI"] < min || d["BMI"] > max);
                        })
                        .style("fill", "none")
            }
            return false;
        });
    });
    function animateFirstStep(){
        d3.select(this)
                .transition()
                .delay(0)
                .duration(1000)
                .attr("r", 10)
                .each("end", animateSecondStep);
    };

    function animateSecondStep(){
        d3.select(this)
                .transition()
                .duration(1000)
                .attr("r", 3.5);
    };
});