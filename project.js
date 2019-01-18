// Name: Tula Kaptein
// Studentnumber: 11013478

// Set dataset variables
var world = "data/worldFile.json"
var population = "data/population.json"
var nobelPrizes = "data/nobelPrizesByDate.json"
var nobelWinners = "data/nobelPrizeWinners.json"
var primaryEduc = "data/primaryGross.json"
var secondEduc = "data/secondaryGross.json"
var tertEduc = "data/tertiaryGross.json"

// Load in the data files
window.onload = function() {
  var requests = [d3.json(world), d3.json(population), d3.json(nobelPrizes), d3.json(nobelWinners),
  d3.json(primaryEduc), d3.json(secondEduc), d3.json(tertEduc)];

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
  var primEduc = response[4]
  var secEduc = response[5]
  var tertEduc = response[6]

  // Preprocess the data for the world graph
  var dataWorld = {}
  dataWorld = fillDict(dataWorld)
  dataWorld = addData(dataWorld)

  // Preprocess the data for the updated world graph
  var dataWorldCapita = []
  var dataWorldCapitaDict = {}
  dataWorldCapitaDict = fillDict(dataWorldCapitaDict)
  for (country in dataWorld){
    for (item in population){
      if (country == item){
          dataWorldCapita.push({"country": country, "nobelPrizes per capita": dataWorld[country]/population[item][2017]})
      }
    }
  }
  for (country in dataWorldCapitaDict){
    for (item in dataWorldCapita){
      if (dataWorldCapita[item].country == country){
        dataWorldCapitaDict[country] = dataWorldCapita[item]["nobelPrizes per capita"]
      }
    }
  }
  console.log(dataWorldCapitaDict)

  // Make the buttons
  d3.select("#menu")
    .selectAll("button")
    .data(["Total Nobel Prizes", "Nobel Prizes per Capita"])
    .enter()
    .append("button")
    .attr("class", "button")
    .text(function(d){
      return d;
    })
    .on("click", function(d){
      return updateMap(d);
    })

  // Set the margin for the world graph
  var marginWorld = {top: 40, right: 40, bottom: 10, left:0},
                widthWorld = 800 - marginWorld.left - marginWorld.right,
                heightWorld = 610 - marginWorld.top - marginWorld.bottom;
  var domainWorld = ["0", "1", "2 to 5", "5 to 10", "10 to 20", "20 to 50", "50 to 100", "100 to 200", "More than 200"]

  // Set the colors and the domain for the world graph
  var colorsWorld = ['rgb(128,128,128)','rgb(229,245,249)','rgb(204,236,230)','rgb(153,216,201)','rgb(102,194,164)','rgb(65,174,118)','rgb(35,139,69)','rgb(0,109,44)','rgb(0,68,27)']
  var colorWorld = d3.scaleThreshold()
                .domain([1, 2, 5, 10, 20, 50, 100, 200])
                .range(colorsWorld);
  var path = d3.geoPath();

  var domainWorldCapita = ["0", "0 to 1 in a billion", "1 to 5 in a billion", "5 to 10 in a billion", "10 to 50 in a billion","50 to 100 in a billion", "100 to 500 in a billion"]
  var colorsWorldCapita = ['rgb(128,128,128)','rgb(224,236,244)','rgb(191,211,230)','rgb(158,188,218)','rgb(140,150,198)','rgb(140,107,177)','rgb(136,65,157)','rgb(129,15,124)','rgb(77,0,75)']
  var colorWorldCapita = d3.scaleThreshold()
                      .domain([1e-9, 0.5e-8, 1e-8, 0.5e-7, 1e-7, 0.5e-6, 1e-6, 0.2e-5])
                      .range(colorsWorldCapita)

  // Set svg for the world map
  var world = d3.select("#row1")
                .append("svg")
                .attr("width", widthWorld)
                .attr("height", heightWorld)
                .attr("class", "map")

  makeWorldLegend(domainWorld, colorsWorld);

  // Draw world map
  var projection = d3.geoMercator()
                     .scale(100)
                     .translate( [400,300]);
  var path = d3.geoPath().projection(projection);

  // Add data (amount of Nobel prize winners) to the world map
  countries.features.forEach(function(d) {d.nobelPrizeWinners = dataWorld[d.properties.name]})
  countries.features.forEach(function(d) {d.nobelPrizeCapita = dataWorldCapitaDict[d.properties.name]})

  console.log(countries)

  // Set tooltip for the world graph
  var tipWorld = d3.tip()
                   .attr('class', 'd3-tip')
                   .offset([0, 70])
                   .html(function(d){
                     return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Nobel prize winners: </strong><span class='details'>" + format(d.nobelPrizeWinners) + "</span>";
                   })
  world.call(tipWorld);

  // Process the data for the donut chart
  dictDonut = makeDonutDict()

  for (item in nobelWinners){
    let category = nobelWinners[item].category
    for (item in dictDonut){
      if (dictDonut[item].category == category){
        dictDonut[item].prizes += 1;
      }
    }
  }

  // Set the measurements for the donut chart
  var marginDonut = {top: 10, right: 10, bottom: 10, left: 10},
        widthDonut = 600 - marginDonut.left - marginDonut.right,
        heightDonut = 500 - marginDonut.top - marginDonut.bottom,
        radiusDonut = Math.min(widthDonut, heightDonut)/2 - 50;

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
  var donutChart = d3.select("#row1").append("svg")
                     .attr("width", widthDonut)
                     .attr("height", heightDonut)
                     .attr("id", "donutSVG")
                     .append("g")
                     .attr("class", "donut")
                     .attr("transform", "translate(" + 230 + "," + heightDonut/2 + ")");

  var tooltipDonut = d3.select("body")
                    	.append('div')
                    	.attr('class', 'tooltip');


                    	tooltipDonut.append('div')
                    	.attr('class', 'category');

                    	tooltipDonut.append('div')
                    	.attr('class', 'count');

  var colorsDonut = ['rgb(118,42,131)','rgb(175,141,195)','rgb(231,212,232)','rgb(217,240,211)','rgb(127,191,123)','rgb(27,120,55)']
  var domainDonut = ["economics", "chemistry", "physics", "peace", "literature", "medicine"]
  var colorDonut = d3.scaleOrdinal(colorsDonut);

  var donutTitle = donutChart.append("text")
                             .attr("class", "graph-title")
                             .attr("x", 50)
                             .attr("y", 0)
                             .attr("text-anchor", "middle")
                             .text("Total")

  makeDonutLegend(colorsDonut, domainDonut)
  console.log(dictDonut)

  var g = donutChart.selectAll(".arc")
             .data(pie(dictDonut))
             .enter()
             .append("g")
             .attr("class", "arc")
             .attr("transform", "translate(50,0)");

  g.append("path")
   .attr("d", arc)
   .style("fill", function(d,i){ return colorDonut(i)})
   .on('mouseover', function(d){
     			tooltipDonut.select('.category').html("Category: " + d.data.category);
     			tooltipDonut.select('.count').html("Nobel prizes: " + d.data.prizes);

     			tooltipDonut.style('display', 'block');
     			tooltipDonut.style('opacity',2);

      d3.select(this)
        .style("stroke", "white")
        .style("stroke-width", 2)
        .style("opacity", 0.8)
   })
   .on("mousemove", function(d){
     tooltipDonut.style('top', (d3.event.layerY + 10) + 'px')
			.style('left', (d3.event.layerX - 25) + 'px');
		})
   .on("mouseout", function(d){
     tooltipDonut.style('display', 'none')
     tooltipDonut.style('opacity', 0)

     d3.select(this)
       .style("stroke", "white")
       .style("stroke-width", 0)
       .style("opacity", 1)
   })

  var marginLine = {top: 60, right: 150, bottom: 60, left: 50},
    widthLine = 1200 - marginLine.left - marginLine.right,
    heightLine = 400 - marginLine.bottom - marginLine.top;

  var lineChart = d3.select("#row3").append("svg")
                    .attr("width", widthLine + marginLine.left + marginLine.right)
                    .attr("height", heightLine + marginLine.top + marginLine.bottom)
                    .attr("id", "lineSVG")
                    .append("g")
                    .attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")")
  var xScale = d3.scaleLinear().range([0, widthLine - marginLine.right]);
  var yScale = d3.scaleLinear().range([heightLine, 0]);

  var lineTitle = d3.select("#lineSVG").append("g")
           .attr("transform", "translate(" + marginLine.left + "," + marginLine.top/2 + ")")
           .append("text")
           .attr("class", "title")
           .attr("x", 0)
           .attr("y", 0)
           .text("Primary, secondary and tertiary school enrolment in the Netherlands")

  var dataCountry = collectData("NLD")

  makeAxes(dataCountry)

  var attributes = ["primEduc", "secEduc", "tertEduc"]

  colorsLine = ['rgb(84,39,136)','rgb(179,88,6)','rgb(69,117,180)']

  drawLines(dataCountry, attributes, colorsLine)

  var legendData = ["Primary school", "Secondary school", "Tertiary school"]
  makeLegend(legendData, colorsLine)

  function makeLegend(dataA, colors){
    var legendLine = d3.select("#lineSVG")
                       .append("g")
                       .attr("class", "lineLegend")
                       .attr("transform", "translate(" + (widthLine - 20) + "," + marginLine.top + ")")

    legendLine.append("text")
              .attr("class", "legendTitle")
              .attr("x", 10)
              .attr("y", 10)
              .text("School enrolment (gross)")

    legendLine.selectAll(".legendPoint")
              .data(dataA)
              .enter()
              .append("rect")
              .attr("class", "legendPoint")
              .attr("x", 10)
              .attr("y", function(d,i){
                return 20 + 20*i;
              })
              .attr("height", 5)
              .attr("width", 5)
              .attr("fill", function(d,i){
                return colors[i]
              })

    legendLine.selectAll(".legendText")
              .data(dataA)
              .enter()
              .append("text")
              .attr("class", "legendText")
              .attr("x", 20)
              .attr("y", function(d,i){
                 return 30 + 20*i;
              })
              .text(function(d){
                console.log(d)
                return d;
              })

  }

  // var marginScatter = {top: 10, right: 40, bottom: 60, left: 100},
  //   widthScatter = 1200 - marginScatter.left - marginScatter.right,
  //   heightScatter = 400 - marginScatter.bottom - marginScatter.top;
  //
  // var scatterPlot = d3.select("#row4").append("svg")
  //                     .attr("width", widthScatter + marginScatter.left + marginScatter.right)
  //                     .attr("height", heightScatter + marginScatter.top + marginScatter.bottom)
  //                     .attr("id", "scatterSVG")
  //                     .append("g")
  //                     .attr("transform", "translate(" + marginScatter.left + "," + marginScatter.top + ")")
  //
  // var xScaleScatter = d3.scaleLinear().range([0, widthScatter])
  // var yScaleScatter = d3.scaleLinear().range([heightScatter, 0])
  //

  //
  // // Scale the range of the data
  // xScaleScatter.domain(d3.extent(dataScatter, function(d) {
  //   return d.nobelPrizes;
  // }));
  // maxY = d3.max(dataScatter, function(d){
  //   return d.population[2017];
  // })
  // yScaleScatter.domain([0,Math.ceil(maxY/5)*5])
  //
  // // Add the X Axis
  // scatterPlot.append("g")
  //     .attr("transform", "translate(0," + heightScatter + ")")
  //     .attr("class", "x-axis")
  //     .call(d3.axisBottom(xScaleScatter))
  //
  // // Add the Y Axis
  // scatterPlot.append("g")
  //     .attr("class", "y-axis")
  //     .call(d3.axisLeft(yScaleScatter));
  //
  // scatterPlot.selectAll("circle")
  //            .data(dataScatter)
  //            .enter()
  //            .append("circle")
  //            .attr("class", "scatter")
  //            .attr("cx", function(d){
  //              return xScaleScatter(d.nobelPrizes)
  //            })
  //            .attr("cy", function(d){
  //              return yScaleScatter(d.population[2000])
  //            })
  //            .attr("r", 2)
  //            .attr("fill", "black")

  world.append("g")
       .attr("class", "countries")
       .attr("transform", "translate(40,40)")
       .selectAll("path")
       .data(countries.features)
       .enter().append("path")
       .attr("d", path)
       .style("fill", function(d) { return colorWorld(d.nobelPrizeWinners);})
       .style("opacity", 1)
       .style("stroke", "black")
       .style("stroke-width", 0.3)
       .on('mouseover', function(d){
         tipWorld.show(d);

         d3.select(this)
           .style("opacity", 0.8)
           .style("stroke", "white")
           .style("stroke-width", 1)
       })
       .on("mouseout", function(d){
         tipWorld.hide(d);

         d3.select(this)
           .style("opacity", 1)
           .style("stroke", "black")
           .style("stroke-width", 0.3)
       })
       .on("click", function(d){
         return clickCountry(d.properties.name, d.id, donutChart, attributes, colorsLine)
       })


 function clickCountry(country, countryID, donutChart, attributes, colorsLine){
   categoriesDict = makeDonutDict()
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
                     .duration(1000)
                     .attrTween("d", pieTween);

   dataUpdate = collectData(countryID)
   console.log(dataUpdate)

   xScale.domain(d3.extent(dataUpdate, function(d) {
     return d.year
   }))
   maxPrim = d3.max(dataUpdate, function(d){
     return d.primEduc;
     })
   maxSec = d3.max(dataUpdate, function(d){
     return d.secEduc;
      })
   maxTert = d3.max(dataUpdate, function(d){
     return d.tertEduc;
     })
   if (maxTert >= maxSec && maxTert >= maxPrim){
     maxY = maxTert
   }
   else if (maxSec >= maxTert && maxSec >= maxPrim){
     maxY = maxSec
   }
   else {
     maxY = maxPrim
   }

   yScale.domain([0,Math.ceil(maxY/5)*5])

   d3.select(".x-axis")
     .transition()
     .duration(1000)
     .call(d3.axisBottom(xScale).tickFormat(d3.format('.4')))

   d3.select(".y-axis")
     .transition()
     .duration(1000)
     .call(d3.axisLeft(yScale));

   lineTitle.text("Primary, secondary and tertiary school enrolment in " + country)

   if (dataUpdate.length != 0){
     for (item in attributes){
       var lineWow = d3.line()
                       .x(function(d){return xScale(d.year)})
                       .y(function(d){return yScale(d[attributes[item]])})

       d3.select("#" + attributes[item])
                .data([dataUpdate])
                .transition()
                .duration(1000)
                .attr("d", lineWow)

       let points = lineChart.selectAll("." + attributes[item])
                      .data(dataUpdate)

       points.enter()
         .append("circle")
         .attr("r", 1.5)
         .attr("fill", getColor(item))
         .attr("cy", heightLine)
         .attr("cx", 0)
         .attr("class", attributes[item])
         .merge(points)
         .transition()
         .duration(1000)
         .ease(d3.easeQuadOut)
         .attr("cx", function(d){
           return xScale(d.year)
         })
         .attr("cy", function(d){
           return yScale(d[attributes[item]])
         })
      points.exit().remove();
     }

   }
   else {
     lineTitle.text("No data available for: " + country)
   }

 }
 function updateMap(category){
     if (category == "Nobel Prizes per Capita"){
       // update map to per capita
       d3.select(".countries")
         .selectAll("path")
         .data(countries.features)
         .transition()
         .duration(1000)
         .style("fill", function(d){ return colorWorldCapita(d.nobelPrizeCapita)})
       updateWorldLegend(colorsWorldCapita, domainWorldCapita, 'capita')

     }
     else {
       // update map to total
       d3.select(".countries")
         .selectAll("path")
         .data(countries.features)
         .transition()
         .duration(1000)
         .style("fill", function(d){ return colorWorld(d.nobelPrizeWinners)})
      updateWorldLegend(colorsWorld, domainWorld, 'total')
     }
 }
 function drawLines(data, attributes, colors){
   for (item in attributes){
     var lineWow = d3.line()
                     .x(function(d){return xScale(d.year)})
                     .y(function(d){return yScale(d[attributes[item]])})

     lineChart.append("path")
              .data([data])
              .attr("class", "line")
              .attr("id", attributes[item])
              .attr("d", lineWow)
              .attr("stroke", colors[item])
              .attr("fill", "none")

     lineChart.selectAll("point")
              .data(data)
              .enter()
              .append("circle")
              .attr("class", attributes[item])
              .attr("cx", function(d){
                return xScale(d.year)
              })
              .attr("cy", function(d){
                return yScale(d[attributes[item]])
              })
              .attr("r", 1.5)
              .attr("fill", colors[item])

   }
 }

 function makeDonutDict(){
   dict = [{"category": "economics", "prizes": 0}, {"category": "chemistry", "prizes": 0}, {"category": "physics", "prizes": 0}, {"category": "peace", "prizes": 0}, {"category": "literature", "prizes": 0}, {"category": "medicine", "prizes": 0}]
   return dict
 }

 function makeDonutLegend(colors, domain){

   var legendDonut = d3.select("#donutSVG")
                       .append("g")
                       .attr("transform", "translate(20, 0)")

   // Make a title
   legendDonut.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", 20)
        .text("Categories")

   legendDonut.selectAll(".legendPoint")
             .data(colors)
             .enter()
            .append("rect")
            .attr("class", "legendPoint")
            .attr("fill", function(d){
              return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i){
              return 30 + 20*i;
            })
            .attr("height", 18)
            .attr("width", 18)

   legendDonut.selectAll(".legendText")
             .data(domain)
             .enter()
             .append("text")
             .attr("class", "legendText")
             .attr("x", 25)
             .attr("y", function(d, i){
               return 45 + 20*i;
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
     dict[countryCode] = ""
   }
   return dict
 }

 function addData(dict){
   for (country in dict){
     counter = 0;
     for (item in nobelWinners){
       let nobelWinnerCountry = nobelWinners[item].bornCountry;
       if (nobelWinnerCountry == country){
         counter += 1;
       }
     }
     dict[country] = counter
   }
   return dict
 }

 function makeWorldLegend(domain, colors){

   var legendWorld = world.append("g")
                     .attr("transform", "translate(20,0)")
   // Make a title
   legendWorld.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", marginWorld.top)
        .text("Amount of Nobel prize winners")

   // Make the colored rectangles
   legendWorld.selectAll("legendPoint")
      .data(colors)
      .enter()
      .append("rect")
      .attr("class", "legendPoint")
      .attr("fill", function(d){
        return d;
      })
      .attr("x", 0)
      .attr("y", function(d, i){
        return marginWorld.top + 10 + 20*i;
      })
      .attr("height", 18)
      .attr("width", 18)

   // Make the text for the legend
   legendWorld.selectAll("legendText")
      .data(domain)
      .enter()
      .append("text")
      .attr("class", "legendText")
      .attr("x", 25)
      .attr("y", function(d,i){
        return marginWorld.top + 25 + 20*i;
      })
      .text(function(d, i){
        return d;
      })
 }
 function updateWorldLegend(colors, domain, category){
   if (category == 'capita'){
     d3.select(".legendTitle")
                .text("Amount of Nobel prize winners per capita")

     d3.select(".map")
       .selectAll(".legendPoint")
          .data(colors)
          .transition()
          .duration(1000)
          .attr("fill", function(d){
            return d;
          })
    d3.select(".map")
      .selectAll(".legendText")
      .data(domain)
      .transition()
      .duration(1000)
      .text(function(d){
        return d;
      })
   }
   else {
     d3.select(".legendTitle")
                .text("Amount of Nobel prize winners")
    d3.select(".map")
      .selectAll(".legendPoint")
         .data(colors)
         .transition()
         .duration(1000)
         .attr("fill", function(d){
           return d;
         })
     d3.select(".map")
       .selectAll(".legendText")
       .data(domain)
       .transition()
       .duration(1000)
       .text(function(d){
         return d;
       })
   }



 }
 function collectData(country){
   var primEdCountry = primEduc[country]
   var secEdCountry = secEduc[country]
   var tertEdCountry = tertEduc[country]

   data = []
   for (year in primEdCountry){
     if (primEdCountry[year] != null && secEdCountry[year] != null && tertEdCountry[year] != null){
       if (year == "Country Name"){
         break
       }
       data.push({"year": year, "primEduc": primEdCountry[year], "secEduc": secEdCountry[year], "tertEduc": tertEdCountry[year]})
     }
   }
   return data
 }
 // Function that makes the axes
 function makeAxes(data) {

   // Scale the range of the data
   xScale.domain(d3.extent(data, function(d) {
     return d.year;
   }));
   maxY = d3.max(data, function(d){
     return d.secEduc;
   })
   yScale.domain([0,Math.ceil(maxY/5)*5])

   // Add the X Axis
   lineChart.append("g")
       .attr("transform", "translate(0," + heightLine + ")")
       .attr("class", "x-axis")
       .call(d3.axisBottom(xScale).tickFormat(d3.format('.4')))

   // Add the Y Axis
   lineChart.append("g")
       .attr("class", "y-axis")
       .call(d3.axisLeft(yScale));

   }

 function getColor(n){
   colors = ['rgb(84,39,136)','rgb(179,88,6)','rgb(69,117,180)']
   return colors[n]
 }

}
