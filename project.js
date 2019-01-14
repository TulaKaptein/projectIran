// Name: Tula Kaptein
// Studentnumber: 11013478

// Set dataset variables
var world = "data/worldFile.json"
var population = "data/population.json"
var nobelPrizes = "data/nobelPrizesByDate.json"
var nobelWinners = "data/nobelPrizeWinners.json"

// Load in the data files
window.onload = function() {
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

  // Preprocess the data for the world graph
  var data = {}
  fillDict(data)
  addData(data)

  // Set the margin for the world graph
  var marginWorld = {top: 10, right: 40, bottom: 10, left:40},
                widthWorld = 1300 - marginWorld.left - marginWorld.right,
                heightWorld = 700 - marginWorld.top - marginWorld.bottom;
  var domainWorld = ["0", "1", "2 to 5", "5 to 10", "10 to 20", "20 to 50", "50 to 100", "100 to 200", "More than 200"]

  // Set the colors and the domain for the world graph
  var colors = ['rgb(247,252,253)','rgb(229,245,249)','rgb(204,236,230)','rgb(153,216,201)','rgb(102,194,164)','rgb(65,174,118)','rgb(35,139,69)','rgb(0,109,44)','rgb(0,68,27)']
  var colorWorld = d3.scaleThreshold()
                .domain([0, 1, 2, 5, 10, 20, 50, 100, 200])
                .range(colors);
  var path = d3.geoPath();

  // Set svg for the world map
  var world = d3.select("body")
                .append("svg")
                .attr("width", widthWorld)
                .attr("height", heightWorld)
                .append("g")
                .attr("class", "map");
  makeWorldLegend(domainWorld, colors);

  // Draw world map
  var projection = d3.geoMercator()
                     .scale(100)
                     .translate( [400,300]);
  var path = d3.geoPath().projection(projection);

  // Add data (amount of Nobel prize winners) to the world map
  countries.features.forEach(function(d) {d.nobelPrizeWinners = data[d.properties.name]})

  // Set tooltip for the world graph
  var tipWorld = d3.tip()
                   .attr('class', 'd3-tip')
                   .offset([0, 70])
                   .html(function(d){
                     return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Nobel prize winners: </strong><span class='details'>" + format(d.nobelPrizeWinners) + "</span>";
                   })
  world.call(tipWorld);

  // Process the data for the donut chart
  dictCategories = makeCategoriesDict()

  for (item in nobelWinners){
    let category = nobelWinners[item].category
    for (item in dictCategories){
      if (dictCategories[item].category == category){
        dictCategories[item].prizes += 1;
      }
    }
  }

  // Set the measurements for the donut chart
  var marginDonut = {top: 10, right: 10, bottom: 10, left: 10},
        widthDonut = 960 - marginDonut.left - marginDonut.right,
        heightDonut = 500 - marginDonut.top - marginDonut.bottom,
        radiusDonut = Math.min(widthDonut, heightDonut)/2;

  // Arc generator
  var arc = d3.arc()
     .innerRadius(100)
     .outerRadius(radiusDonut);

  // Arc label generator
  var arcLabel = d3.arc()
                   .innerRadius(radiusDonut - 50)
                   .outerRadius(radiusDonut - 50)

  // Pie generator
  var pie = d3.pie()
              .value(function(d){
                return d.prizes;
              })
              .sort(null);

  // Set svg for donut chart
  var donutChart = d3.select("body").append("svg")
                     .attr("width", widthDonut)
                     .attr("height", heightDonut)
                     .append("g")
                     .attr("class", "donut")
                     .attr("transform", "translate(" + widthDonut/2 + "," + heightDonut/2 + ")");
  var colorsDonut = ['rgb(118,42,131)','rgb(175,141,195)','rgb(231,212,232)','rgb(217,240,211)','rgb(127,191,123)','rgb(27,120,55)']
  var domainDonut = ["economics", "chemistry", "physics", "peace", "literature", "medicine"]
  var colorDonut = d3.scaleOrdinal(colorsDonut);

  var donutTitle = donutChart.append("text")
                             .attr("class", "graph-title")
                             .attr("x", 0)
                             .attr("y", 0)
                             .attr("text-anchor", "middle")
                             .text("Total")

  var tipDonut = d3.tip()
                   .attr('class', 'd3-tip')
                   .offset([0,70])
                   .html(function(d,i){
                     return "<strong>Category: </strong><span class='details'>" + d.data.category + "<br></span>" + "<strong>Nobel prize winners: </strong><span class='details'>" + d.data.prizes + "</span>";
                   })

  donutChart.call(tipDonut);

  makeDonutLegend(colorsDonut, domainDonut)

  var g = donutChart.selectAll(".arc")
             .data(pie(dictCategories))
             .enter()
             .append("g")
             .attr("class", "arc");

  g.append("path")
   .attr("d", arc)
   .style("fill", function(d,i){ return colorDonut(i)})
   // .transition()
   // .ease(d3.easeLinear)
   // .duration(2000)
   // .attrTween("d", pieTween)

  g.on('mouseover', function(d){
     tipDonut.show(d);

     d3.select(this)
       .style("stroke", "white")
       .style("stroke-width", 3)
       .style("opacity", 0.8)
   })
   .on("mouseout", function(d){
     tipDonut.hide(d);

     d3.select(this)
       .style("stroke", "white")
       .style("stroke-width", 0)
       .style("opacity", 1)
   })

  // g.append("text")
  //  .attr("transform", function(d){ return "translate(" + arcLabel.centroid(d) + ")"})
  //  .attr("dy", ".35em")
  //  .attr("text-anchor", "middle")
  //  .text(function(d,i){ return dictCategories[i].category});

  world.append("g")
       .attr("class", "countries")
       .selectAll("path")
       .data(countries.features)
       .enter().append("path")
       .attr("d", path)
       .style("fill", function(d) { return colorWorld(d.nobelPrizeWinners);})
       .style("opacity", 0.8)
       .style("stroke", "black")
       .style("stroke-width", 0.3)
       .on('mouseover', function(d){
         tipWorld.show(d);

         d3.select(this)
           .style("opacity", 1)
           // .style("stroke", "black")
           .style("stroke-width", 1)
       })
       .on("mouseout", function(d){
         tipWorld.hide(d);

         d3.select(this)
           .style("opacity", 0.8)
           // .style("stroke", "black")
           .style("stroke-width", 0.3)
       })
       .on("click", function(d){
         return clickCountry(d.properties.name, donutChart)
       })

  // world.append("path")
  //       .datum(topojson.mesh(countries.features, function(a, b) { return a.id !== b.id; }))
  //       .attr("class", "names")
  //       .attr("d", path);

 function clickCountry(country, donutChart){
   categoriesDict = makeCategoriesDict()
   console.log(country);
   let counter = 0

   for (item in nobelWinners){
     if (nobelWinners[item].bornCountry == country){
       counter += 1
       let category = nobelWinners[item].category
       for (item in categoriesDict){
         if (categoriesDict[item].category == category){
           categoriesDict[item].prizes += 1;
         }
       }
     }
   }
   console.log(categoriesDict)
   if (counter == 0){
     donutChart.select(".graph-title")
               .text(country + ": no Nobel Prizes")
   }
   else {
     donutChart.select(".graph-title")
               .text(country)
   }

   var g = donutChart.selectAll("path")
                     .data(pie(categoriesDict))
                     .transition()
                     .ease(d3.easeLinear)
                     .duration(2000)
                     .attrTween("d", pieTween);
  console.log(pie(categoriesDict))

  tipDonut.html(function(d,i){
                     return "<strong>Category: </strong><span class='details'>" + d.data.category + "<br></span>" + "<strong>Nobel prize winners: </strong><span class='details'>" + d.data.prizes + "</span>";
                   })
  //
  // donutChart.call(tipDonut);


 }
 function makeCategoriesDict(){
   dict = [{"category": "economics", "prizes": 0}, {"category": "chemistry", "prizes": 0}, {"category": "physics", "prizes": 0}, {"category": "peace", "prizes": 0}, {"category": "literature", "prizes": 0}, {"category": "medicine", "prizes": 0}]
   return dict
 }

 function makeDonutLegend(colors, domain){

   // Make a title
   donutChart.append("text")
        .attr("class", "legendTitle")
        .attr("x", 300)
        .attr("y", -200)
        .text("Categories")

   donutChart.selectAll(".legendPoint")
             .data(colors)
             .enter()
            .append("rect")
            .attr("class", "legendPoint")
            .attr("fill", function(d){
              return d;
            })
            .attr("x", 300)
            .attr("y", function(d, i){
              return -190 + 20*i;
            })
            .attr("height", 18)
            .attr("width", 18)

   donutChart.selectAll(".legendText")
             .data(domain)
             .enter()
             .append("text")
             .attr("class", "legendText")
             .attr("x", 325)
             .attr("y", function(d, i){
               return -190 + 14 + 20*i;
             })
             .text(function(d){
               return d;
             })
 }

 function pieTween(b){
   b.innerRadius = 0;
   var i = d3.interpolate({startAngle:0, endAngle:0}, b);
   return function(t){ return arc(i(t));};
 }
 function fillDict(dict){
   for (country in countries.features){
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
   // Make a title
   world.append("text")
        .attr("class", "legendTitle")
        .attr("x", 800 - 20)
        .attr("y", marginWorld.top + 20)
        .text("Amount of Nobel prize winners")

   // Make the colored rectangles
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
        return marginWorld.top + 30 + 20*i;
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
        return marginWorld.top + 46 + 20*i;
      })
      .text(function(d, i){
        return d;
      })
 }

}
