# Group 3 Project 2 – US Wildfires Database<br/>
Members: 	Kaylon Young, Rob Pascarella, Tobias Judd<br/>

# Abstract:<br/>

Wildfires don’t stop where the wilderness ends. They burn through communities and neighborhoods, destroying property and taking lives. With climate-driven increases in wildfires in the U.S., it is imperative to understand how the risk to homes is also changing nationwide. The convergence of warmer, drier conditions and greater development into flammable landscapes is leaving many communities vulnerable to human-caused wildfires.<br/>

The objective of this project was to extract and explore a publicly available spatial database of wildfires that occurred in the United States from 1992 to 2015 and includes 1.88 million geo-referenced wildfire records, representing a total of 140 million acres burned during the 24-year period.<br/>
The questions that this project proposes to answer are:<br/>
•	Have wildfires become more or less frequent over time?<br/>
•	What areas states are the most and least fire-prone?<br/>
•	Seasonal impact on size and frequency? <br/>

# Resources:<br/>

The websites that are used in this project include: <br/>
1.	1.88 Million US Wildfires available from Kaggle <br/>
- Data for the project will be refined given the number and volume of data exceeding 1,213,546 fires and burning 140,132,509 acres over a 24 year period. <br/>
- Current proposed data set to focus on the largest fires greater than 1000 acres which results in a refined fire count of 11,559 representing ~86% of the total acreage burned. <br/>

# Example of Figures<br/>

1. Geomap showing fire locations by year.<br/>
2. Fire frequency during the year. <br/>
3. Fire type by location and size using Leaflet. <br/>
4. Slider of events using Javascript https://plotly.com/javascript/sliders/ <br/>
5. Proposed library to be used www.chartjs.org <br/>

# Recreating Application
1. Create a postgres database with database called wildfires_db
2. Run create_tables_wildfires.sql file to create wildfires table
3. Import fires_ClassG_YEAR2000_2015.csv into wildfires table
4. Create config.py project directory and update with database password.  Variable name 'Posgres_Pswrd'
5. Create config.js to code/static/js and update with mapbox api_key. Variable name is API_KEY.
6. In Gitbash or commandline, browse to the project2/code folder.  Then type python app.py.
7. Open a browser window and enter localhost:5000.  The application should run.


![image](https://i.pinimg.com/originals/bf/e7/e1/bfe7e1743686333c87dc50ea763d70c0.jpg)

