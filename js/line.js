
  var margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  //parse year (overkill..)
  var parse = ("Y%").parse;

  // Set the ranges & axes
  var x = d3.scale.linear().range([0, width]),
      y = d3.scale.linear().range([height, 0]),
      xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d")).ticks(5),
      yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

  var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

  d3.csv("data/acnIndex.csv", type, function(error, data) {


    console.log(data);

    var acn = data.filter(function(d) {
      return d.series == "Accenture";
    });


    var sandp = data.filter(function(d) {
      return d.series == "S&P 500";
    });

    var sandpit = data.filter(function(d) {
      return d.series == "S&P 500 IT Sector Index";
    });

// Compute the minimum and maximum date, and the maximum price.
    x.domain([acn[0].date, acn[acn.length - 1].date]);
    y.domain([0, d3.max(acn, function(d) { return d.price; })]).nice();

// Add an SVG element with the desired dimensions and margin.
    var svg = d3.select("#line").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

// Add the x-axis.
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

// Add the y-axis.
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);

    var colors = d3.scale.category10();
    svg.selectAll('.line')
      .data([acn, sandp, sandpit])
      .enter()
      .append('path')
      .attr('class', 'line')
      .style('stroke', function(d) {
        return colors(Math.random() * 50);
      })
      .attr('clip-path', 'url(#clip)')
      .attr('d', function(d) {
        return line(d);
      })

    /* Add 'curtain' rectangle to hide entire graph */
    var curtain = svg.append('rect')
      .attr('x', -1 * width)
      .attr('y', -1 * height)
      .attr('height', height)
      .attr('width', width)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180)')
      .style('fill', '#eee');

    /* Create a shared transition for anything we're animating */
    var t = svg.transition()
      .delay(750)
      .duration(4000)
      .ease('linear')
      .each('end', function() {
        d3.select('line.guide')
          .transition()
          .style('opacity', 0)
          .remove()
      });

    t.select('rect.curtain')
      .attr('width', 0);
    t.select('line.guide')
      .attr('transform', 'translate(' + width + ', 0)')


  });

  // Parse dates and numbers. We assume values are sorted by date.
  function type(d) {
    d.date = +d.date;
    d.price = +d.price;
    return d;
  }

