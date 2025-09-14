// index.js für Alexa Skill "SmartMic Küche"
const Alexa = require('ask-sdk-core');

// Hilfsfunktionen
function getSlotValue(handlerInput, slotName) {
    const slot = Alexa.getSlot(handlerInput.requestEnvelope, slotName);
    return slot && slot.value ? slot.value : null;
}


const MusikSteuernIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MusikSteuernIntent';
    },
    handle(handlerInput) {
        const { titel, zeit, lautstaerke, bass, action } = handlerInput.requestEnvelope.request.intent.slots;
        let speakOutput = 'Okay, ich steuere die Musik. ';

        if (titel && titel.value) {
            speakOutput = `Ich spiele den Titel ${titel.value}.`;
        } else if (zeit && zeit.value) {
            speakOutput = `Ich springe zu Minute ${zeit.value}.`;
        } else if (lautstaerke && lautstaerke.value) {
            speakOutput = `Ich stelle die Lautstärke auf ${lautstaerke.value}.`;
        } else if (bass && bass.value) {
            speakOutput = `Ich ändere den Bass auf ${bass.value}.`;
        } else if (action && action.value) {
            speakOutput = `Musik ${action.value}.`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};


const HerdSteuernIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HerdSteuernIntent';
    },
    handle(handlerInput) {
        const { herdStufe, action } = handlerInput.requestEnvelope.request.intent.slots;
        let speakOutput = 'Okay, ich steuere den Herd. ';

        if (herdStufe && herdStufe.value) {
            speakOutput = `Ich stelle den Herd auf Stufe ${herdStufe.value}.`;
        } else if (action && action.value) {
            speakOutput = `Ich schalte den Herd ${action.value}.`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const DunstabzugSteuernIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DunstabzugSteuernIntent';
    },
    handle(handlerInput) {
        const action = getSlotValue(handlerInput, 'action');
        const stufe = getSlotValue(handlerInput, 'stufe');
        let speakOutput = '';

        if (stufe) {
            speakOutput = `Die Rauchabzugsvorrichtung wird auf Stufe ${stufe} gestellt.`;
            // here we would have to implement the actual API call/SmartMic integration to set the fan speed
        } else if (action) {
            if (action === 'ein' || action === 'an' || action === 'auf' || action === 'einschalten') {
                speakOutput = 'Die Rauchabzugsvorrichtung wird eingeschaltet.';
                // here we would have to implement the actual API call/SmartMic integration to turn on the fan
            } else if (action === 'aus' || action === 'ausschalten') {
                speakOutput = 'Die Rauchabzugsvorrichtung wird ausgeschaltet.';
                // here we would have to implement the actual API call/SmartMic integration to turn off the fan
            } else {
                speakOutput = 'Ich habe nicht verstanden, was du mit der Rauchabzugsvorrichtung machen möchtest.';
            }
        } else {
            speakOutput = 'Bitte sage mir, wie ich die Rauchabzugsvorrichtung steuern soll.';
        }

        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};

const LichtSteuernIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LichtSteuernIntent';
    },
    handle(handlerInput) {
        const action = getSlotValue(handlerInput, 'action');
        const id = getSlotValue(handlerInput, 'id');
        const farbe = getSlotValue(handlerInput, 'farbe');
        const helligkeit = getSlotValue(handlerInput, 'helligkeit');
        let speakOutput = '';

        if (action && id) {
            if (action === 'ein' || action === 'an' || action === 'einschalten') {
                speakOutput = `Licht ${id} wird eingeschaltet.`;
                // here we would have to implement the actual API call/SmartMic integration to turn on the light
            } else if (action === 'aus' || action === 'ausschalten') {
                speakOutput = `Licht ${id} wird ausgeschaltet.`;
                // here we would have to implement the actual API call/SmartMic integration to turn off the light
            }
        } else if (farbe && id) {
            speakOutput = `Licht ${id} wird auf die Farbe ${farbe} gesetzt.`;
            // here we would have to implement the actual API call/SmartMic integration to change the color
        } else if (helligkeit && id) {
            speakOutput = `Licht ${id} wird auf ${helligkeit} Prozent Helligkeit gestellt.`;
            // here we would have to implement the actual API call/SmartMic integration to change the brightness
        } else {
            speakOutput = 'Bitte gib an, welches Licht du steuern möchtest und wie.';
        }

        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput =
            'Mit diesem Skill kannst du den Dunstabzug und die Beleuchtung in deiner Küche steuern. Zum Beispiel: "Schalte die Rauchabzugsvorrichtung ein" oder "Stelle das Licht 1 auf Blau".';

        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent')
        );
    },
    handle(handlerInput) {
        const speakOutput = 'Auf Wiedersehen!';
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput =
            'Willkommen bei Smart Mic! Mit diesem Skill kannst du per Sprache den Dunstabzug und das Licht in deiner Küche steuern. Sage zum Beispiel: schalte das Licht an, oder: stelle die Lüftung auf Stufe zwei.';
        return handlerInput.responseBuilder.speak(speakOutput).reprompt('Was möchtest du steuern?').getResponse();
    },
};

const FallbackHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Das habe ich leider nicht verstanden. Bitte versuche es erneut.';
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};

// WHEN ADDING NEW INTENTS, MAKE SURE TO ADD THEM TO THE exports.handler BELOW!!
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler, MusikSteuernIntentHandler, HerdSteuernIntentHandler, DunstabzugSteuernIntentHandler, LichtSteuernIntentHandler, HelpIntentHandler, CancelAndStopIntentHandler, FallbackHandler)
    .lambda();