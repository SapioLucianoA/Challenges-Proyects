import {calculateScroll, MAX_FRAMES} from './const.js';

let totalForScroll = calculateScroll();

const moto = document.querySelector('#moto');



window.addEventListener('resize', ()=>{
  //calcular de vuelta el totalForScroll

  totalForScroll = calculateScroll();


})

window.addEventListener('scroll', ()=>{
  //scroll actual"

  let scrollActual = window.scrollY; 
 

  //porcentaje de scroll

  let porcentajeScroll = scrollActual / totalForScroll;

  //QUE FRAME DEL BRUM BRUM LE TOCA

  const frame = Math.floor(porcentajeScroll * MAX_FRAMES) || 1;


  let id = frame.toString().padStart(3, '0');


  moto.src  = `../resources/frames/moto-${id}.webp`;

})

