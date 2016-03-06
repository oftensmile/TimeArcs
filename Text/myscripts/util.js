var diameter = 1000,
    radius = diameter / 2,
    innerRadius = radius - 120;

  // Add color legend
function drawColorLegend() {
      var xx = 6;
      var y1 = 20;
      var y2 = 34;
      var y3 = 48;
      var y4 = 62;
      var rr = 6;

      
      svg.append("circle")
        .attr("class", "nodeLegend")
        .attr("cx", xx)
        .attr("cy", y1)
        .attr("r", rr)
        .style("fill", "#00aa00");
      
      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx+10)
        .attr("y", y1+1)
        .text("Person")
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#00aa00");
   
      svg.append("circle")
        .attr("class", "nodeLegend")
        .attr("cx", xx)
        .attr("cy", y2)
        .attr("r", rr)
        .style("fill", "#cc0000");  

      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx+10)
        .attr("y", y2+1)
        .text("Location")
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#cc0000");  

       svg.append("circle")
        .attr("class", "nodeLegend")
        .attr("cx", xx)
        .attr("cy", y3)
        .attr("r", rr)
        .style("fill", "#0000cc");  

      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx+10)
        .attr("y", y3+1)
        .text("Organization")
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#0000cc");  
        
       svg.append("circle")
        .attr("class", "nodeLegend")
        .attr("cx", xx)
        .attr("cy", y4)
        .attr("r", rr)
        .style("fill", "#aaaa00");  

      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx+10)
        .attr("y", y4+1)
        .text("Miscellaneous")
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#aaaa00");     

      // number of input terms  
      svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx-6)
        .attr("y", y4+20)
        .text(numberInputTerms+" terms of "+ data.length +" blogs" )
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("text-anchor", "left")
        .style("fill", "#000000");       
}

function removeColorLegend() {
 svg.selectAll(".nodeLegend").remove();
}

function drawTimeLegend() {
  for (var i=minYear; i<maxYear;i++){
    var xx = xStep+xScale((i-minYear)*12);
    svg.append("line")
      .style("stroke", "#00a")
      .style("stroke-dasharray", ("1, 2"))
      .style("stroke-opacity", 1)
      .style("stroke-width", 0.2)
      .attr("x1", function(d){ return xx; })
      .attr("x2", function(d){ return xx; })
      .attr("y1", function(d){ return 0; })
      .attr("y2", function(d){ return height; });
     svg.append("text")
      .style("fill", "#000000")   
      .style("text-anchor","start")
      .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
      .attr("x", xx)
      .attr("y", height-4)
      .attr("dy", ".21em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .text(function(d) { return i });  
  }
}  



function getColor(category, count) {
  var minSat = 80;
  var maxSat = 180;
  var percent = count/maxCount[category];
  var sat = minSat+Math.round(percent*(maxSat-minSat));
 
  if (category=="person")
    return "rgb("+sat+", "+255+", "+sat+")" ; // leaf node
  else if (category=="location")
    return "rgb("+255+", "+sat+", "+sat+")" ; // leaf node
  else if (category=="organization")
    return "rgb("+sat+", "+sat+", "+255+")" ; // leaf node
  else if (category=="miscellaneous")
    return "rgb("+(215)+", "+(215)+", "+(sat)+")" ; // leaf node
  else
    return "#000000";
   
}

function colorFaded(d) {
  var minSat = 80;
  var maxSat = 230;
  var step = (maxSat-minSat)/maxDepth;
  var sat = Math.round(maxSat-d.depth*step);
 
  //console.log("maxDepth = "+maxDepth+"  sat="+sat+" d.depth = "+d.depth+" step="+step);
  return d._children ? "rgb("+sat+", "+sat+", "+sat+")"  // collapsed package
    : d.children ? "rgb("+sat+", "+sat+", "+sat+")" // expanded package
    : "#aaaacc"; // leaf node
}


function getBranchingAngle1(radius3, numChild) {
  if (numChild<=2){
    return Math.pow(radius3,2);
  }  
  else
    return Math.pow(radius3,1);
 } 

function getRadius(d) {
 // console.log("scaleCircle = "+scaleCircle +" scaleRadius="+scaleRadius);
return d._children ? scaleCircle*Math.pow(d.childCount1, scaleRadius)// collapsed package
      : d.children ? scaleCircle*Math.pow(d.childCount1, scaleRadius) // expanded package
      : scaleCircle;
     // : 1; // leaf node
}


function childCount1(level, n) {
    count = 0;
    if(n.children && n.children.length > 0) {
      count += n.children.length;
      n.children.forEach(function(d) {
        count += childCount1(level + 1, d);
      });
      n.childCount1 = count;
    }
    else{
       n.childCount1 = 0;
    }
    return count;
};

function childCount2(level, n) {
    var arr = [];
    if(n.children && n.children.length > 0) {
      n.children.forEach(function(d) {
        arr.push(d);
      });
    }
    arr.sort(function(a,b) { return parseFloat(a.childCount1) - parseFloat(b.childCount1) } );
    var arr2 = [];
    arr.forEach(function(d, i) {
        d.order1 = i;
        arr2.splice(arr2.length/2,0, d);
    });
    arr2.forEach(function(d, i) {
        d.order2 = i;
        childCount2(level + 1, d);
        d.idDFS = nodeDFSCount++;   // this set DFS id for nodes
    });

};

d3.select(self.frameElement).style("height", diameter + "px");

/*
function tick(event) {
  link_selection.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; }); 
  var force_influence = 0.9;
  node_selection
    .each(function(d) {
      d.x += (d.treeX - d.x) * (force_influence); //*event.alpha;
      d.y += (d.treeY - d.y) * (force_influence); //*event.alpha;
    });
 // circles.attr("cx", function(d) { return d.x; })
  //    .attr("cy", function(d) { return d.y; });  
  
}*/


// Toggle children on click.
function click(d) {

}

/*
function collide(alpha) {
  var quadtree = d3.geom.quadtree(tree_nodes);
  return function(d) {
    quadtree.visit(function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== d) && (quad.point !== d.parent) && (quad.point.parent !== d)) {
         var rb = getRadius(d) + getRadius(quad.point),
        nx1 = d.x - rb,
        nx2 = d.x + rb,
        ny1 = d.y - rb,
        ny2 = d.y + rb;

        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y);
          if (l < rb) {
          l = (l - rb) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}
*/
