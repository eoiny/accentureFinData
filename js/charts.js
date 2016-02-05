//setup margin
var margin = {top:40, right:100, left:40, bottom:40},
  width = 760 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var	parseDate = d3.time.format("%Y").parse;

var color = d3.scale.ordinal()
  .range(["steelblue","green","orange"]);

//set ranges & axes for barchart, linechart
var x = d3.time.scale().range([0, width]),
    xBar = d3.scale.ordinal().rangeRoundBands([0, width], .1),
    y = d3.scale.linear().range([height, 0]),
    xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5),
    xBarAxis = d3.svg.axis().scale(xBar).orient("bottom").tickFormat(d3.time.format("%Y")),
    yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

//func. to build linechart
function line(){

  var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

  //async call for csv
  d3.csv("data/acnIndex.csv", type, function(error, data) {
    //setup line series
    var acn = data.filter(function(d) {
      return d.series == "Accenture";
    });

    var sandp = data.filter(function(d) {
      return d.series == "S&P 500";
    });

    var sandpit = data.filter(function(d) {
      return d.series == "S&P 500 IT Sector Index";
    });

    //calculate max values for x & y axes
    x.domain([acn[0].date, acn[acn.length - 1].date]);
    y.domain([0, d3.max(acn, function(d) { return d.price; })]).nice();

    //append SVG to div & setup inside margin
    var svg = d3.select("#line").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //call x-axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .style("opacity", "0.7")
      .style("font-size", "10px")
      .call(xAxis);

    //call y-axis
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .style("opacity", "0.7")
      .style("font-size", "10px")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Cumulative ($)");


    //draw a line for each series
    svg.selectAll('.line')
      .data([acn, sandp, sandpit])
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', function(d) {
        return line(d);
      })
      .style("stroke", function (d,i) { return color(i); })
      .style("stroke-width", "4px");

    svg.append('text')
      .attr('class', 'info')
      .attr('transform', 'translate(' + (width+3) + ',' + y(acn[acn.length-1].price) + ')')
      .attr('dy', '.30em')
      .attr('text-anchor', 'start')
      .style('fill', 'steelblue')
      .style('font-size', '20px')
      .style('opacity', 0)
      .text('ACN: $'+acn[acn.length-1].price);

    svg.append('text')
      .attr('class', 'info')
      .attr('transform', 'translate(' + (width+3) + ',' + y(sandp[sandp.length-1].price) + ')')
      .attr('dy', '.30em')
      .attr('text-anchor', 'start')
      .style('fill', 'green')
      .style('font-size', '20px')
      .style('opacity', 0)
      .text('S&P 500: $'+sandp[sandp.length-1].price);

    svg.append('text')
      .attr('class', 'info')
      .attr('transform', 'translate(' + (width+3) + ',' + y(sandpit[sandpit.length-1].price) + ')')
      .attr('dy', '.30em')
      .attr('text-anchor', 'start')
      .style('fill', 'orange')
      .style('font-size', '20px')
      .style('opacity', 0)
      .text('S&P 500 IT: $'+sandpit[sandpit.length-1].price);

    /* Add 'curtain' rectangle to hide entire graph */
    var curtain = svg.append('rect')
      .attr('x', -1 * width)
      .attr('y', -1 * (height-1))
      .attr('height', height)
      .attr('width', width)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180)')
      .style('fill', '#fff');



    /* Create a shared transition for anything we're animating */
    var t1 = svg.transition()
      .delay(750)
      .duration(3000)
      .ease('linear');

    var t2 = svg.transition()
      .delay(3500)
      .duration(600)
      .ease('linear');

    t1.select('rect.curtain')
      .attr('width', 0);
    t2.selectAll('.info')
      .style('font-size', '12px')
      .style('opacity', 1);

  });

  // Parse dates and numbers. We assume values are sorted by date.
  function type(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
    return d;
  }
}


function bar() {
  var svg = d3.select("#bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.csv("data/bar.csv", btype, function(error, data) {
    if (error) throw error;

    xBar.domain(data.map(function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.revenue; })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .style("opacity", "0.7")
      .style("font-size", "10px")
      .call(xBarAxis);

    svg.append("g")
      .attr("class", "y axis")
      .style("opacity", "0.7")
      .style("font-size", "10px")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("$billion");

    var bar = svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xBar(d.year); })
      .attr("width", xBar.rangeBand())
      .attr("y", function(d) { return y(d.revenue); })
      .attr("height", function(d) { return height - y(d.revenue); })
      .on("mouseover", function(d) {
          div.transition()
          .duration(200)
          .style("opacity", 0.9);

        div.html("$"+d.revenue+" billion<br>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 50) + "px");
      })
      .on("mouseout", function(d) {
          div.transition()
          .duration(500)
          .style("opacity", 0);
      });
  });

  function btype(d) {
    d.year = parseDate(d.year);
    d.revenue = +d.revenue;
    return d;
  }

}

function country() {
  var projection = d3.geo.mercator()
    .center([0,0])
    .scale(100)
    .rotate([0,0]);

  var svg = d3.select("#country").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + -(margin.left+55) + "," + margin.top + ")");

  var path = d3.geo.path()
    .projection(projection);

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.json("data/world10_simple.json", function(error, world) {
    var countries = topojson.feature(world, world.objects.countries).features;

    d3.csv("data/acnISOcountries.csv", function(stats) {
      data = {};
      stats.forEach(function(d) {
        data[d.code] = d.code;
     });
      //console.log(data)

      svg.selectAll(".country")
        .data(countries)
        .enter().insert("path", ".graticule")
        .attr("class","country")
        .attr("d", path)
        .style("fill",function(d){
          var value = data[d.id];
          if (isNaN(value)){
            return "lightgrey";
          }
          return "steelblue";
        })
        .on("mouseover", function(d) {
          d3.select(this)
            .transition()
            //.style("stroke-width",.7)
            .style("fill", "brown");

          div.transition()
            .duration(200)
            .style("opacity", 0.9);

          div.html(d.properties.name+"<br>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .transition()
            .style("fill",function(d){
              var value = data[d.id];
              if (isNaN(value)){
                return "lightgrey";
              }
              return "steelblue";
            })
            .style("stroke", "white");
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
    });
  });
}

function tree() {

  var data1 = {
    "name": "items",
    "children"
      :
      [
        {
          "id": "1",
          "revenue": 16203915,
          "color": "fff",
          "name": "Consulting"
        },
        {
          "id": "2",
          "revenue": 14844016,
          "color": "#fff",
          "name": "Outsourcing"
        }
      ]
  };

  var data2 = {
    "name": "items",
    "children"
      :
      [
        {
          "id": "1",
          "revenue": 14209387,
          "color": "#008080",
          "name": "North America"
        },
        {
          "id": "2",
          "revenue": 14844016,
          "color": "#fff",
          "name": "Europe"
        },
        {
          "id": "3",
          "revenue": 5950595,
          "color": "#fff",
          "name": "Growth markets"
        }
      ]
  };

  var data3 = {
    "name": "items",
    "children"
      :
      [
        {
          "id": "1",
          "revenue": 6349372,
          "color": "#fff",
          "name": "Communication, Media & Technology"
        },
        {
          "id": "2",
          "revenue": 6634771,
          "color": "#fff",
          "name": "Financial Services"
        },
        {
          "id": "3",
          "revenue": 5462550,
          "color": "#fff",
          "name": "Health & Public Services"
        },
        {
          "id": "4",
          "revenue": 7596051,
          "color": "#fff",
          "name": "Products"
        },
        {
          "id": "5",
          "revenue": 4988627,
          "color": "#fff",
          "name": "Resources"
        },
        {
          "id": "6",
          "revenue": 16560,
          "color": "#fff",
          "name": "Other"
        }
      ]
  };

  var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(false)
    //.sort(function(a,b) { return a.revenue - b.revenue; })
    //.round(true)
    .padding(2)
    .value(function(d) { return d.revenue; });

  var format = d3.format("$,");

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  div = d3.select("#treemap").append("div")
    .attr("class","center-block")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

  //.attr("id", "first");

  var node = div.datum(data1).selectAll(".node")
    .data(treemap.nodes)
    .enter().append("div")
    .attr("class", function(d) { return d.children ? "parent node" : "node"; })
    .call(position)
    //.style("background", function(d) { return d.color ? d.color : "#fff"; })
    //.text(function(d) { return d.children ? "blue" : d.name + "(" + d.revenue + ")"; })
    .text(function(d) { return d.children ? null : d.name +": "+ format(d.revenue); })
    .style("opacity",0);


  node.transition()
    .delay(750)
    .duration(3000)
    .ease('linear')
    .style('opacity', 1);

  //console.log(data1);
  d3.select("#revenue1").on("click", function() {
    var node = div.datum(data1).selectAll(".node")
      .data(treemap.nodes);

    node.enter().append("div")
      .attr("class", "node");

    node.exit().remove();

    node.transition().duration(1500).call(position)
      //.style("background", function(d) { return d.color ? d.color : "#fff"; })
      .attr("text-anchor", "middle")
      .text(function(d) { return d.children ? null : d.name +": "+ format(d.revenue); })

  });

  d3.select("#revenue2").on("click", function() {
    var node = div.datum(data2).selectAll(".node")
      .data(treemap.nodes);
    node.enter().append("div")
      .attr("class", "node");
    node.exit().remove();

    node.transition().duration(1500).call(position)
      //.style("background", function(d) { return d.color ? d.color : "#fff"; })
      .text(function(d) { return d.children ? null : d.name +": "+ format(d.revenue); })

  });

  d3.select("#revenue3").on("click", function() {
    var node = div.datum(data3).selectAll(".node")
      .data(treemap.nodes);
    node.enter().append("div")
      .attr("class", "node");
    node.exit().remove();

    node.transition().duration(1500).call(position)
      //.style("background", function(d) { return d.color ? d.color : "#fff"; })
      .text(function(d) { return d.children ? null : d.name +": "+ format(d.revenue); })

  });

function position() {
  this.style("left", function(d) { return d.x + "px"; })
    .style("top", function(d) { return d.y-12 + "px"; })
    .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
    .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

}


//tree()
//bar()
//country()
//line();