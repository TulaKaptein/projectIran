For this deadline, you must prove that you have access to the data in a usable format!

Some parts that you should describe here:

* a list of data sources if you will get data from an external source, including information on how your are going to filter and transform the data for your project

* a diagram with an overview of the technical components of your app (visualizations, scraper etc etc)

* as well as descriptions of each of the components and what you need to implement these

* a list of APIs or D3 plugins that you will be using to provide functionality in your app

# Design

## Data sources

All datasources below were attained in .json format or converted from .csv to .json files. All .json files have
been tested on validity.

* [World map](http://bl.ocks.org/micahstubbs/raw/8e15870eb432a21f0bc4d3d527b2d14f/a45e8709648cafbbf01c78c76dfa53e31087e713/world_countries.json)
* [Nobel prizes](https://data.world/sya/nobel-prize-winners/workspace/file?filename=nobel_prize_by_winner.csv )
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