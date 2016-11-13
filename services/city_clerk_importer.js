const path = require('path');
const request = require('request');
const himalaya = require('himalaya');
const _ = require('underscore');

const Event = require('../models/no-sql/event');
const { adapt, adapt1 } = require('semicoroutine');
const requestAsync = adapt(request);

const createEvents = adapt1(Event.create.bind(Event));

const baseUrl = 'https://chicago.councilmatic.org/';



function* getSearchResults() {
    let x = yield requestAsync('https://chicago.councilmatic.org/search/?selected_facets=topics_exact%3AZoning+Reclassification&selected_facets=inferred_status_exact%3AActive&max_results=2');

    let resBody = x[1];
    let resBodyObj = himalaya.parse(resBody);
    let html= _.filter(resBodyObj, (element) => {
        return element.tagName === 'html';
    });

    let bodyTags = _.filter(html[0].children, (element) => {
        return element.tagName === 'body';
    });

    let [divWithMeetings] = _.filter(bodyTags[0].children, (el)=> {
        return el.attributes &&
            el.attributes.className &&
            el.attributes.className.length === 1 &&
            el.attributes.className[0]  === 'container-fluid'
    });

    let results =  divWithMeetings.children.length && divWithMeetings.children[1];
    results =  results.children.length && results.children[1];

    let mainBody = results.children[3]; //TODO unhard code all this crap
    let searchResults = mainBody.children[3].children; //sm-8

    let elementsWithLink = _.filter(searchResults, (r)=> {
        return r.tagName && r.tagName === 'p';
    });

    let links = [];
    _.each(elementsWithLink,  e=> {
         if (!e.children) return;

        for (let child of e.children) {
            if(child.tagName === 'a')
                links.push(child.attributes.href)
        }
    });

    let events = yield links.map(l=> createEventFromUrl(l));
    yield createEvents(events);
}

function* createEventFromUrl(url) {
    let legislationUrl = `${baseUrl}${url}`;
    console.log(`Processing ${legislationUrl}`);

    let pageData = yield requestAsync(legislationUrl);
    let event = new Event();
    event.url = legislationUrl;
        event.created= new Date();
    let pageHtml = pageData[1];

    console.log('...')
    let resBodyObj = himalaya.parse(pageHtml);
    let [html] = _.filter(resBodyObj, (element) => {
        return element.tagName === 'html';
    });

    let [body] = _.filter(html.children, (element) => {
        return element.tagName === 'body';
    });

    let validElements = _.filter(body.children, k=> {
        return !k.tagName || (k.tagName && k.tagName !== 'script');
    });

    let usefulData = validElements[3].children[1].children[3]; // this just works, // desc & link to, & address
    let objectWithDescription = usefulData.children[1].children[1].children[0];
    let objectWithLink = usefulData.children[1].children[3].children[1];
    let objectWithAddress = usefulData.children[1].children[15].children[1].children[0].children[0];


    event.address = objectWithAddress.content.trim();
    event.description = objectWithDescription.content.trim();
    event.cityClerkLink = objectWithLink.attributes.href.trim();


    console.log(`Completed processing ${legislationUrl}`);
    return event;
}



module.exports = {
    getSearchResults,
    createEventFromUrl
}




