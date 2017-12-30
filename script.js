var bubbles = [];
var maxBubbles = 60;
var minBubbles = 50;
var minAge = 10000;
var maxAge = 30000;
var minRadius = 1;
var maxRadius = 5;

var vb = {
  x: -800,
  y: -450,
  w: 1600,
  h: 900
}

var is_bubbling = false;

var root = null;

window.onload = function() {
  
  root = document.getElementById('root-svg');

  var cursor = document.getElementById('bg-clip-circle');
  var cursorShadow = document.getElementById('clip-circle-shadow');

  window.addEventListener('mousemove', function(evt) {
    var xFactor = evt.clientX/root.clientWidth;
    var yFactor = evt.clientY/root.clientHeight;

    cursor.setAttribute('cx', evt.clientX);
    cursor.setAttribute('cy', evt.clientY);
    cursorShadow.setAttribute('cx', evt.clientX);
    cursorShadow.setAttribute('cy', evt.clientY);
  });
  

  //Bubble(-800, -450, 1600, 900);
};

window.onclick = function () {
  is_bubbling = !is_bubbling;
  var w = root.clientWidth;
  var h = root.clientHeight;
  if (is_bubbling) Bubble(0, 0, w, h);
};

function Bubble(x, y, width, height) {

  is_bubbling = true;
  var then = Date.now();

  function theLoop() {

    //console.log('tick');

    if (!is_bubbling) return;

    if (bubbles.length < minBubbles) {
      for (var i = 0; i < maxBubbles-bubbles.length; i++) {
        bubbles.push({
          name: dirtyId(8),
          x: /*i*10*/Math.random()*width+x,
          y: /*i*10*/Math.random()*height+y,
          birth: Date.now(),
          death: Math.random()*(maxAge-minAge)+minAge,
          speed: Math.random()*10+5,
          die: false
        });
      }
    }

    var now = Date.now();
    var gap = now-then;
    //var rootSvg = document.getElementById('root-svg');

    bubbles.forEach(function(d, i) {
      let elm = document.querySelector('#bubble-'+d.name);
      if (elm===null) {
        elm = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        elm.setAttribute('id', 'bubble-'+d.name);
        elm.setAttribute('class', 'bubble');
        
        //elm.setAttribute('fill', 'white');
        elm.setAttribute('stroke', 'none');

        var starfield = root.querySelector('#starfield');
        starfield.appendChild(elm);

      }

      var age = now-d.birth;

      if (age >= d.death) {
        d.die = true;
        elm.remove();
      }

      if (!d.die) {
        d.x -= d.speed*(gap/1000);
        d.y -= d.speed*(gap/1000);

        elm.setAttribute('opacity', (d.speed-5)/10);

        elm.setAttribute('r', (age/maxAge)*(maxRadius-minRadius)+minRadius);

        elm.setAttribute('cx', d.x);
        elm.setAttribute('cy', d.y);
      }

      then = now;

    });

    bubbles = bubbles.filter(function(d) {return !d.die});

    setTimeout(function(){
      requestAnimationFrame(theLoop);
    }, 50);
  }

  requestAnimationFrame(theLoop);

}

function quickId() {
  return  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function dirtyId(length) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var id = "";
  
  for (var i=0; i < length; i++) {
    var char = chars[Math.floor(Math.random()*chars.length)];
    id += char;
  }

  return id;
}