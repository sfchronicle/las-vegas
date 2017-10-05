require("./lib/social"); //Do not delete
var d3 = require('d3');

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var sf_lat = 15;
  var sf_long = -100;
  var zoom_deg = 2.5;

  var offset_top = $(window).height();
  var bottomOffset = 200;

} else {
  var sf_lat = 43;
  var sf_long = -118.5;
  var zoom_deg = 4;

  var offset_top = $(window).height()/4;
  var bottomOffset = 200;
}

console.log(offset_top);

var timeTimeout = 10;

// tooltip information
function tooltip_function (d) {
  var html_str = "<div class='name'>"+d["City Or County"]+", "+d["State"]+"</div><div class='killed-count'>"+d.Killed+" Killed</div><div class='injured-count'>"+d.Injured+" Injured</div>"
  return html_str;
}

// function that zooms and pans the data when the map zooms and pans
function update() {
	circles.attr("transform",
	function(d) {
		return "translate("+
			map.latLngToLayerPoint(d.LatLng).x +","+
			map.latLngToLayerPoint(d.LatLng).y +")";
		}
	)
}

// initialize map with center position and zoom levels
var map = L.map("map", {
  // minZoom: 4,
  maxZoom: 16,
  zoomControl: false,
}).setView([sf_lat,sf_long], zoom_deg);;

// add tiles to the map
var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cj8bybgjo6muo2rpu8r43ur4z/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
mapLayer.addTo(map);


// dragging and zooming controls
map.scrollWheelZoom.disable();
// map.dragging.disable();
map.touchZoom.disable();
// map.doubleClickZoom.disable();
map.keyboard.disable();

// initializing the svg layer
L.svg().addTo(map);
// map._initPathRoot();

L.control.zoom({
     position:'bottomright'
}).addTo(map);

// creating Lat/Lon objects that d3 is expecting
shootingsData.forEach(function(d,idx) {
	d.LatLng = new L.LatLng(d.Lat,
							d.Lng);
});

var svg = d3.select("#map").select("svg"),
g = svg.append("g");

// draw map with dots on it
// var drawMap = function(current_event) {

	// d3.select("svg").selectAll("circle").remove();
	var svg = d3.select("#map").select("svg");//,
	g = svg.append("g");

  console.log(shootingsData);

  var circles = g.selectAll("g")
    .data(shootingsData)
    .enter()
    .append("g");

  // adding circles to the map
  circles.append("circle")
    .attr("class",function(d) {
      console.log("thing");
      var class_str = "dot Total";
      if (d.Killed > 0){
        class_str += " Killed"
      }
      if (d.Injured > 0){
        class_str += " Injured"
      }
      if (d.Killed == 0 && d.Injured == 0){
        class_str += " NotHurt"
      }
      if (d.Killed == 59) {
        class_str += " LasVegas"
      }
      if (d.Killed == 3) {
        class_str += " Kansas"
      }
      return class_str;
    })
    .style("opacity","0.6")
    .style("fill", function(d) {
      if (d.Killed == 0 && d.Injured == 0){
        return "#C64FB8";
      } else if (d.Injured > 0) {
        return "#FDE74C";
      }
    })
    .style("stroke","#696969")
    .attr("r", function(d) {
      if (d.Killed == 0 && d.Injured == 0){
        return 7;
      } else if (d.Injured > 0){
        return (d.Killed + d.Injured)/15+10;
      } else {
        return 0;
      }
    })
    .on('mouseover', function(d) {
      console.log("mouseover");
      var html_str = tooltip_function(d);
      tooltip.html(html_str);
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      if (screen.width <= 480) {
        return tooltip
          .style("top",(d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX/4+20)+"px");
          // .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
          // .style("left",10+"px");
      } else if (screen.width <= 1024) {
        console.log("mid");
        return tooltip
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-50)+"px");
      } else {
        return tooltip
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-50)+"px");
      }
    })
    .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
    });

  circles.append("circle")
    .attr("class",function(d) {
      var class_str = "dot Total";
      if (d.Killed > 0){
        class_str += " Killed"
      }
      if (d.Killed == 59) {
        class_str += " LasVegas"
      }
      if (d.Killed == 3) {
        class_str += " Kansas"
      }
      return class_str;
    })
    .style("opacity","0.6")
    .style("fill", function(d) {
      return "#ec1c24";
    })
    .style("stroke","#696969")
    .attr("r", function(d) {
      if (d.Killed > 0){
        return (d.Killed)/5+7;
      } else {
        return 0;
      }
    })
    .on('mouseover', function(d) {
      console.log("mouseover");
      var html_str = tooltip_function(d);;
      tooltip.html(html_str);
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      if (screen.width <= 480) {
        return tooltip
          .style("top",(d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX/4+20)+"px");
          // .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
          // .style("left",10+"px");
      } else if (screen.width <= 1024) {
        console.log("mid");
        return tooltip
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-50)+"px");
      } else {
        return tooltip
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-50)+"px");
      }
    })
    .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
    });



  map.on("viewreset", update);
  update();

  map.on("zoom",update)

  // show tooltip
  var tooltip = d3.select("div.tooltip-map");

// }

// drawMap(shootingsData,"Total");

var zoomingButton = document.getElementsByClassName("leaflet-control-zoom")[0];
zoomingButton.addEventListener("click", function(e) {
  console.log("click");
  update();
});

// initial variable, which indicates that map is on landing on load
var prevmapIDX = -1;

// set up scrolling timeout
var scrollTimer = null;
$(window).scroll(function () {
    document.getElementById("tooltip").style.visibility = "hidden";
    if (scrollTimer) {
        clearTimeout(scrollTimer);   // clear any previous pending timer
    }
    scrollTimer = setTimeout(handleScroll, timeTimeout);   // set new timer
});

// function for updating with scroll
function handleScroll() {

  scrollTimer = null;

  // figure out where the top of the page is, and also the top and beginning of the map content
  var pos = $(this).scrollTop();
  var pos_map_top = $('#bottom-of-top').offset().top;
  var pos_map_bottom = $('#top-of-bottom').offset().top-bottomOffset;

  // show the landing of the page if the reader is at the top
  if (pos < pos_map_top){
    var prevmapIDX = -1;
    $(".dot").css({opacity: 0.6})

  // show the appropriate dots if the reader is in the middle of the page
  } else if (pos < pos_map_bottom){

    var currentIDX = -1;
    categoryData.forEach(function(cat,catIDX) {
      var pos_map = $('#mapevent'+catIDX).offset().top-offset_top;
      if (pos > pos_map) {
        currentIDX = Math.max(catIDX,currentIDX);
      }
    });
    if (currentIDX > -1){
      $(".dot").css({opacity: 0})
      $("."+categoryData[+currentIDX]["Key"]).css({opacity: 0.6})
      if (categoryData[+currentIDX]["Key"] != "LasVegas" && categoryData[+currentIDX]["Key"] != "Total") {
        $(".LasVegas").css({opacity: 0});
      }
    }
  }
}
