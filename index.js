'use strict';

/* example of formatQueryParams function:

const params = {
    q: "tesla",
    language: "en"
};

const queryItems = Object.keys(params) // [q, language]
    .map(key => `${key}=${params[key]}`) // ['q=tesla', 'language=en']
    return queryItems.join('&'); // 'q=tesla&language=en'

*/

function formatQueryParams(params) {
    //create an array of the keys in the "params" object
    const queryItems = Object.keys(params)
        //for each of the keys in that array, create a string 
        //with the key and the key's value in the "params" object
        .map(key => `${key}=${params[key]}`)
    //return a string of the keys and values, separated by "&"
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
    //create the query string to be added to URL endpoint using function
    const queryString = formatQueryParams(params);
    //create a string with the original URL and the new parameters
    const url = searchUrl  + handle + "/repos" + '?' + queryString;
    //log new url to console with user and query string added
    console.log(url);
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
        //is this saying that all of these things occur if there is an error?
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
            //use GET in Postman or DevTools Network to understand the response and what keys to query
            `<li>${responseJson[i].name} - <a target="_new" href="${responseJson[i].html_url}">${responseJson[i].html_url}</a></li>`
        )};
        console.log(responseJson);
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