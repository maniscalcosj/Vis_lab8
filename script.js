/* load the data */
d3.csv("driving.csv", d3.autoType).then(data => {
  console.log("data", data);
  
  /* position function for labels */
  function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "end");
        break;
    }
  }
  
  /* halo function to add white glow */
  function halo(text) {
  text
    .select(function() {
      return this.parentNode.insertBefore(this.cloneNode(true), this);
    })
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 4)
    .attr("stroke-linejoin", "round");
  }

  /* create SVG with margin convention */
  const margin = {top: 20, right: 20, bottom: 20, left: 50};
  const width = 1000 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3.select('.plot').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  /* create x and y scales */
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data.map(d => d.miles)))
    .range([0, width])
    .nice();

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data.map(d => d.gas)))
    .range([height, 0])
    .nice();
  
  /* generate axes */
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format(",.0f"));
  
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.format("$.3r")); 

  const xGroup = svg.append("g")
    .attr("class","xAxis")
    .attr("transform",`translate(0, ${height})`)
    .call(xAxis);
  
  /* remove domain line of x-axis */
  xGroup.call(xAxis)
    .call(g => g.select(".domain").remove());
  
  /* add grid lines extending up from x-axis */
  xGroup.selectAll(".tick line")
    .clone()
    .attr("y2", -height)
    .attr("stroke-opacity", 0.1); // make it transparent
  
  /* add x-axis title */
  svg.append("g")
    .call(g =>
          g.append("text")
            .attr('x', width * 0.78)
            .attr('y', height * 0.99)    
          .text("Miles per person per year")
            .attr("font-weight", "bold")
          .call(halo)
    );
  
  const yGroup = svg.append("g")
    .attr("class","yAxis")
    .call(yAxis);
  
  /* remove domain line of y-axis */
  yGroup.call(yAxis)
    .call(g => g.select(".domain").remove());
  
  /* add grid lines extending right from y-axis */
  yGroup.selectAll(".tick line")
    .clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.1); // make it transparent
  
  /* add y-axis title */
  svg.append("g")
    .call(g =>
          g.append("text")
            .attr('x', width * 0.01)
            .attr('y', height * 0.03)    
          .text("Cost per gallon")
            .attr("font-weight", "bold")
          .call(halo)
    );
  
  /* define line path generator (before cirlces so behind) */
  const line = d3.line()
    .x(d => xScale(d.miles))
    .y(d => yScale(d.gas));

  /* create path */
  const path = svg.append("path")
    .datum(data)
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "black");
  
  /* add circles for data points */
  const circles = svg.selectAll(".circle")
    .data(data)
    .join(
      enter => enter.append("circle")
        .attr("class", "circle")
        .attr("cx", d => xScale(d.miles))
        .attr("cy", d => yScale(d.gas))
        .attr("r", 8)
        //.attr("fill", "white")
        .attr("fill", "#0A5591")
        .attr("stroke", "black")
    );
  
  /* generate data point labels */
  const dataLabels = svg.selectAll(".dataLabel")
    .data(data)
    .join(
      enter => enter.append("text")
        .attr("class", "dataLabel")
        .attr("x", d => xScale(d.miles))
        .attr("y", d => yScale(d.gas))
        .text(d => d.year)
    )
    .each(position)
    .call(halo);
  
})