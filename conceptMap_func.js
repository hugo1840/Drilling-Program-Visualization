	
	// the main function for drawing the ganoderma diagram
	function ganoderma(well, activityPlan, responsable, engineering, risks, 
		resPlan, engPlan, rskPlan, config){
			
    	// show info about the well at the top-left corner
		var div = d3.select("body")
		         .append("div")
		 		 .attr("class", "div")
		         .attr("id", "div2");

    	div.html("Num.: <strong>"+well.num+"</strong>" +
    		"</br>" + "Longitude: <strong>"+well.longitude+"</strong>" +
    		"</br>" + "Latitude: <strong>"+well.latitude+"</strong>" +
    		"</br>" + "Client: <strong>"+well.client+"</strong>");

    	// configuration button Risk/Resp
    	var button = d3.select("body")
    				 .append("div")
    				 .attr("class", "div")
    				 .attr("id", "div3");

    	var svgbutton = d3.select("#div3")
    				     .append("svg")
    				     .attr("width", 100)
    				     .attr("height", 100);

    	svgbutton.append("rect")
             .attr("x",10)
             .attr("y",40)
             .attr("width",76)
             .attr("height",20)
             .attr("fill","#7EC0EE")
             .attr("stroke","black")
             .on("click", function(){
             	if(config == "Resp"){
             		document.location.href = "conceptMapRsk.html";
	 			}else if(config == "Risk"){
	 		        document.location.href = "conceptMapResp.html";
	 			}
             });

    	svgbutton.append("text")
			 .attr("fill","black")
			 .attr("font-size","12px")
			 .attr("text-anchor","middle")
			 .attr("x", 10)
			 .attr("y", 40)
			 .attr("dx", 38)
			 .attr("dy","1.2em")
			 .text(function(){
			 	if(config == "Resp"){
			 		return "CONFIG RISK";
			 	}else if(config == "Risk"){
			 		return "CONFIG RESP";
			 	}
			 })
			 .on("click", function(){
             	if(config == "Resp"){
             		document.location.href = "conceptMapRsk.html";
	 			}else if(config == "Risk"){
	 		        document.location.href = "conceptMapResp.html";
	 			}
             });

    	// define the svg for drawing the ganoderma diagram
		var width = 800;
		var height = 800;
		var svg = d3.select("#div1")
				 .append("svg")
				 .attr("width", width)
				 .attr("height", height);

 	 	var origin = [300,200];
 	 	var padding = 5;
 	 	var long = 140;
 	 	var wide = 30;
 	 	var R = 300;
 	 	var r = 7;

 	 	// get the infos about how to draw all the rectangles, circles & curves
	 	var myMap = getConceptMap(activityPlan, responsable, engineering, risks, 
	 		resPlan, engPlan, rskPlan, origin, padding, long, wide, R, r);

	 	console.log("myMap");
	 	console.log(myMap);

	 	var plannings = myMap[0];
	 	var circles;
	 	var lines;

	 	// this decides which configuration to draw
	 	if(config == "Resp"){
	 		circles = myMap[1];
	 		lines = myMap[2];
	 	}else if(config == "Risk"){
	 		circles = myMap[3];
	 		lines = myMap[4];
	 	}	

	 	// define the center of the ganoderma diagram
	 	var ganoCenter = plannings[0].ringCenter;
	 	console.log("ganoCenter");
	 	console.log(ganoCenter);

	 	var gRect = svg.append("g");
	 	var gRing = svg.append("g");
	 	var gLine = svg.append("g");

	 	// draw curves between those rectangles and circles
	 	var diagonal = d3.svg.diagonal();

     	gLine.selectAll("path")
     		 .data(lines)
     		 .enter()
     		 .append("path")
     		 .attr("d",diagonal
     			 .source(function(d){
     			 	
     			 	return {"x": d.sourceX, "y": d.sourceY};
     			 })
     			 .target(function(d){
     			 	
     			 	return {"x": d.targetX, "y": d.targetY};
     			 }))
     		 .attr("fill", "none")
     		 .attr("stroke", "#87CEEB")
     		 .attr("stroke-width","2");

     	// draw all the rectangles which together represent the activity plan
	 	gRect.selectAll(".myrect")
	 		 .data(plannings)
	 		 .enter()
	 		 .append("rect")
	 		 .attr("fill","black")
	 		 .attr("stroke","black")
	 		 .attr("x", function(d){
         		 return d.x;
	 		 })
	 		 .attr("y", function(d){
         		 return d.y;
	 		 })
	 		 .attr("width", function(d){
	 			 return d.length;
	 		 })
	 		 .attr("height", function(d){
         		 return d.width;
	 		 })
	 		 .on("mouseover", fadeRect(gRect, gLine, 0.0, "over"))
	 		 .on("mouseout", fadeRect(gRect, gLine, 1.0, "out"))
	 		 .on("click", goActivityPlan);

	 	// add text to the rectangles
	 	gRect.selectAll(".textRect")
			 .data(plannings)
			 .enter()
			 .append("text")
			 .attr("class", "textRect")
			 .attr("fill","white")
			 .attr("font-size","12px")
			 .attr("text-anchor","middle")
			 .attr("x", function(d){
			       return d.x;
			 })
			 .attr("y", function(d){
			       return d.y;
			 })
			 .attr("dx", long/2)
			 .attr("dy","1.5em")
			 .text(function(d){
			       	return d.name;
			 })
			 .on("mouseover", fadeRect(gRect, gLine, 0.0, "over"))
			 .on("mouseout", fadeRect(gRect, gLine, 1.0, "out"))
			 .on("click", goActivityPlan);

		// draw all the circles which represent the designs, responsibles, tools, etc
	 	gRing.selectAll(".mycircle")
			 .data(circles)
	 		 .enter()
	 		 .append("circle")
	 		 .attr("stroke", "black")
	 		 .attr("fill", function(d){
	 		 	if(d.position == "left") return "#4A4A4A";
	 		 	if(d.position == "right") return "white";
	 		 })
	 		 .attr("cx", function(d){
	 		 	return d.xCenter;
	 		 })
	 		 .attr("cy", function(d){
	 		 	return d.yCenter;
	 		 })
	 		 .attr("r", function(d){
	 		 	return d.rayon;
	 		 })
	 		 .on("mouseover", fadeRing(gRing, gLine, gRect, 0.0, "over"))
			 .on("mouseout", fadeRing(gRing, gLine, gRect, 1.0, "out"))
			 .on("click", goEngineer);

		// add text related to the circles
	 	gRing.selectAll(".textRing")
			 .data(circles)
			 .enter()
			 .append("text")
			 .attr("class", "textRing")
			 .attr("fill","red")
			 .attr("font-size","12px")
			 .attr("text-anchor", function(d){
			 	if(d.position == "left"){
			 		return "end";
			 	}else{
			 		return "start";
			 	}
			 })
			 .attr("x", function(d){
			       return d.xCenter;
			 })
			 .attr("y", function(d){
			       return d.yCenter;
			 })
			 .attr("dx", function(d){
			 	if(d.position == "left"){
			 		return -r;
			 	}else{
			 		return r;
			 	}
			 })
			 .attr("dy", 0)
			 .attr("transform", function(d){

			 	var result;
			 	if(d.position == "left"){
			 		result = "rotate("+(90 - d.angle*180/Math.PI)+","+d.xCenter+","+d.yCenter+")";
			 		result += "translate(" + (0,-5) + ")";
			 	}else if(d.position == "right"){
			 		result = "rotate("+(d.angle*180/Math.PI - 90)+","+d.xCenter+","+d.yCenter+")";
			 		result += "translate(" + (0,5) + ")";
			 	}

			 	return result;
			 })
			 .text(function(d){
			       	return d.name;
			 });

	}

    // event which happens when you click the rectangles
    function goActivityPlan(){

         window.open("drilling1.html","windowDrill","height=800,width=700,left=10,top=10");
    } 

    // event which happens when you click the circles
	function goEngineer(){
		 window.open("radarRsk1.html","windowEng","height=700,width=600,left=900,top=10");
	}

    // event which happens when the cursor is on or out of the rectangles
	function fadeRect(gRect, gLine, opacity, str){

	 	 return function(g,i){
	 	 	 
			 gRect.selectAll("rect")
 	 	 	 		 .filter(function(d){
 	 	 	 		 	return d.name == g.name;
 	 	 	 		 })
 	 	 	 		 .attr("fill", function(w){
 	 	 	 		 	if(str == "over"){
 	 	 	 		 		return "steelblue";
 	 	 	 		 	}else if(str == "out"){
 	 	 	 		 		return "black";
 	 	 	 		 	}
 	 	 	 		 });

 	 		 gLine.selectAll("path")
	 	 	 		 .filter(function(d){
	 	 	 		 	 return d.sourceName != g.name;
	 	 	 		 })
	 	 	 		 .transition()
	 	 	 		 .style("opacity", opacity);

	 	 };

	 }

	// event which happens when the cursor is on or out of the circles
	function fadeRing(gRing, gLine, gRect, opacity, str){

	 	return function(g,i){
	 	 	
	 	 	 gRing.selectAll("circle")
 	 	 	 		 .filter(function(d){
 	 	 	 		 	return d.name == g.name;
 	 	 	 		 })
 	 	 	 		 .attr("fill", function(w){
 	 	 			 	if(str == "over"){
 	 	 	 		 		return "yellow";
 	 	 	 		 	}else if(str == "out"){
 	 	 	 		 		if(w.position == "left") return "#4A4A4A";
 	 	 	 		 		if(w.position == "right") return "white";
 	 	 	 		 	}
 	 	 	 		 });
	 	 	 	 
	 	 	 gLine.selectAll("path")
	 	 	 		 .filter(function(d){
	 	 	 		 	 return d.targetName != g.name;

	 	 	 		 })
	 	 	 		 .transition()
	 	 	 		 .style("opacity", opacity);
	 	 	

	 	 	 gRect.selectAll("rect")
	 	 			 .each(function(d,j){

	 	 			 	for(var i = 0; i < d.targets.length; i++){

	 	 			 		if(d.targets[i] == g.name){

	 	 			 			d3.select(this)
	 	 			 				 .attr("fill", function(w){
	 	 			 					 if(str == "over"){
	 	 			 						 return "steelblue";
	 	 			 					 }else if(str == "out"){
	 	 			 						 return "black";
	 	 			 					 }
	 	 			                 });

	 	 			 		}

	 	 			 	}

	 	 			 });
	 	 			 
	 	};
	}

	// get the infos about how to draw all the rectangles, circles & curves
	function getConceptMap(activity, responsable, engineering, risks, respoMatrix, engMatrix,
				 rskMatrix, origin, padding, long, wide, R, r){

	     var conceptMap = new Array();

		 var planRect = getPlanRect(activity, responsable, engineering, risks, respoMatrix, 
		 	     engMatrix, rskMatrix, origin, padding, long, wide);

		 var center = planRect[0].ringCenter;

		 var ring = getRing(responsable, engineering, risks, center, R, r);
		 var ringRespo = ring[0];
		 var ringEng = ring[1];
		 var ringRsk = ring[2];

		 var numRect = activity.length;
		 var numRespo = responsable.length;
		 var numEng = engineering.length;
		 var numRsk = risks.length;

		 var lineRespo = new Array();
		 var lineEng = new Array();
		 var lineRsk = new Array();

		 // curves
		 for(var i = 0; i < numRect; i++){
		 	// on the left side: responsables
		 	for(var j = 0; j < numRespo; j++){

		 		if(respoMatrix[i][j] == 1){
		 			lineRespo.push({sourceName: planRect[i].name,
		 					 sourceX: planRect[i].x,
		 					 sourceY: planRect[i].y + wide/2,
		 					 targetName: ringRespo[j].name,
		 					 targetX: ringRespo[j].xCenter,
		 					 targetY: ringRespo[j].yCenter,    
		 					 });
		 		}
		 	}

		 	// on the left side: risks
		 	for(var m = 0; m < numRespo; m++){

		 		if(rskMatrix[i][m] == 1){
		 			lineRsk.push({sourceName: planRect[i].name,
		 					 sourceX: planRect[i].x,
		 					 sourceY: planRect[i].y + wide/2,
		 					 targetName: ringRsk[m].name,
		 					 targetX: ringRsk[m].xCenter,
		 					 targetY: ringRsk[m].yCenter,    
		 					 });
		 		}
		 	}

		 	// on the right side: designs & tools
		 	for(var l = 0; l < numEng; l++){

		 		if(engMatrix[i][l] == 1){
		 			lineEng.push({sourceName: planRect[i].name,
		 					 sourceX: planRect[i].x + long,
		 					 sourceY: planRect[i].y + wide/2,
		 					 targetName: ringEng[l].name,
		 					 targetX: ringEng[l].xCenter,
		 					 targetY: ringEng[l].yCenter, 
		 					 });
		 		}
		 	}

		 }

		 conceptMap = [planRect, ringRespo.concat(ringEng), lineRespo.concat(lineEng), 
		 			ringRsk.concat(ringEng), lineRsk.concat(lineEng)];
		 return conceptMap;


	}

	// get the infos about how to draw all the rectangles
	function getPlanRect(activity, responsable, engineering, risks, respoMatrix, engMatrix,
	             rskMatrix, origin, padding, long, wide){

		 var planRect = new Array();
		 var numRect = activity.length;
		 var numRespo = responsable.length;
		 var numEng = engineering.length;
		 var numRsk = risks.length;

		 var ringCenter = [origin[0] + long / 2, 
		 		origin[1] + (wide * numRect + padding * (numRect - 1)) / 2];

		 for(var i = 0; i < numRect; i++){

		 	var resM = new Array();
		 	var engM = new Array();
		 	var rskM = new Array();

		 	for(var j = 0; j < numRespo; j++){
		 		if(respoMatrix[i][j] == 1){
		 			resM.push(responsable[j]);
		 		}
		 	}

		 	for(var k = 0; k < numEng; k++){
		 		if(engMatrix[i][k] == 1){
		 			engM.push(engineering[k]);
		 		}
		 	}

		 	for(var l = 0; l < numRsk; l++){
		 		if(rskMatrix[i][l] == 1){
		 			rskM.push(risks[l]);
		 		}
		 	}

		 	planRect[i] = {name: activity[i],
		 			 x: origin[0],
		 			 y: origin[1] + i * (padding + wide),
		 			 width: wide,
		 			 length: long,
		 			 targets: (resM.concat(engM)).concat(rskM),
		 			 ringCenter: ringCenter
		 			 };

		 }

		 return planRect;

	}

	// get the infos about how to draw all the circles
	function getRing(responsable, engineering, risks, center, R, r){

		 var ring = new Array();

		 var numRespo = responsable.length;
		 var numEng = engineering.length;
		 var numRsk = risks.length;

		 var angleInterRespo = Math.PI / (numRespo + 1);
		 var angleInterEng = Math.PI / (numEng + 1);
		 var angleInterRsk = Math.PI / (numRsk + 1);

		 var engRing = new Array();
		 var respoRing = new Array();
		 var rskRing = new Array();
         
         // on left Ring: responsables
         for(var i = 0; i < numRespo; i++){

         	respoRing[i] = {name: responsable[i],
         		     angle: angleInterRespo * (i + 1),
         			 xCenter: center[0] - R * Math.sin(angleInterRespo * (i + 1)),
         			 yCenter: center[1] - R * Math.cos(angleInterRespo * (i + 1)),
         			 rayon: r,
         			 position: "left"
         			 };

         } 
         
         // on right Ring
         for(var j = 0; j < numEng; j++){

         	engRing[j] = {name: engineering[j],
         			 angle: angleInterEng * (j + 1),
         			 xCenter: center[0] + R * Math.sin(angleInterEng * (j + 1)),
         			 yCenter: center[1] - R * Math.cos(angleInterEng * (j + 1)),
         			 rayon: r,
         			 position: "right"
         			 };

         }

         // on left Ring: risks
         for(var k = 0; k < numRsk; k++){

         	rskRing[k] = {name: risks[k],
         		     angle: angleInterRsk * (k + 1),
         			 xCenter: center[0] - R * Math.sin(angleInterRsk * (k + 1)),
         			 yCenter: center[1] - R * Math.cos(angleInterRsk * (k + 1)),
         			 rayon: r,
         			 position: "left"
         			 };

         } 

         ring = [respoRing, engRing, rskRing];
         return ring;

	}

