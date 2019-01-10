// Name: Tula Kaptein
// Studentnumber: 11013478

// Set dataset variables
var world = "worldFile.json"
var population = "population.json"
var nobelPrizes = "nobelPrizesByDate.json"
var nobelWinners = "nobelPrizeWinners.json"

// Load in the data files
window.onload = function() {
  console.log("Yay")
  var requests = [d3.json(world), d3.json(population), d3.json(nobelPrizes), d3.json(nobelWinners)];

  Promise.all(requests).then(function(response) {
      main(response);
  }).catch(function(e){
      throw(e);
  });

};

function main (response){
  var format = d3.format(",");

  // Set variables for the datasets
  var countries = response[0]
  var population = response[1]
  var nobelPrizes = response[2]
  var nobelWinners = response[3]

  var data = {}
  fillDict(data)
  addData(data)

  // Set the margin for the world graph
  var marginWorld = {top: 10, right: 40, bottom: 10, left:40},
                widthWorld = 1300 - marginWorld.left - marginWorld.right,
                heightWorld = 700 - marginWorld.top - marginWorld.bottom;
  var domainWorld = ["Zero Nobel prize winners", "One Nobel prize winner", "2 to 5 Nobel prize winners", "5 to 10 Nobel prize winners", "10 to 20 Nobel prize winners", "20 to 50 Nobel prize winners", "50 to 100 Nobel prize winners", "100 to 200 Nobel prize winners", "More than 200 Nobel prize winners"]

  // Set the colors and the domain for the World map graph
  var colors = ['rgb(247,252,253)','rgb(229,245,249)','rgb(204,236,230)','rgb(153,216,201)','rgb(102,194,164)','rgb(65,174,118)','rgb(35,139,69)','rgb(0,109,44)','rgb(0,68,27)']
  var color = d3.scaleThreshold()
                .domain([0, 1, 2, 5, 10, 20, 50, 100, 200])
                .range(colors);
  var path = d3.geoPath();

  var world = d3.select("body")
                .append("svg")
                .attr("width", widthWorld)
                .attr("height", heightWorld)
                .append("g")
                .attr("class", "map");
  makeWorldLegend(domainWorld, colors);

  var projection = d3.geoMercator()
                     .scale(100)
                     .translate( [400,300]);
  var path = d3.geoPath().projection(projection);

  countries.features.forEach(function(d) {d.nobelPrizeWinners = data[d.properties.name]})

  // Set tooltips
  var tipWorld = d3.tip()
                   .attr('class', 'd3-tip')
                   .offset([0, 70])
                   .html(function(d){
                     return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Nobel prize winners: </strong><span class='details'>" + format(d.nobelPrizeWinners) + "</span>";
                   })
  world.call(tipWorld);

  world.append("g")
       .attr("class", "countries")
       .selectAll("path")
       .data(countries.features)
       .enter().append("path")
       .attr("d", path)
       .style("fill", function(d) { return color(d.nobelPrizeWinners);})
       .style("stroke", "white")
       .style("stroke-width", 1.5)
       .style("opacity", 0.8)
       .style("stroke", "white")
       .style("stroke-width", 0.3)
       .on('mouseover', function(d){
         tipWorld.show(d);

         d3.select(this)
           .style("opacity", 1)
           .style("stroke", "white")
           .style("stroke-width", 3)
       })
       .on("mouseout", function(d){
         tipWorld.hide(d);

         d3.select(this)
           .style("opacity", 0.8)
           .style("stroke", "white")
           .style("stroke-width", 0.3)
       })
       .on("click", function(d){
         console.log(d)
       })

  // world.append("path")
  //       .datum(topojson.mesh(countries.features, function(a, b) { return a.id !== b.id; }))
  //       .attr("class", "names")
  //       .attr("d", path);


 function fillDict(dict){
   for (country in countries.features){
     // console.log(countries.features[country].properties.name)
     let countryCode = countries.features[country].properties.name
     data[countryCode] = ""
   }
 }

 function addData(dict){
   for (country in data){
     counter = 0;
     for (item in nobelWinners){
       let nobelWinnerCountry = nobelWinners[item].bornCountry;
       if (nobelWinnerCountry == country){
         counter += 1;
       }
     }
     dict[country] = counter
   }
 }

 function makeWorldLegend(domain, colors){
   world.selectAll("legendPoint")
      .data(colors)
      .enter()
      .append("rect")
      .attr("class", "legendPoint")
      .attr("fill", function(d){
        return d;
      })
      .attr("x", 800 - 20)
      .attr("y", function(d, i){
        return marginWorld.top + 20*i;
      })
      .attr("height", 18)
      .attr("width", 18)

   // Make the text for the legend
   world.selectAll("legendText")
      .data(domain)
      .enter()
      .append("text")
      .attr("class", "legendText")
      .attr("x", 805)
      .attr("y", function(d,i){
        return marginWorld.top + 16 + 20*i;
      })
      .text(function(d, i){
        return d;
      })
 }

}
