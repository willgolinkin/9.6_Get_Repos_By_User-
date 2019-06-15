'use strict';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
  }

function getRepos(handle) {
  const searchUrl = "https://api.github.com/users/";
  const params = {
  sort: "updated"
};
  const options = {
    headers: new Headers({
        //preferred rest API accept header
      "Accept": "application/vnd.github.v3+json"})
  };
  const queryString = formatQueryParams(params);
  const url = searchUrl  + handle + "/repos" + '?' + queryString;
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
      throw new Error(response.statusText);
      }
    })
    .then(responseJson => displayResults(responseJson, handle))
    .catch(err => {
      $('.js-user').empty();
      $('.js-resultList').empty();
      $('.js-results').toggleClass('hidden');
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson, handle) {
  $('.js-error-message').empty();
  $('.js-user').empty();
  $('.js-user').text(handle);
  $('.js-resultList').empty();
  for (let i = 0; i < responseJson.length ; i++){
    $('.js-resultList').append(
      `<li>${responseJson[i].name} - <a target="_new" href="${responseJson[i].html_url}">${responseJson[i].html_url}</a></li>`
    )};
  $('.js-results').removeClass('hidden');
};

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchInput = $('#handle').val();
    getRepos(searchInput);
  });
}

$(function() {
  watchForm();
});