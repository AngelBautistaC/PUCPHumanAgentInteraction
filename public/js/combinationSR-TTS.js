const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const synth = window.speechSynthesis;
let numero_pregunta =0;
let voices = [];
window.voices = voices
function populateVoiceList() {
    voices = synth.getVoices();
}

populateVoiceList();


let pregunta = ["¿Te gusta el sushi?", "¿Te gusta el color rosa?","¿Eres o no eres?","¿Te gusta bing?"]

window.populatevoice = populateVoiceList;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let comenzar_hablar = document.getElementById("convertirVoz");

let estado = "preguntando_nombre";
let nombre = "";

let respuestas_positivas = ["sí","si","claro","por supuesto","me gusta mucho","me encanta","me fascina","me enloquece"];
let respuestas_negativas = ["no","no lo entiendo","lo detesto","lo odio", "me aburre", "me estresa", "no me gusta"];

let comentario_positivo = ["genial","excelente","a mi también","Que onda wey","¡Fantástico!","¡Estupendo!"];
let comentario_negativo = ["oh, que pena","ni modo", "es una lástima","¿Cómo es posible?","entiendo"];

let empezar_recognition  = () =>{
  recognition.start();
}

comenzar_hablar.onclick = () => {
    populateVoiceList();
    comenzar_hablar.disabled = true;
    hacer_hablar_pc("hola mi nombre es agente uno ¿Cuál es tu nombre?",empezar_recognition);
};

  
  recognition.onresult = (event) => {
    let comando_recibido = event.results[0][0].transcript;

    switch(estado){
      case "preguntando_nombre":
        let palabras = comando_recibido.split(" ");
        let nombre = palabras[palabras.length-1];
        hacer_hablar_pc("hola "+nombre + " ¿Te gusta el curso de interacción humano agente?",empezar_recognition);

        estado = "respuesta_a_la_pregunta";
      break;
      case "respuesta_a_la_pregunta":
        comando_recibido = comando_recibido.toLowerCase();
        let positivo = respuestas_positivas.map((valor)=>comando_recibido.includes(valor))
        let negativo = respuestas_negativas.map((valor)=>comando_recibido.includes(valor))
        let resultado_positivo = false;
        let resultado_negativo = false;

        positivo.map((valor)=>resultado_positivo=resultado_positivo  || valor)
        negativo.map((valor)=>resultado_negativo=resultado_negativo  || valor)
        
        
        let pregunta_actual = pregunta[numero_pregunta]
        
        if(resultado_negativo)  
          setTimeout(()=>{
            let comentario = comentario_negativo[Math.floor(Math.random()*comentario_negativo.length)]
            hacer_hablar_pc(comentario,()=>hacer_hablar_pc(pregunta_actual,empezar_recognition))
          },2000);

        if(resultado_positivo)
        setTimeout(()=>{
          let comentario = comentario_positivo[Math.floor(Math.random()*comentario_positivo.length)]
            hacer_hablar_pc(comentario,()=>hacer_hablar_pc(pregunta_actual,empezar_recognition));
          },2000);
        numero_pregunta++;
      break;
      default:
          console.log("No estado");
      break;


    }



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

  function hacer_hablar_pc(text,callback){
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.audioDestination = audioprocess.mediastreamdestination.stream;

    for (const voice of voices) {
        if (voice.name === "Google español") {
          utterThis.voice = voice;
        }
      }
    utterThis.pitch = 1.0;
    utterThis.rate = 1.0;
    synth.speak(utterThis); 
    utterThis.onend = () =>{callback()};


  }