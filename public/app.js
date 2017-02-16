
(function(){
    
  // Inicia o firebase Firebase
  var config = {
    apiKey: "AIzaSyA9qTYW2_ruMJj3i-NVF1mGJPjSaNeko7k",
    authDomain: "sensoriamento-iot-bootcamp.firebaseapp.com",
    databaseURL: "https://sensoriamento-iot-bootcamp.firebaseio.com",
    storageBucket: "sensoriamento-iot-bootcamp.appspot.com",
    messagingSenderId: "1055433905603"
  };
  firebase.initializeApp(config);

  var db = firebase.database();

  // Cria os listeners dos dados no firebase
  var tempRef = db.ref('temperature');
  var umidRef = db.ref('humidity');
  var presenceRef = db.ref('presence');
  var lampRef = db.ref('lamp');


  // Registra as funções que atualizam os gráficos e dados atuais da telemetria
  tempRef.on('value', onNewData('currentTemp', 'tempLineChart' , 'Temperatura', 'C°'));
  umidRef.on('value', onNewData('currentUmid', 'umidLineChart' , 'Umidade', '%'));


  // Registrar função ao alterar valor de presença
  presenceRef.on('value', function(snapshot){
    var value = snapshot.val();
    var el = document.getElementById('currentPresence')
    if(value){
      el.classList.add('green-text');
    }else{
      el.classList.remove('green-text');
    }
  });

  // Registrar função ao alterar valor da lampada
  var currentLampValue = false;
  lampRef.on('value', function(snapshot){
    var value = snapshot.val();
    var el = document.getElementById('currentLamp')
    if(value){
      el.classList.add('amber-text');
    }else{
      el.classList.remove('amber-text');
    }
    currentLampValue = !!value;
  });

  // Registrar função de click no botão de lampada
  var btnLamp = document.getElementById('btn-lamp');
  btnLamp.addEventListener('click', function(evt){
    lampRef.set(!currentLampValue);
  });

})();


// Retorna uma função que de acordo com as mudanças dos dados
// Atualiza o valor atual do elemento, com a metrica passada (currentValueEl e metric)
// e monta o gráfico com os dados e descrição do tipo de dados (chartEl, label)
function onNewData(currentValueEl, chartEl, label, metric){
  return function(snapshot){
    var readings = snapshot.val();
    if(readings){
        var currentValue;
        var data = [];
        for(var key in readings){
          currentValue = readings[key]
          data.push(currentValue);
        }

        document.getElementById(currentValueEl).innerText = currentValue + ' ' + metric;
        buildLineChart(chartEl, label, data);
    }
  }
}

// Constroi um gráfico de linha no elemento (el) com a descrição (label) e os
// dados passados (data)
function buildLineChart(el, label, data){
  var elNode = document.getElementById(el);
  new Chart(elNode, {
    type: 'line',
    data: {
        labels: new Array(data.length).fill(""),
        datasets: [{
            label: label,
            data: data,
            borderWidth: 1,
            fill: false,
            spanGaps: false,
            lineTension: 0.1,
            backgroundColor: "#F9A825",
            borderColor: "#F9A825"
        }]
    }
  });
}
