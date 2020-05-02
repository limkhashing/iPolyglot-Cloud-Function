const functions = require('firebase-functions');
const algoliaSearch = require('algoliasearch');
const alQuranIndexName= 'al_quran'

const APP_ID = functions.config().algolia_dev.app;
const ADMIN_KEY = functions.config().algolia_dev.key;
const algoliaClient = algoliaSearch(APP_ID, ADMIN_KEY);

const alQuranIndex = algoliaClient.initIndex(alQuranIndexName);

const HONG_KONG_REGION = "asia-east2"

exports.addToAlQuranIndex = functions.region(HONG_KONG_REGION).firestore.document(alQuranIndexName+'/{AlQuranChapters}')
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id
        return alQuranIndex.addObject({ ...data, objectID})
    }
);

exports.updateAlQuranIndex = functions.region(HONG_KONG_REGION).firestore.document(alQuranIndexName+'/{AlQuranChapters}')
    .onUpdate((change) => {
        const newData = change.after.data()
        const objectID = change.after.id
        return alQuranIndex.saveObject({...newData, objectID})
    }
);

exports.deleteFromAlQuranIndex = functions.region(HONG_KONG_REGION).firestore.document(alQuranIndexName+'/{AlQuranChapters}')
    .onDelete(snapshot => {
        alQuranIndex.deleteObject(snapshot.id)
    }
);