import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce(onRenderCountry, DEBOUNCE_DELAY));

function onRenderCountry (event) {
  
    const inputValue = (event.target.value).trim();

    if (inputValue.length > 0) {
       return API.fetchCountries(inputValue).then(renderCountry)
       .catch(() => {
        notificationFeil()
        deleteCountryInfo();
        deleteCountryList()
    });
    }
}

function renderCountry (array) {
    if (array.length > 10){
        notificationInfo();
        deleteCountryInfo();
        deleteCountryList();
    } else if(array.length > 1){
        deleteCountryInfo();
        deleteCountryList();
    array.map(({name, flags}) => {
        const nameCountry = name.official;
        const flag = flags.svg;
      refs.countryList.insertAdjacentHTML('beforeend', makeMarkupCountryList(nameCountry, flag));
    })
    } else if(array.length === 1){
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