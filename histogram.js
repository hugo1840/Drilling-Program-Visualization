function riskHistory(histories){


	    // define the svg
		var div1 = d3.select("body")
		         .append("div")
		 		 .attr("class", "div")
		         .attr("id", "rskHist");

	    var width = 600;
		var height = 600;	
		var canvas = d3.select("#rskHist")
						 .append("svg")
						 .attr("width",width)
						 .attr("height",height);
						
		var padding = {top: 50, right: 20, bottom: 100, left: 50 };

		// title for the histogram
		var title = canvas.selectAll(".mytitle")
		                 .data([{title: "Historical Losses Caused by this Type of Risk (1000 dollars)"}])
						 .enter()
						 .append("text")
						 .attr("fill","black")
						 .attr("font-size","12px")
						 .attr("text-anchor","middle")
						 .attr("x", 0)
						 .attr("y", padding.top)
						 .attr("dx", width/2)
						 .attr("dy","-1em")
						 .text(function(d){
						       return d.title;
						 });

		// set scales
		var lenHist = histories.length;
		var yearBegin = histories[0].year;
		var yearEnd = histories[lenHist-1].year;

		var lossMax = histories[0].loss;
		for(var k = 0; k < lenHist; k++){

			if(histories[k].loss > lossMax){
				lossMax = histories[k].loss;
			}
		}

		var xAxisWidth = 400;
		var yAxisWidth = 400;

		var xScale = d3.scale.linear()
		                 .domain([yearBegin-1, yearEnd])
		                 .range([0, xAxisWidth]);

		var yScale = d3.scale.linear()
		                 .domain([0, lossMax])
		                 .range([0, yAxisWidth]);

		// draw rectangle bars of the histogram
    	// d3.selectAll("rect") may include the rectangles that already exist
    	// d3.selectAll(".myrect") choose an empty set if the css class "myrect" is not defined	
    	var rectWidth = xAxisWidth / (2*lenHist - 1);
		var rect = canvas.selectAll(".myrect")
		                 .data(histories)
						 .enter()
						 .append("rect")
						 .attr("fill","steelblue")
						 .attr("x", function(d){
						        return padding.left + xScale(d.year) - rectWidth/2;
						 })
						 .attr("y", function(d){
						        return height - padding.bottom - yScale(d.loss);
						 })
						 .attr("width", rectWidth)
						 .attr("height", function(d){
						        return yScale(d.loss);
						 })
						 .on("mouseover", function(d,i){
						 	 d3.select(this)
						 	 	 .attr("fill","yellow");
						 })
						 .on("mouseout", function(d,i){
						 		d3.select(this)
						 			 .transition()
						 			 .duration(500)
						 			 .attr("fill","steelblue");
						 });

	    // add text to the bars
		var textWidth = rectWidth / 2;			 
		var text = canvas.selectAll(".mytext")
		                 .data(histories)
						 .enter()
						 .append("text")
						 .attr("fill","black")
						 .attr("font-size","10px")
						 .attr("text-anchor","middle")
						 .attr("x", function(d){
						       return padding.left + xScale(d.year) - rectWidth/2;
						 })
						 .attr("y", function(d){
						       return height - padding.bottom - yScale(d.loss);
						 })
						 .attr("dx", textWidth)
						 .attr("dy","-1em")
						 .text(function(d){
						       return d.loss;
						 });


    	// draw axis
    	var xAxis = d3.svg.axis()
                         .scale(xScale)
                         .tickFormat(d3.format("d"))
                         .orient("bottom");

		yScale.range([yAxisWidth, 0]);

		var yAxis = d3.svg.axis()
    					 .scale(yScale)
    					 .orient("left");
        

		canvas.append("g")
				 .attr("class", "axis")
				 .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
				 .call(xAxis);

		canvas.append("g")
				 .attr("class", "axis")
				 .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom -yAxisWidth) + ")")
				 .call(yAxis);

}