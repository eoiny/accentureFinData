var margin = {top:40, right:10, left:10, bottom:40},
  width = 760 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var colourById = d3.map();

var projection = d3.geo.mercator()
  .center([0, 0])
  .scale(100)
  .rotate([0,0]);

var svg = d3.select("#country").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var path = d3.geo.path()
  .projection(projection);

var g = svg.append("g");

/*d3.json("data/world50_simple.json", function(error, topology) {
  g.selectAll("path")
    .data(topojson.object(topology, topology.objects.countries)
      .geometries)
    .enter()
    .append("path")
    .attr("d", path)
});*/






  d3.json("data/world50_simple.json", function(error, world) {
     var countries = topojson.feature(world, world.objects.countries).features;

    d3.csv("data/acnISOcountries.csv", function(stats) {
      data = {};
      stats.forEach(function(d) {
        data[d.code] = d.code;
      });


    console.info(data);


     svg.selectAll(".country")
       .data(countries)
       .enter().insert("path", ".graticule")
       .attr("class","country")
       .classed(".notactive", true)

       //.attr("class", function (d) {
       //  return "country " + "code" + d.id;
       //})
       .attr("d", path)//;
       .style("fill",function(d){
         var value = data[d.id];
         if (isNaN(value)){
           return "lightgrey";
         }
      console.log("WWW")
      return "blue";
       });
    //  .style("fill", function(d) {
   //      console.log(data[22])
      //if (!isNaN(data[d.id]))
   //      if (typeof(data[d.id]) == 'undefined')
  //      return "steelblue";
   //   else
   //     return "#999";
   // });
     //.style("fill", function(d) {
     //  console.log(d.code)
     //if (countriesID[d.id]  === d.code) {return "steelblue"}
     // else    { return "grey" }
      //;})

    /* svg.selectAll(".country")
       .data(data)
       .classed("active", function(d) {
         if (d.code === "089") {return true}
       });*/


  });
  });


/*
function type(d){
  colourById.set(d.id, d.code); };


function type(d) {
  d.year = parseDate(d.year);
  d.revenue = +d.revenue;
  return d;
}
  */