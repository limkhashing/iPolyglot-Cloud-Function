'use strict';

// static text
const HONG_KONG_REGION = "asia-east2";
const INDEX_NAME = 'al_quran';
const INTENT_NAME = 'Search Al-Quran';

// imports
const functions = require('firebase-functions');
const {
    dialogflow,
    SimpleResponse
} = require('actions-on-google');

// algolia
const algoliaSearch = require('algoliasearch');
const APP_ID = functions.config().algolia_dev.app;
const ADMIN_KEY = functions.config().algolia_dev.key;
const algoliaClient = algoliaSearch(APP_ID, ADMIN_KEY);
const alQuranIndex = algoliaClient.initIndex(INDEX_NAME);

const app = dialogflow();

app.intent(INTENT_NAME, conv => {

    let queryText = conv.body.queryResult.queryText

    return new Promise(function (resolve, reject) {
        alQuranIndex.search(queryText)
            .then(function (res) {
                if (res.hits === undefined || res.hits.length == 0) {
                    let errorResponse = "Sorry, I couldn't find the text in Al-Quran, can you please try with other words?"
                    conv.ask(new SimpleResponse({
                        text: errorResponse,
                        speech: errorResponse,
                    }));
                    resolve()
                    return
                }

                let hit = {
                    "chapter": res.hits[0].chapter,
                    "verse": res.hits[0].verse,
                    "meaning": res.hits[0].meaning,
                    "translation": res.hits[0].translation
                }
                // if (hit.chapter )
                let text = "Chapter " + hit.chapter + ", Verse " + hit.verse + 
                "\n Meaning: " + hit.meaning + "\n Translation: " + hit.translation

                let speech = "Found. It appear at Chapter " + hit.chapter + " Verse " + hit.verse + 
                ". The meaning is " + hit.meaning + " and the translation is " + hit.translation + ". Please continue to speak and I'll search it"

                conv.ask(new SimpleResponse({
                    text: text,
                    speech: speech
                }));
                resolve()
            })
            .catch(function (err) {
                console.error(err);
            });
    })
})

exports.fulfillment = functions.region(HONG_KONG_REGION).https.onRequest(app);
