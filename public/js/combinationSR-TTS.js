const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const synth = window.speechSynthesis;

let voices = [];
window.voices = voices
function populateVoiceList() {
    voices = synth.getVoices();
}
populateVoiceList();

window.populatevoice = populateVoiceList;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let comenzar_hablar = document.getElementById("convertirVoz");

comenzar_hablar.onclick = () => {
    recognition.start();
  };

  
  recognition.onresult = (event) => {
    let comando_recibido = event.results[0][0].transcript;

    setTimeout(()=>{hacer_hablar_pc(comando_recibido),2000});

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

  function hacer_hablar_pc(text){
    const utterThis = new SpeechSynthesisUtterance(text);
    console.log(voices)
    for (const voice of voices) {
        console.log(voice)
        if (voice.name === "Google español") {
          utterThis.voice = voice;
          console.log(voice);
        }
      }
    utterThis.pitch = 1.0;
    utterThis.rate = 1.0;
    synth.speak(utterThis); 
  }