import { html, render } from 'lit-html';
import { sistema_votaciones_backend } from 'declarations/sistema_votaciones_backend';

class App {
  state = {
    idINE: '',
    seleccion: { presidente: '', diputado: '', senador: '' },
    mensaje: '',
    mostrarFormularioVoto: false, // Controla la visibilidad del formulario de voto
    candidatos: [],              // Todos los candidatos, cargados una vez
    resultados: []               // Resultados actuales de la votación
  };

  constructor() {
    // Carga los resultados iniciales al cargar la aplicación
    this.#cargarResultados();
    this.#cargarTodosLosCandidatos(); // Carga todos los candidatos para usarlos en el renderizado
  }

  // Carga todos los candidatos al inicio para tenerlos disponibles para los formularios
  async #cargarTodosLosCandidatos() {
    try {
      const [presidentes, diputados, senadores] = await Promise.all([
        sistema_votaciones_backend.getCandidatosPorCargo("Presidente"),
        sistema_votaciones_backend.getCandidatosPorCargo("Diputado"),
        sistema_votaciones_backend.getCandidatosPorCargo("Senador")
      ]);
      this.state.candidatos = [...presidentes, ...diputados, ...senadores];
      this.#render(); // Vuelve a renderizar una vez que los candidatos estén cargados
    } catch (error) {
      console.error("Error al cargar todos los candidatos:", error);
      this.state.mensaje = "Error al cargar los candidatos para la votación.";
      this.#render();
    }
  }

  // Maneja el cambio en el input de IDINE
  #handleIdINEInputChange = (e) => {
    this.state.idINE = e.target.value;
    this.#render();
  };

  // Lógica de verificarVoto adaptada
  #handleVerificarVoto = async (e) => {
    e.preventDefault(); // Previene el envío del formulario HTML
    this.state.mensaje = ''; // Limpiar mensaje anterior
    
    const idINE = this.state.idINE.trim();
    if (!idINE) {
      this.state.mensaje = "Por favor, ingresa tu IDINE.";
      this.#render();
      return;
    }

    try {
      const yaVotoRes = await sistema_votaciones_backend.yaVoto(idINE);

      if (yaVotoRes) {
        this.state.mensaje = "Ya has votado anteriormente.";
        this.state.mostrarFormularioVoto = false; // Oculta el formulario de voto
      } else {
        this.state.mostrarFormularioVoto = true; // Muestra el formulario de voto
        this.state.mensaje = ""; // Limpia cualquier mensaje de verificación
      }
      this.#render();
    } catch (error) {
      console.error("Error al verificar voto:", error);
      this.state.mensaje = "Ocurrió un error al verificar tu IDINE. Intenta de nuevo.";
      this.#render();
    }
  };

  // Lógica de enviarVoto adaptada
  #handleEnviarVoto = async (e) => {
    e.preventDefault(); // Previene el envío del formulario HTML
    this.state.mensaje = ''; // Limpiar mensaje anterior

    const idINE = this.state.idINE.trim();

    if (!this.state.seleccion.presidente || !this.state.seleccion.diputado || !this.state.seleccion.senador) {
      this.state.mensaje = "Debes seleccionar un candidato en cada categoría.";
      this.#render();
      return;
    }

    const votoData = {
      presidente: this.state.seleccion.presidente,
      diputado: this.state.seleccion.diputado,
      senador: this.state.seleccion.senador
    };

    try {
      const resultadoVoto = await sistema_votaciones_backend.votar(idINE, votoData);
      this.state.mensaje = resultadoVoto;
      
      // Si el voto fue exitoso, ocultar formulario y limpiar selección/idINE
      if (resultadoVoto.includes("registrado exitosamente")) {
        this.state.mostrarFormularioVoto = false;
        this.state.idINE = ''; // Limpiar IDINE del input
        this.state.seleccion = { presidente: '', diputado: '', senador: '' }; // Limpiar selección
      }
      
      await this.#cargarResultados(); // Cargar resultados actualizados
      this.#render();

    } catch (error) {
      console.error("Error al enviar voto:", error);
      this.state.mensaje = "Ocurrió un error al registrar tu voto. Intenta de nuevo.";
      this.#render();
    }
  };

  // Lógica de cargarResultados adaptada (ahora un método de la clase)
  async #cargarResultados() {
    try {
      this.state.resultados = await sistema_votaciones_backend.getResultados();
      this.#render(); // Volver a renderizar para mostrar los resultados actualizados
    } catch (error) {
      console.error("Error al cargar resultados:", error);
      this.state.resultados = []; // Limpiar resultados si hay error
      this.state.mensaje = "Error al cargar los resultados de la votación.";
      this.#render();
    }
  }

  // El método #render es el corazón de la UI
  #render() {
    const template = html`
      <div class="container">
        <h1>Sistema de Votaciones ICP</h1>

        <form id="verificacionForm" @submit=${this.#handleVerificarVoto}>
          <label for="idINE">Ingresa tu IDINE:</label>
          <input 
            type="text" 
            id="idINE" 
            name="idINE" 
            .value=${this.state.idINE} 
            @input=${this.#handleIdINEInputChange} 
            required 
            placeholder="Ej: ABC123456789"
          />
          <button type="submit">Verificar</button>
        </form>

        <div id="mensaje" style="color: ${this.state.mensaje.includes('error') || this.state.mensaje.includes('Debes') ? 'red' : 'green'};">
          ${this.state.mensaje}
        </div>

        ${this.state.mostrarFormularioVoto ? html`
          <form id="formularioVoto" @submit=${this.#handleEnviarVoto}>
            <h2>Vota por tus candidatos</h2>
            
            <div class="candidatos-rubros"> <div class="rubro-candidatos"> <strong>Presidente:</strong>
                <div id="presidentes" class="candidatos scrollable-list">
                  ${this.#renderCandidatosPorCargo('Presidente', 'presidente')}
                </div>
              </div>
              
              <div class="rubro-candidatos"> <strong>Diputado:</strong>
                <div id="diputados" class="candidatos scrollable-list">
                  ${this.#renderCandidatosPorCargo('Diputado', 'diputado')}
                </div>
              </div>
              
              <div class="rubro-candidatos"> <strong>Senador:</strong>
                <div id="senadores" class="candidatos scrollable-list">
                  ${this.#renderCandidatosPorCargo('Senador', 'senador')}
                </div>
              </div>
            </div> <button type="submit">Votar</button>
          </form>
        ` : ''}

        <section id="resultados">
          <h2>Resultados</h2>
          ${this.#renderResultadosTabla()}
        </section>
      </div>
    `;
    render(template, document.getElementById('root'));
  }

  // Adapta la lógica de cargarCandidatosParaCargo para renderizado Lit-HTML
  #renderCandidatosPorCargo(cargo, tipo) {
    const candidatosDelCargo = this.state.candidatos.filter(c => c.cargo === cargo);
    return candidatosDelCargo.map(candidato => html`
      <div class="candidato-item"> <label>
          <input 
            type="radio" 
            name=${tipo} 
            value=${candidato.id} 
            @change=${(e) => { 
              this.state.seleccion = { ...this.state.seleccion, [tipo]: e.target.value };
              this.#render(); // Importante para actualizar el checked state
            }} 
            ?checked=${this.state.seleccion[tipo] === candidato.id}
          />
          ${candidato.nombre} (${candidato.partido})
        </label>
        </div>
    `);
  }

  // Adapta la lógica de renderizarResultados para renderizado Lit-HTML
  #renderResultadosTabla() {
    if (this.state.resultados.length === 0) {
      return html`<p>No hay resultados de votación disponibles.</p>`;
    }

    const resultadosPorCargo = {
      'Presidente': [], 'Diputado': [], 'Senador': []
    };

    this.state.resultados.forEach(c => {
      if (resultadosPorCargo[c.cargo]) {
        resultadosPorCargo[c.cargo].push(c);
      }
    });

    return html`
      ${Object.keys(resultadosPorCargo).map(cargo => {
        const candidatosDelCargo = resultadosPorCargo[cargo].sort((a, b) => Number(b.votos) - Number(a.votos));
        return html`
          <h3>${cargo}</h3>
          <table>
            <thead>
              <tr><th>Candidato</th><th>Partido</th><th>Votos</th></tr>
            </thead>
            <tbody>
              ${candidatosDelCargo.map(c => html`
                <tr>
                  <td>(${c.id}) ${c.nombre} </td>
                  <td>${c.partido}</td>
                  <td>${c.votos.toString()}</td>
                </tr>
              `)}
            </tbody>
          </table>
        `;
      })}
    `;
  }
}

export default App;
