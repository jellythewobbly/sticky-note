// Shorten DOM actions
const elementId = id => document.getElementById(id);
const appendMain = element => elementId('main').appendChild(element);
const create = element => document.createElement(element);
