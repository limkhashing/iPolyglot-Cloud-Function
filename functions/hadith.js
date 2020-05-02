const functions = require('firebase-functions');
const algoliaSearch = require('algoliasearch');
const hadithIndexName= 'hadith'

const APP_ID = functions.config().algolia_dev.app;
const ADMIN_KEY = functions.config().algolia_dev.key;
const algoliaClient = algoliaSearch(APP_ID, ADMIN_KEY);

const hadithIndex = algoliaClient.initIndex(hadithIndexName);

const HONG_KONG_REGION = "asia-east2"

exports.addToHadithIndex = functions.region(HONG_KONG_REGION).firestore.document(hadithIndexName+'/{hadithChapters}')
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = parseInt(snapshot.id)
        return hadithIndex.addObject({ ...data, objectID})
    }
);

exports.updateHadithIndex = functions.region(HONG_KONG_REGION).firestore.document(hadithIndexName+'/{hadithChapters}')
    .onUpdate((change) => {
        const newData = change.after.data()
        const objectID = parseInt(change.after.id)
        return hadithIndex.saveObject({...newData, objectID})
    }
);

exports.deleteFromHadithIndex = functions.region(HONG_KONG_REGION).firestore.document(hadithIndexName+'/{hadithChapters}')
    .onDelete(snapshot => {
        hadithIndex.deleteObject(snapshot.id)
    }
);