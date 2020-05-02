const alQuranFunctions = require('./al_quran');
const hadithFunctions = require('./hadith');
const dialogflow = require('./dialogflow');
// const dialogflow = require('./test_dialogflow');

exports.addToAlQuranIndex = alQuranFunctions.addToAlQuranIndex;
exports.updateAlQuranIndex = alQuranFunctions.updateAlQuranIndex;
exports.deleteFromAlQuranIndex = alQuranFunctions.deleteFromAlQuranIndex;

exports.addToHadithIndex = hadithFunctions.addToHadithIndex;
exports.updateHadithIndex = hadithFunctions.updateHadithIndex;
exports.deleteFromHadithIndex = hadithFunctions.deleteFromHadithIndex;

exports.onDialogflowFulfillment = dialogflow.fulfillment
