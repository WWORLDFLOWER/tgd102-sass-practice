console.log('webpack ok');

import $ from 'jquery';
import {gsap} from 'gsap';
import '../sass/style.scss';

$('body').css('background-color' , 'red');
gsap.to('.box', {
    x: 400,
    y: 200,
    duration: .9,
    rotation: 270,
    scale: 2,
    backgroundColor : '#333',
    borderRadius: '50%',
    repeat: -1,
    yoyo: true
})