
// Pure numerical core. Horizontal applied forces; fixed mass; no hidden resistance.
export function resultant(forces){return forces.reduce((sum,f)=>sum+f,0);}
export function advance(state,dt,force,mass=2){const a=force/mass;return {t:state.t+dt,x:state.x+state.v*dt+0.5*a*dt*dt,v:state.v+a*dt};}
export function direction(value){return Math.abs(value)<1e-8?'no direction':value>0?'right':'left';}
export function forceText(value){return Math.abs(value)<1e-8?'0 N':`${Math.abs(value).toFixed(1).replace(/\.0$/,'')} N ${direction(value)}`;}
