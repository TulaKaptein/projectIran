# Process book

## day 1 (9/1/2019)

Today I started making my shaded world map with the Nobel prize data. I soon realised that a lot of the country
names in the Nobel prize dataset didn't accord with country names in the world map dataset, because of
changes in names over the years (1900 till now).
So I had to manually change many of these names.

Another problem is the fact that the Nobel prize dataset has a column for which country the winner(s) "belong to",
but in many cases this column has the value 'null'.
Which is why I decided to see the country of birth as the country the Nobel prize belongs to.

Progress: my world map is now shaded and my dataset is complete and correct.

## day 2 (10/1/2019)

Today I wanted to make the different pages for my project, connect them and start with the pie chart.
I succeeded making the pages and connecting them and making the pie chart. I haven't succeeded being able to update
the pie chart by clicking on a country yet.

Progress: the website has three different pages and a pie chart.

## day 3 (11/1/2019)

Absent.

## day 4 (14/1/2019)

Today I encountered some problems with updating my donut chart, because of the different parts (arc & pie). But fortunately I managed to in the end. However, the tooltip that I used (d3-tip) didn't update with the data.

Progress: the donut chart updates when a country is clicked, a legend was added.

## day 5 (15/1/2019)

Today I implemented bootstrap to give my webpage a better lay out. I also made sure that every element has it's own svg, which consists of a g for the legend and a g for the actual graph. The donut chart shows the country name and if the country didn't win any Nobel prizes the donut chart disappears.

## day 6 (16/1/2019)

Today I made a line chart, which shows the primary, secondary and tertiary gross enrolment for a country that is clicked. The line chart also has dots for the exact datapoints, because some data misses a year or two. The points and the lines update when a country is clicked.

## day 7 (17/1/2019)

Today I made a new tip for my donut chart and I started looking for data gaps for the line chart. I also added a title that updates when a country is selected. I added a legenda to the line chart. I also added buttons to change the world map between 'Total Nobel Prizes' and 'Nobel Prizes per Capita'

Progress: All my graphs are implemented with the correct data. The links are also working. The tooltips for the world map and the donut chart also work.

## day 8 (18/1/2019)

To do:

- comments toevoegen
- tooltip line implementeren voor de line chart.
- link toevoegen bij de line chart, die een pie chart update met percentage jongens vs meisjes.
- scatter plot voor aantal nobel prijzen vs population
- ideeen zoeken via de voorbeelden gegeven door help@mprog
