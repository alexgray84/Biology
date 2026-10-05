window.BioDiagrams={render(name,state={}){const f=D[name];return f?f(state):'';}};
const N='#182944',G='#a08542',R='#944832',B='#254d78',GR='#2e6b4a';
const svg=(label,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 320" role="img" aria-label="${label}">${body}</svg>`;
const hex=(cx,cy,r)=>{let p=[];for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6;p.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1));}return p.join(' ');};
const virus=(cx,cy,r,empty)=>`<polygon points="${hex(cx,cy,r)}" fill="#bcd0e4" stroke="${N}" stroke-width="3"/>${empty?'':`<path d="M${cx-r*.5} ${cy}q${r*.18} ${-r*.5} ${r*.33} 0t${r*.33} 0t${r*.33} 0" fill="none" stroke="${G}" stroke-width="4"/>`}`;
const arrow=(x1,y1,x2,y2,c=N)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="3" marker-end="url(#ah)"/>`;
const defs=`<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="${N}"/></marker></defs>`;
const host=(dash)=>`<ellipse cx="385" cy="170" rx="165" ry="125" fill="#f3e6c8" stroke="${N}" stroke-width="3" ${dash?'stroke-dasharray="9 7"':''}/><circle cx="420" cy="190" r="34" fill="#dccb9f" stroke="${N}" stroke-width="2"/>`;
const T=(x,y,t,c=N,a='middle',s=21)=>`<text x="${x}" y="${y}" text-anchor="${a}" font-size="${s}" font-weight="650" fill="${c}">${t}</text>`;
const D={
virus(s){const k=s.step||0;let b=defs+host(k===5);
 const labels=['A virus: no cell','1 Attaches','2 Genetic material enters','3 Host machinery builds parts','4 New viruses assemble','5 New viruses leave'];
 if(k===0){b+=virus(120,170,62)+T(120,262,'Not a cell')+arrow(210,60,150,128)+T(215,48,'Protein coat (capsid)',N,'start',19)+arrow(20,300,95,178,R)+T(14,296,'Genetic material',R,'start',19)+T(385,40,'Host cell',N,'middle',22);}
 if(k===1){b+=virus(228,170,40)+T(385,40,'Host cell');}
 if(k===2){b+=virus(210,170,34,true)+'<path d="M262 170q12-22 24 0t24 0t24 0" fill="none" stroke="'+G+'" stroke-width="4"/>'+arrow(228,215,270,185,G)+T(385,40,'Host cell');}
 if(k===3){let q='';[[330,130],[380,230],[460,120],[470,230],[330,210]].forEach((c,i)=>{q+=i%2?`<rect x="${c[0]-12}" y="${c[1]-12}" width="24" height="24" fill="#bcd0e4" stroke="${N}" stroke-width="2"/>`:`<path d="M${c[0]-18} ${c[1]}q9-18 18 0t18 0" fill="none" stroke="${G}" stroke-width="4"/>`;});b+=q+T(385,40,'Host cell')+T(280,305,'Parts made by the host',N,'middle',19);}
 if(k===4){b+=virus(330,150,28)+virus(440,130,28)+virus(400,235,28)+T(385,40,'Host cell');}
 if(k===5){b+=virus(500,70,26)+virus(520,170,26)+virus(500,265,26)+arrow(430,110,470,80,R)+arrow(450,175,486,172,R)+arrow(430,230,470,258,R)+T(340,170,'Damaged',R,'middle',22)+T(340,198,'host cell',R,'middle',22);}
 return svg('Virus reproduction step '+(k+1)+' of 6: '+labels[k],b);},
size(s){const items=[[80,7,'Virus','about 0.1 µm'],[230,18,'Bacterium','about 2 µm'],[385,30,'Red blood cell','about 7 µm'],[545,54,'Plant cell','about 100 µm']];
 let b='<line x1="20" y1="230" x2="620" y2="230" stroke="'+N+'" stroke-width="2"/>';
 items.forEach(([x,r,n,sz],i)=>{b+=`<circle cx="${x}" cy="${230-r}" r="${r}" fill="${i===0?'#bcd0e4':'#f3e6c8'}" stroke="${N}" stroke-width="3"/>`+T(x,264,n,N,'middle',22)+T(x,292,sz,'#43506b','middle',20);});
 b+=T(320,40,'Circle sizes are stretched, not true scale','#43506b','middle',20);
 return svg('Viruses compared with a bacterium, a red blood cell and a plant cell, drawn on a stretched scale',b).replace('0 0 560 320','0 0 640 320');}
};
