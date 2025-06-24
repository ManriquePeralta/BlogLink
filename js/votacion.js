document.addEventListener('DOMContentLoaded', function () {
  const abrirBtn = document.getElementById('abrirVotacion');
  const modal = document.getElementById('modalVotacion');
  const cerrarBtn = document.getElementById('cerrarVotacion');
  const volverBtn = document.getElementById('volverVotacion');
  const paso1 = document.getElementById('paso1');
  const paso2 = document.getElementById('paso2');
  const tituloTema = document.getElementById('tituloTema');
  const opcionesVoto = document.getElementById('opcionesVoto');
  const formVoto = document.getElementById('formVoto');

  const encuestas = [
    {
      id: 'holan_vs_vaccari',
      pregunta: '¿Quién es mejor DT?',
      opciones: ['Holan', 'Vaccari']
    },
    {
      id: 'top3_boquita',
      pregunta: '¿Es este el top 3 de partidos contra Boquita?',
      opciones: ['Sí, sin dudas', 'No, faltan otros']
    },
    {
      id: 'valor_lomonaco',
      pregunta: '¿Venderías a Loyola o Lomonaco por una oferta de +$15 millones USD?',
      opciones: ['No, los retendría un poco más', 'Sí, es un ingreso necesario']
    }
  ];

  let encuestaActual = null;

  function abrirVotacion() {
    modal.style.display = 'flex';
    paso1.style.display = 'block';
    paso2.style.display = 'none';
  }

  function cerrarVotacion() {
    modal.style.display = 'none';
  }

  function guardarVoto(id, opcion) {
    const votos = JSON.parse(localStorage.getItem(id)) || [0, 0];
    votos[opcion]++;
    localStorage.setItem(id, JSON.stringify(votos));
  }

  function mostrarResultados(id, opciones) {
    const votos = JSON.parse(localStorage.getItem(id)) || [0, 0];
    const total = votos[0] + votos[1];
    const porcentajes = total === 0 ? [0, 0] : votos.map(v => Math.round((v / total) * 100));

    return `
      <p>¡Gracias por votar!</p>
      <div class="resultado">
        <div>${opciones[0]}</div>
        <div class="barra">
          <div class="relleno" style="width:${porcentajes[0]}%">${porcentajes[0]}%</div>
        </div>
      </div>
      <div class="resultado">
        <div>${opciones[1]}</div>
        <div class="barra">
          <div class="relleno" style="width:${porcentajes[1]}%">${porcentajes[1]}%</div>
        </div>
      </div>
      <button id="volverAVotar" class="btn">Volver a votar</button>
    `;
  }

  function cargarEncuesta(id) {
    encuestaActual = encuestas.find(e => e.id === id);
    if (!encuestaActual) return;

    paso1.style.display = 'none';
    paso2.style.display = 'block';
    tituloTema.textContent = encuestaActual.pregunta;

    opcionesVoto.innerHTML = encuestaActual.opciones.map((op, i) => `
      <label>
        <input type="radio" name="opcion" value="${i}"> ${op}
      </label><br>
    `).join('');
  }

  // Botones del paso 1
  document.querySelectorAll('.boton-votar').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      if (id) cargarEncuesta(id);
    });
  });

  // Enviar voto
  formVoto.addEventListener('submit', function (e) {
    e.preventDefault();
    const opcion = formVoto.querySelector('input[name="opcion"]:checked');
    if (!opcion) return alert("Seleccioná una opción antes de votar.");
    guardarVoto(encuestaActual.id, parseInt(opcion.value));
    opcionesVoto.innerHTML = mostrarResultados(encuestaActual.id, encuestaActual.opciones);
  });

  // Volver al paso 1
  volverBtn.addEventListener('click', function () {
    paso1.style.display = 'block';
    paso2.style.display = 'none';
  });

  // Abrir modal
  abrirBtn.addEventListener('click', function (e) {
    e.preventDefault();
    abrirVotacion();
  });

  // Cerrar modal
  cerrarBtn.addEventListener('click', cerrarVotacion);

  // Cerrar al hacer clic fuera del modal
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      cerrarVotacion();
    }
  });

  // Re-votar desde resultados
  opcionesVoto.addEventListener('click', function (e) {
    if (e.target.id === 'volverAVotar') {
      cargarEncuesta(encuestaActual.id);
    }
  });
});
