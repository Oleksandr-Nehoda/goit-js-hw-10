import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import API from './fetchCountries';
// ______________________________________________________________Spiner

import {Spinner} from 'spin.js';
import "spin.js/spin.css";

var opts = {
    lines: 10, // The number of lines to draw
  length: 20, // The length of each line
  width: 6, // The line thickness
  radius: 9, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000000', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    top: '90%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    zIndex: 2000000000, // The z-index (defaults to 2e9)
    className: 'spinner', // The CSS class to assign to the spinner
    position: 'relativ', // Element positioning
  };
  
//   var target = document.getElementById('foo');
//   var spinner = new Spinner(opts).spin();


// setTimeout (() => {
//     spinner.stop();
// },1000); 
  

// ______________________________________________________________

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

// var spinner = new Spinner(opts).spin(refs.countryList);


// setTimeout (() => {
//     spinner.stop();
// },1000); 
  
refs.input.addEventListener('input', debounce(onRenderCountry, DEBOUNCE_DELAY));

function onRenderCountry (event) {
  
    const inputValue = (event.target.value).trim();

    if (inputValue.length > 0) {

        spinner = new Spinner(opts).spin(refs.countryList);
       return API.fetchCountries(inputValue).then(renderCountry)
       .catch(() => {
        // spinner.stop();
        notificationFeil()
        deleteCountryInfo();
        deleteCountryList()
    });
    }
}

function renderCountry (array) {
    if (array.length > 10){
        // spinner.stop();
        notificationInfo();
        deleteCountryInfo();
        deleteCountryList();
    } else if(array.length > 1){
        // spinner.stop();
        deleteCountryInfo();
        deleteCountryList();
    array.map(({name, flags}) => {
        const nameCountry = name.official;
        const flag = flags.svg;
      refs.countryList.insertAdjacentHTML('beforeend', makeMarkupCountryList(nameCountry, flag));
    })
    } else if(array.length === 1){
        // spinner.stop();
        deleteCountryList();
        const object = array[0];
        const {name, capital, population, flags, languages} = object;
        const nameCountry = name.official;
        const capitalCountry = capital[0];
        const populationCountry = population;
        const flag = flags.svg;
        const language = (Object.values(languages)).join(', ');
        refs.countryInfo.innerHTML =  makeMarkupCountryInfo(nameCountry, flag, capitalCountry, populationCountry, language);
    } 
    
}

function notificationInfo () {
    return Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    }

function notificationFeil () {
    return Notiflix.Notify.failure("Oops, there is no country with that name");
    }

function deleteCountryList () {
  return refs.countryList.innerHTML= '';
}

function deleteCountryInfo () {
   return refs.countryInfo.innerHTML= '';
}

function makeMarkupCountryList (nameCountry, flag) {
    return `<li class="country-item">
    <img class="country-flag" src="${flag}" alt="Flag country ${nameCountry}" width = 70 height = 50>
    <p class="country-name">${nameCountry}</p>
  </li>`; 
}

function makeMarkupCountryInfo (nameCountry, flag, capitalCountry, populationCountry, language) {
   
    return `<img src="${flag}" alt="Flag country ${nameCountry}" width = 70 height = 50>
    <h1 class="country-title">${nameCountry}</h1>
    <p class="text-info"><span class="text-info--blod">Capital: </span>${capitalCountry}</p>
    <p class="text-info"><span class="text-info--blod">Population: </span>${populationCountry}</p>
    <p class="text-info"><span class="text-info--blod">Languages: </span>${language}</p>`; 
}


// Тренувальний код____________________________________________________

