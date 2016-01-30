function treemap(){

  var data1 = {
    "name": "items",
    "children"
:
  [
    {
      "id": "1",
      "revenue": 16203915,
      "color": "#ff8080",
      "name": "Consulting"
    },
    {
      "id": "2",
      "revenue": 14844016,
      "color": "#80ff80",
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
          "color": "#800080",
          "name": "Europe"
        },
        {
          "id": "3",
          "revenue": 5950595,
          "color": "#808000",
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
        "color": "#d73027",
        "name": "Communication, Media & Technology"
      },
        {
          "id": "2",
          "revenue": 6634771,
          "color": "#fc8d59",
          "name": "Financial Services"
        },
        {
          "id": "3",
          "revenue": 5462550,
          "color": "#fee090",
          "name": "Health & Public Services"
        },
        {
          "id": "4",
          "revenue": 7596051,
          "color": "#e0f3f8",
          "name": "Products"
        },
        {
          "id": "5",
          "revenue": 4988627,
          "color": "#91bfdb",
          "name": "Resources"
        },
        {
          "id": "6",
          "revenue": 16560,
          "color": "#4575b4",
          "name": "Other"
        }
      ]
  };

  var margin = {top:40, right:10, left:10, bottom:40},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

 /* var dataScale = d3.scale.linear()
    .domain([d3.min(data1, function(d){return d.revenue}),
      d3.max(data1, function(d){return d.revenue})]);

  dataScale.range([0,100]);*/


  var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(false)
    //.sort(function(a,b) { return a.revenue - b.revenue; })
    .round(true)
    .value(function(d) { return d.revenue; });

  var div = d3.select("#treemap").append("div")
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
    .attr("class", "node")
    .call(position)
    .style("background", function(d) { return d.color ? d.color : "#eee"; })
    .text(function(d) { return d.children ? "blue" : d.name + "(" + d.revenue + ")"; });

  console.log(data1);
  d3.select("#revenue1").on("click", function() {
    var node = div.datum(data1).selectAll(".node")
      .data(treemap.nodes);

    node.enter().append("div")
      .attr("class", "node");

    node.exit().remove();

    node.transition().duration(1500).call(position)
      .style("background", function(d) { return d.color ? d.color : "#eee"; })
      .text(function(d) { return d.children ? "blue" : d.name + "(" + d.revenue + ")"; });

  });
  d3.select("#revenue2").on("click", function() {
    var node = div.datum(data2).selectAll(".node")
      .data(treemap.nodes);
    node.enter().append("div")
      .attr("class", "node");
    node.exit().remove();

    node.transition().duration(1500).call(position)
      .style("background", function(d) { return d.color ? d.color : "#eee"; })
      .text(function(d) { return d.children ? "blue" : d.name + "(" + d.revenue + ")"; });

  });
  d3.select("#revenue3").on("click", function() {
    var node = div.datum(data3).selectAll(".node")
      .data(treemap.nodes);
    node.enter().append("div")
      .attr("class", "node");
    node.exit().remove();

    node.transition().duration(1500).call(position)
      .style("background", function(d) { return d.color ? d.color : "#eee"; })
      .text(function(d) { return d.children ? "blue" : d.name + "(" + d.revenue + ")"; });

  });


}

function position() {
  this.style("left", function(d) { return d.x + "px"; })
    .style("top", function(d) { return d.y + "px"; })
    .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
    .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}


treemap();

