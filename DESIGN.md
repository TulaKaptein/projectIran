For this deadline, you must prove that you have access to the data in a usable format!

Some parts that you should describe here:

* a list of data sources if you will get data from an external source, including information on how your are going to filter and transform the data for your project

* a diagram with an overview of the technical components of your app (visualizations, scraper etc etc)

* as well as descriptions of each of the components and what you need to implement these

* a list of APIs or D3 plugins that you will be using to provide functionality in your app

# Design

## Data sources

All datasources below were attained in .json format or converted from .csv
to .json files. All .json files have been tested on validity.

* [World map](http://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json)
* [Nobel prizes (zip file)](https://data.world/sya/nobel-prize-winners/workspace/file?filename=nobel_prize_by_winner.csv )
  * Nobel prizes per winner
  * Nobel prizes over time
* [Population per country](https://data.worldbank.org/indicator/SP.POP.TOTL)
* [Female population per country (%)](https://data.worldbank.org/indicator/SP.POP.TOTL.FE.ZS)
* Primary education enrolment (gross)
  * [Total](https://data.worldbank.org/indicator/SE.PRM.ENRR)
  * [Female](https://data.worldbank.org/indicator/SE.PRM.ENRR.FE)
  * [Male](https://data.worldbank.org/indicator/SE.PRM.ENRR.MA)
* Secondary education enrolment (gross)
  * [Total](https://data.worldbank.org/indicator/SE.SEC.ENRR)
  * [Female](https://data.worldbank.org/indicator/SE.SEC.ENRR.FE)
  * [Male](https://data.worldbank.org/indicator/SE.SEC.ENRR.MA)
* Tertiary education enrolment (gross)
  * [Total](https://data.worldbank.org/indicator/SE.TER.ENRR)
  * [Female](https://data.worldbank.org/indicator/SE.TER.ENRR.FE)
  * [Male](https://data.worldbank.org/indicator/SE.TER.ENRR.MA)
  * [GPI](https://data.worldbank.org/indicator/SE.ENR.TERT.FM.ZS)
* Doctoral or equivalent attainment (cumulative)
  * [Total](https://data.worldbank.org/indicator/SE.TER.CUAT.DO.ZS)
  * [Female](https://data.worldbank.org/indicator/SE.TER.CUAT.DO.FE.ZS)
  * [Male](https://data.worldbank.org/indicator/SE.TER.CUAT.DO.MA.ZS)

## Technical components
![](doc/visualSketch.png)
The project will have three 'pages'. It will start with an introduction to some
Nobel Prize winners followed by a question (for example: How are Nobel Prize
winners divided over the world?). Then the user will be directed to the
'dashboard'. This will be the main page with all the graphs. The third page will
be an 'about' page, with information about the datasets, the different graphs
and the purpose of the data visualisations.

* World map graph
  * Showing all countries
  * Showing the amount of Nobel Prize Winners by using points
  * Showing population by using shading
  * Possibility of selecting a certain year (or range of years)
  * Possibility of clicking on a country
  * Possibility of clicking on a point
  * Possibility of hovering over a country, visualizing the amount of Nobel
  prize winners and the population (?) in the year: ..

* Pie chart
  * When a country is clicked a pie chart reveals the different categories of
  the Nobel prizes
  * Hovering shows amount per category (?)

* Line graph
  * Showing primary education enrolment, secondary education enrolment, tertiary education enrolment and doctoral or equivalent attainment.

## API's / D3 plugins

????
