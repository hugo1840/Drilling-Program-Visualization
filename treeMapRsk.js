function treeMap(){
	
	// define the svg
	var div1 = d3.select("body")
		         .append("div")
		 		 .attr("class", "div")
		         .attr("id", "rskTree");

    var width = 600;
	var height = 600;	
	var treeSvg = d3.select("#rskTree")
					 .append("svg")
					 .attr("width",width)
					 .attr("height",height);
						
	var padding = {top: 50, right: 20, bottom: 20, left: 50 };

	// title for the histogram
	var title = treeSvg.selectAll(".treeTitle")
	                 .data([{title: "Possible Strategies for this Type of Risk"}])
					 .enter()
					 .append("text")
					 .attr("fill","black")
					 .attr("font-size","12px")
					 .attr("text-anchor","middle")
					 .attr("x", padding.left - 30)
					 .attr("y", padding.top)
					 .attr("dx", width/2)
					 .attr("dy","-1em")
					 .text(function(d){
					       return d.title;
					 });

	// display the tree map
	treeSvg.selectAll(".solutionTree")
		    	 .data([{tree: "Solution"}])
		    	 .enter()
		    	 .append("image")
		    	 .attr("xlink:href", "img/treeMapRsk.png")
		    	 .attr("x", padding.left)
		    	 .attr("y", padding.top)
		    	 .attr("width", 500)
		  		 .attr("height", 500);
		    	 //.on("click", function(d){
		    	 //	 window.open(d.link,"window_Rsk","height=800,width=1400,left=200,top=10");
		    	 //});

}