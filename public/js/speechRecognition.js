const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const colors = [ 'aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', /* … */ ];
const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(' | ')};`

const recognition = new SpeechRecognition();
window.recognition = recognition;
const speechRecognitionList = new SpeechGrammarList();
window.speechRecognitionList = speechRecognitionList;
speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const diagnostic = document.querySelector('.output');
const bg = document.querySelector('html');
const hints = document.getElementById('hints');

let colorHTML = '';
colors.forEach((color, i) => {
  console.log(color, i);
  colorHTML += `<span style="background-color:${color};"> ${color} </span>`;
});
console.log(hints.innerText);
hints.innerHTML = `Tap or click then say a color to change the background color of the app. Try ${colorHTML}.`;

document.body.onclick = () => {
  recognition.start();
  console.log('Ready to receive a color command.');
};

recognition.onresult = (event) => {
  console.log(event);
    let color = event.results[0][0].transcript;
    color = color.toLowerCase().replace(/\./g, '')
    if (color.includes("azul"))
        color = "blue";
    else if(color.includes("rosa"))
        color = "pink";
    else if(color.includes("verde"))
        color = "green";

    diagnostic.textContent = `Result received: ${color}.`;
    bg.style.backgroundColor = color;
    console.log(`Confidence: ${event.results[0][0].confidence}`);
  }

  recognition.onspeechend = () => {
    recognition.stop();
  }

  recognition.onnomatch = (event) => {
    diagnostic.textContent = "I didn't recognize that color.";
  }

  recognition.onerror = (event) => {
    console.log('Speech recognition error detected: ' + event.error);
    console.log('Additional information: ' + event.message);
  }