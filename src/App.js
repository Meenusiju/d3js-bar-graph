import * as d3 from "d3";
//import data from './menu.json';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './fbase'

//append svg 
const svg = d3.select('.canvas')
               .append('svg')
               .attr('height',600)
               .attr('width',600); 

//create margins and svg group
const margin = {'top': 20,
                'bottom': 100,
                'left': 100,
                'right': 20
                }
const graphWidth = 600 - margin.right - margin.left;
const graphHeight = 600 - margin.bottom - margin.top; 

//append svg group
const graph = svg.append('g')
                 .attr('width',graphWidth)
                 .attr('height',graphHeight)
                 .attr('transform', `translate(${margin.left}, ${margin.top})`);

//create x and y axis group
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g');

//get data from firebase
async function menuList() {
  const menuCol = collection(db, 'newmenu');
  const snapshot = await getDocs(menuCol);
  const resultData = snapshot.docs.map(doc => doc.data());

  const y = d3.scaleLinear()
                 .domain([0, d3.max(resultData, d => d.age)])
                 .range([graphHeight,0]);
    //console.log(y(600)); 

  const x = d3.scaleBand()
    .domain(resultData.map(item => item.name))
    .range([0,graphWidth])
    .paddingInner('0.2')
    .paddingOuter('0.2');
   
    //create rects
    const rects = graph.selectAll('rect')
      .data(resultData);
     
      // add attr to already available rect
      rects.attr('height',d => graphHeight - y(d.age))
      .attr('width', x.bandwidth)
      .attr('fill','purple')
      .attr('x',d => x(d.name))
      .attr('y', d => y(d.age));

    // add attr for new virtual dom elements(new rects)
    rects.enter()
    .append('rect')
    .attr('height', d => graphHeight - y(d.age))
    .attr('width',x.bandwidth)
    .attr('fill','purple')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.age));
    
    // call x and y axis
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)
                .ticks(5)
                .tickFormat(d => d + ' years');
    
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

  }
menuList()
     
function App() {
  return (
    <div className = "canvas">
      
    </div>
  );
}
export default App;

