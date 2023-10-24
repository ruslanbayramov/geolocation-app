'use strict';

const btn = document.querySelector('.btn');
const longitude = document.querySelector('.inp-longitude');
const latitude = document.querySelector('.inp-latitude');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  const errorSect = document.querySelector('.error-sect');
  const error = document.querySelector('.err-msg');

  errorSect.insertAdjacentHTML('beforeend', msg);
  errorSect.style.opacity = 1;

  setTimeout(function () {
    errorSect.style.opacity = 0;
  }, 4000);
};

btn.addEventListener('click', function () {
  const latValue = Number(latitude.value);
  const longValue = Number(longitude.value);

  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latValue}&longitude=${longValue}&localityLanguage=en
    `
  )
    .then(response => {
      if (!response.ok)
        throw new Error(
          `<p class = 'err-msg'>Not correct coordinats. Please, try again<p>`
        );

      return response.json();
    })
    .then(data => {
      console.log(data.countryCode);
      return fetch(`https://restcountries.com/v3.1/alpha/${data.countryCode}`);
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data[0];
    })
    .then(country => {
      console.log(country);
      const html = `
      <article class="country">
      <img class="country__img" src="${country.flags.svg}" />
        <div class="country__data">
          <h3 class="country__name">${country.name.common}</h3>
          <h4 class="country__region">${country.region}</h4>
          <p class="country__row"><span>👫</span>${
            +country.population / 1000000 > 1000
              ? `${String(country.population).slice(0, 1)}.${String(
                  country.population
                ).slice(1, 2)} billion`
              : `${parseInt(+country.population / 1000000)} million`
          }</p>
          <p class="country__row"><span>🏛️</span>${country.capital[0]}</p>
          <p class="country__row"><span>📍</span>${country.area} KM</p>
        </div>
    </article>
      `;

      countriesContainer.insertAdjacentHTML('afterbegin', html);
      countriesContainer.style.opacity = '1';
    })
    .catch(err => {
      console.error(`${err}`);
      renderError(`${err.message}`);
    });
});
