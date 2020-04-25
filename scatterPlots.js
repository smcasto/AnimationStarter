// Gets the mean grade for every assignment and creates an array of all the mean grades.
var getMeanGrade = function(entries)
{
    return d3.mean(entries,function(entry)
        {
            return entry.grade;
        })
}

/*// draws the scatter plot
var drawScatter = function(students,target,
              xScale,yScale,xProp,yProp)
{

    // Sets title to be corrected for graph shown.
    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
    
    
    //Creates circles as the datapoint in scatterplot.
    d3.select(target).select(".graph")
    .selectAll("circle")
    .data(students)
    .enter()
    .append("circle")
    
    // Assigns x and y values using getMean grade Function. Putting in xProp and yProp for various types of assignments for each student.
    .attr("cx",function(student)
    {
        return xScale(getMeanGrade(student[xProp]));    
    })
    .attr("cy",function(student)
    {
        return yScale(getMeanGrade(student[yProp]));    
    })
    .attr("r",4);*/
/*}*/

var drawScatter = function(students,target,xScale,yScale,xProp,yProp)

{
setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());   
    
var circles = d3.select("#scatter svg")
.selectAll("circle")
.data(students)
circles.enter()
  .append("circle");
circles.exit()
  .remove();

d3.select("#scatter svg")
.select(".graph")
.selectAll("circle")
.transition()
.attr("cx", function(student)
{
return xScale(getMeanGrade(student[xProp]));    
})
.attr("cy",function(student)
    {
return yScale(getMeanGrade(student[yProp]));    
    })
.attr("r",4)
.attr("fill", "green")
}


// Removes plot points on scatterplot. Targets all circle elements.
var clearScatter = function(target)
{
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .remove();
}

// Creates the axes for the graph. Sets the sclae for each axis and appends axis as groups and tranforms it to be in the right place.
var createAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
}

// initiates the formation of the grpah within the gievn cell.
var initGraph = function(target,students)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    

    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0])
  
    
    
    createAxes(screen,margins,graph,target,xScale,yScale);
    
    initButtons(students,target,xScale,yScale);
    
    setBanner("Click buttons to graphs");
    
    

}


//Clears and adds data using the buttoms created in html using the click function. Each button draws the data with different types of assignments as the x and y values.
var initButtons = function(students,target,xScale,yScale)
{
    
    d3.select("#fvh")
    .on("click",function()
    {
        drawScatter(students,target,
              xScale,yScale,"final","homework");
    })
    
    d3.select("#hvq")
    .on("click",function()
    {
        drawScatter(students,target,
              xScale,yScale,"homework","test");
    })
    
    d3.select("#tvf")
    .on("click",function()
    {
        drawScatter(students,target,
              xScale,yScale,"test","final");
    })
    
    d3.select("#tvq")
    .on("click",function()
    {
        drawScatter(students,target,
              xScale,yScale,"test","quizes");
    })
    
    
    
}

// Creates the function to change the title of the page.
var setBanner = function(msg)
{
    d3.select("#banner")
        .text(msg);
    
}


// Pulls the assignment data from the classData. json file.
var penguinPromise = d3.json("/classData.json");

penguinPromise.then(function(penguins)
{
    console.log("class data",penguins);
   initGraph("#scatter",penguins);
   
},
function(err)
{
   console.log("Error Loading data:",err);
});