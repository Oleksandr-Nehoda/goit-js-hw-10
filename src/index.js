import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}
refs.input.addEventListener('input', onRenderCountry);

function onRenderCountry (event) {
    const inputValue = event.currentTarget.value;

    if (inputValue.length > 0) {
        fetchCountries(inputValue);
    }
}



function fetchCountries(name) {
    fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then(respons => {
       return respons.json();
    }).then(renderCountry);
}



function renderCountry (array) {
    if (array.length > 10){
        console.log(`"Too many matches found. Please enter a more specific name."`)
        refs.countryInfo.innerHTML= '';
        refs.countryList.innerHTML= '';
    } else if(array.length > 1){
        refs.countryInfo.innerHTML= '';
    array.map((object) => {
        const name = object.name.official;
        const flag = object.flags.svg;
        const markup = ` <li class="country-item">
        <img class="country-flag" src="${flag}" alt="Flag country ${name}" width = 70 height = 50>
        <p class="country-name">${name}</p>
      </li>`;
      refs.countryList.insertAdjacentHTML('beforeend', markup);
    })
    } else if(array.length === 1){
        refs.countryList.innerHTML= '';
        const object = array[0];
        const name = object.name.official;
        const capital = object.capital[0];
        const population = object.population;
        const flag = object.flags.svg;
        const languages = (Object.values(object.languages)).join(', ');
        const markup = `<img src="${flag}" alt="Flag country ${name}" width = 70 height = 50>
        <h1 class="country-title">${name}</h1>
        <p class="text-info"><span class="text-info--blod">Capital: </span>${capital}</p>
        <p class="text-info"><span class="text-info--blod">Population: </span>${population}</p>
        <p class="text-info"><span class="text-info--blod">Languages: </span>${languages}</p>`;
        refs.countryInfo.insertAdjacentHTML('beforeend', markup);
    }  else {
        refs.countryInfo.innerHTML= '';
        refs.countryList.innerHTML= '';
        console.log(`"Oops, there is no country with that name"`);
    }
    
}

