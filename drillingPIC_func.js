
// main function to visualize the trajectory, geological formations, etc
function visualizer(BHAruns, formations, rsk, well, numCasing1, numCasing2){

	// get the trajectory to draw
    var trajet = makeTrajet(BHAruns);
    console.log(trajet);
    
	var padding = {top:50, right:70, bottom:50, left:50};

	var numRuns = BHAruns.length;
	var depthmax = trajet[numRuns-1].end[1];
	var grdleft = trajet[0].begin[0];
	var grdright = trajet[numRuns-1].end[0];

	for(var i=0; i<trajet.length; i++){

		var dep = d3.max([trajet[i].begin[1], trajet[i].end[1]]);
		var grdl = d3.min([trajet[i].begin[0], trajet[i].end[0]]);
		var grdr = d3.max([trajet[i].begin[0], trajet[i].end[0]]);

		if(dep > depthmax)  depthmax = dep;
		if(grdr > grdright) grdright = grdr;
		if(grdl < grdleft) grdleft = grdl;
	}

    // set Scales for the coordinate system
	var width = 600;
	var height = 600;
	var svg = d3.select("#Pic")
				 .append("svg")
				 .attr("width", width)
				 .attr("height", height);

	var xScale = d3.scale.linear()
						 .domain([grdleft, grdright])
						 .range([0, width - padding.left - padding.right]);

	var yScale = d3.scale.linear()
						 .domain([0, depthmax * 1.1])
						 .range([0, height - padding.top -padding.bottom]);


	// draw geological formations
	var geoRect = gformation(formations, yScale, padding, width);
	console.log(geoRect);

	svg.selectAll(".geoRect")
		 .data(geoRect)
		 .enter()
		 .append("rect")
		 .attr("x", function(d){
		 	return d.x;
		 })
		 .attr("y", function(d){
		 	return d.y;
		 })
		 .attr("height", function(d){
		 	return d.height;
		 })
		 .attr("width", function(d){
		 	return d.width;
		 })
		 .attr("fill", function(d){
		 	return d.color;
		 });

    // draw risk warning circles
 	var rskCircles  = rskVisualizer(rsk, yScale, padding, width);
    console.log(rskCircles);

    svg.selectAll(".rskCircles")
    	 .data(rskCircles)
    	 .enter()
    	 .append("image")
    	 .attr("xlink:href", function(d){
    	 	if (d.color == "red"){
    	 		return "img/red.svg";
    	 	}
    	 	if (d.color == "blue"){
    	 		return "img/blue.svg";
    	 	}
    	 	if (d.color == "black"){
    	 		return "img/black.svg";
    	 	}
    	    if (d.color == "yellow"){
    	 		return "img/yellow.svg";
    	 	}
    	 })
    	 .attr("x", function(d){
    	 	return d.cx;
    	 })
    	 .attr("y", function(d){
    	 	return d.cy;
    	 })
    	 .attr("width", 30)
  		 .attr("height", 30)
    	 .on("click", function(d){
    	 	 window.open(d.link,"window_Rsk","height=800,width=1400,left=100,top=10");
    	 });

    // draw casings
    var BHAruns2 = [];
    var leng = BHAruns.length;

    for(var ii = 0; ii < numCasing2; ii++){
    	BHAruns2[ii] = BHAruns[leng - numCasing2 + ii];
    }
    
    // casings of previous process
    var casings1 = makeCasing(xScale, yScale, padding, BHAruns, numCasing1);
    console.log(casings1);

    svg.selectAll(".myCasing")
    	 .data(casings1)
    	 .enter()
    	 .append("polygon")
    	 .attr("points", function(d,i){
    	 	return d.points.join(",");
    	 })
    	 .attr("stroke", "black")
    	 .attr("fill", "none")
    	 .attr("stroke-width",2);

    // casings for this just casing process
	if(numCasing2 > 0){

		 var casings2 = makeCasing(xScale, yScale, padding, BHAruns2, numCasing2);
         console.log(casings2);
		 
		 svg.selectAll(".myCasing")
    	 	.data(casings2)
    	 	.enter()
    	 	.append("polygon")
    	 	.attr("points", function(d,i){
    	 		return d.points.join(",");
    	 	})
    	 	.attr("stroke", "#00FFFF")
    	 	.attr("fill", "none")
    	 	.attr("stroke-width",2);
	}

	// draw the trajectory
	svg.selectAll(".trajet")
		 .data(trajet)
		 .enter()
		 .append("line")
		 .attr("class", "trajetLines")
		 .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
		 .attr("x1", function(d){
		 	return xScale(d.begin[0]);
		 })
		 .attr("y1", function(d){
		 	return yScale(d.begin[1]);
		 })
		 .attr("x2", function(d){
		 	return xScale(d.end[0]);
		 })
		 .attr("y2", function(d){
		 	return yScale(d.end[1]);
		 })
		 .attr("fill", "none")
		 .attr("stroke-width",2)
		 .attr("stroke", d3.rgb(25,25,255));
		 
    // draw axis
	var xAxis = d3.svg.axis()
					 .scale(xScale)
					 .ticks(5)
					 .tickFormat(d3.format("d"))
					 .orient("top");

	var yAxis = d3.svg.axis()
					 .scale(yScale)
					 .orient("left");

	svg.append("g")
		 .attr("class", "axis")
		 .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
		 .call(xAxis);	

	svg.append("g")
		 .attr("class", "axis")
		 .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
		 .call(yAxis);			


    // draw toolbox
	var tooltip = d3.select("body")
					 .append("div")
					 .attr("class", "tooltip")
					 .style("opacity",0.0);

	var title = tooltip.append("div")
					 .attr("class", "title");

	var des = tooltip.selectAll(".des")
					 .data([trajet])
					 .enter()
					 .append("div");

	var desText = des.append("div")
					 .attr("class", "desText");

    // Interaction 
    // event which happens when you move the cursor on the area defined by two axis
	svg.append("rect")
		 .attr("class", "overlay")
		 .attr("x", padding.left)
		 .attr("y", padding.top)
		 .attr("width", width - padding.left - padding.right)
		 .attr("height", height - padding.top - padding.bottom)
		 .on("mouseover", function(){
		 	console.log("mouseover");
		 
		 	tooltip.style("left", (d3.event.pageX) + "px")
		 			 .style("top", (d3.event.pageY + 20) + "px")
		 			 .style("opacity", 1.0)
		 			 .style("display", "block");

		 })
		 .on("mouseout", function(){
		 	console.log("mouseout");
		 	svg.selectAll(".trajetLines")
				 .attr("stroke", d3.rgb(25,25,255))
				 .attr("stroke-width", 2);

		 	tooltip.style("opacity", 0.0)
		 	       .style("display", "none");

		 })
		 .on("mousemove", function(){
		 	var mouseX = d3.mouse(this)[0] - padding.left;
		    var mouseY = d3.mouse(this)[1] - padding.top;
		    atmoving(svg, xScale, yScale, tooltip, title, desText, trajet, mouseX, mouseY);
		 });

}

// calculate the info for drawing the alert symbols of risks
function rskVisualizer(rsk, yScale, padding, width){

	var myCircles = new Array();
	var rayon = 7;
	//var rayon = padding.right / ((2 * rsk.length + 1) * 2);
	for(var ind=0; ind < rsk.length; ind++){

		myCircles.push({num: rsk[ind].num,
				 depth: rsk[ind].depth,
				 type: rsk[ind].type,
				 r: rayon,
				 //cx: width - padding.right + rayon * (2 * ind + 3),
				 cx: width - padding.right + 3*rayon,
				 cy: yScale(rsk[ind].depth) + padding.top,
				 color: rsk[ind].color,
				 link: rsk[ind].link,
				 rskInfo: rsk[ind].rskInfo
			});

	}
	return myCircles;
}

// calculate the info for drawing the geological formations
function gformation(forms, yScale, padding, width){

   var myRects = new Array();
   for(var ind=0; ind < forms.length; ind++){

        var yy = yScale(forms[ind].top) + padding.top;
        var hh = yScale(forms[ind].btm - forms[ind].top);
        var ymax = yScale.range()[1] + padding.top;

        if(yy + hh > ymax)  hh = ymax - yy;

   	    myRects.push({x: padding.left,
   	  				y: yy,
   	  				height: hh,
   	  				width: width - padding.left - padding.right, 
   	  				color: forms[ind].color
   	  			});
   	  		
   }
   return myRects;

}

// calculate the info for drawing the trajectory
function makeTrajet(runs){
    
	var numRuns = runs.length;
	var lines = new Array();

	for(var k=0; k<numRuns; k++){

		lines.push({
			begin: runs[k].begin,
			end: runs[k].end,
			wob: runs[k].WOB,
			rop: runs[k].ROP,
			rpm: runs[k].RPM,
			motor: runs[k].motor,
			bitType: runs[k].bitType,
			mudType: runs[k].mudType,
			mudWeight: runs[k].mudWeight

		});
	}
	return lines;

}

// calculate the info for drawing the casings
function makeCasing(xScale, yScale, padding, runs, num){

	var numRuns = runs.length;
	var polys = new Array();
	var casingWidth = 5;

	if(num <= numRuns && num > 0){

		for(var i = 0; i < num; i++){

		var begin = [xScale(runs[i].begin[0]) + padding.left, yScale(runs[i].begin[1]) + padding.top];
		var end = [xScale(runs[i].end[0]) + padding.left, yScale(runs[i].end[1]) + padding.top];
		var dist = Math.sqrt(Math.pow(end[0]-begin[0],2) + Math.pow(end[1]-begin[1],2));
		var sin = (end[0]-begin[0]) / dist;
		var cos = (end[1]-begin[1]) / dist;

		polys.push({points:[begin[0] - casingWidth * cos, begin[1] + casingWidth * sin,
                    begin[0] + casingWidth * cos, begin[1] - casingWidth * sin,
                    end[0] + casingWidth * cos, end[1] - casingWidth * sin,
                    end[0] - casingWidth * cos, end[1] + casingWidth * sin
                   ]}
                 );

		}
	}

	return polys;
}

// draw the toolbox which appears when you move the cursor
function atmoving(svg, xScale, yScale, tooltip, title, desText, trajet, mouseX, mouseY){

		var x0 = xScale.invert(mouseX);
		var y0 = yScale.invert(mouseY);

		var numRuns = trajet.length;
		var index = 0;

        for(var i = 0; i < numRuns; i++ ){
        	if(y0 > trajet[i].begin[1] && y0 < trajet[i].end[1]){
        		index = i;
        		continue;
        	}
        }

		svg.selectAll(".trajetLines")
			.filter(function(d){
				return d.begin[1] < y0 && y0 < d.end[1];
			})
			.attr("stroke", "#EEEE00")
			.attr("stroke-width", 4);

		svg.selectAll(".trajetLines")
			.filter(function(d){
				return y0 < d.begin[1] || y0 > d.end[1];
			})
			.attr("stroke", d3.rgb(25,25,255))
			.attr("stroke-width", 2);
	

	    title.html("<strong>BHA RUN " + (index + 1) + "</strong>");

	    desText.html(
	    	 "<strong>Depth_min:" + "\t"  +
	    	       trajet[index].begin[1] + "m</strong>" +
	    	       "</br>" + "<strong>Depth_max:" + "\t" +
	    	       trajet[index].end[1] + "m</strong>" +
	    	       "</br>" + "<strong>Bit type:" + "\t" +
	    	       trajet[index].bitType + "</strong>" +
	    	       "</br>" + "<strong>WOB:" + "\t" +
	    	       trajet[index].wob + "</strong>" +
	    	       "</br>" + "<strong>ROP:" + "\t" +
	    	       trajet[index].rop + "</strong>" +
	    	       "</br>" + "<strong>Motor:" + "\t" +
	    	       trajet[index].motor + "</strong>" +
	    	       "</br>" + "<strong>RPM:" + "\t" +
	    	       trajet[index].rpm + "</strong>" +
	    	       "</br>" + "<strong>Mud type:" + "\t" +
	    	       trajet[index].mudType + "</strong>" +
	    	       "</br>" + "<strong>Mud weight:" + "\t" +
	    	       trajet[index].mudWeight + "kg</strong>"

	    );

	    tooltip.style("left", (d3.event.pageX) + "px")
				 .style("top", (d3.event.pageY + 20) + "px");


}