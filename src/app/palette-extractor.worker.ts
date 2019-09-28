/// <reference lib="webworker" />

addEventListener('message', ({ data:pixels }) => {
  var colors = [];

  for(let i = 0; i < pixels.length; i += 4){
    const r = pixels[i],
          g = pixels[i + 1],
          b = pixels[i + 2];

    if(!colors.find(c => c.r === r && c.g === g && c.b === b)){
      colors.push({r,g,b});
    }
  }

  postMessage(colors);
});
