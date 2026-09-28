/* Piecewise constant speed along one level route. Times are model seconds, not wall-clock seconds. */
export const presets={
 graph:{label:'Move, stop, move faster',points:[[0,0],[10,20],[20,20],[30,60]],task:'Sketch a prediction for the whole journey. Explain the stop and compare the two moving sections.'},
 average:{label:'Include the stop',points:[[0,0],[10,30],[20,30],[40,60]],task:'Calculate the average speed for your selected interval. For the whole journey, explain why the stopped time belongs.'},
 practice:{label:'A different journey',points:[[0,0],[10,10],[20,10],[30,40]],task:'Sketch the graph. Explain the stationary section and identify the fastest section using equal times.'}
};
export function distanceAt(points,t){if(t<=points[0][0])return points[0][1];for(let i=1;i<points.length;i++){const [end,d]=points[i],[start,s]=points[i-1];if(t<=end)return s+(d-s)*(t-start)/(end-start);}return points.at(-1)[1];}
export function interval(points,index){const start=index<0?points[0]:points[index],end=index<0?points.at(-1):points[index+1];return {start,end,distance:end[1]-start[1],time:end[0]-start[0],speed:(end[1]-start[1])/(end[0]-start[0])};}
export function fmt(x){return Number(x.toFixed(3)).toString();}
