document
  .getElementById("boton-registrar")
  .addEventListener("click", function () {
    const loginForm = document.getElementById("formulario-login");
    const formContainer = document.getElementById("contenedor-formulario");

    loginForm.style.display = "none";

    formContainer.innerHTML = `
        <h2>Registro de Usuario</h2>
        <input type="email" id="email" placeholder="Correo Electrónico" required>
        <input type="password" id="contrasena" placeholder="Contraseña" required>
        <button id="registrar-usuario-boton">Registrar</button>
        <button class="cancelar" id="cancelar-boton-registrar">Cancelar</button>
    `;
    formContainer.style.display = "block";

    const returnToLogin = () => {
      formContainer.style.display = "none";
      loginForm.style.display = "block";
    };

    document.getElementById("registrar-usuario-boton").onclick =
      async function () {
        const email = document.getElementById("email").value;
        const contrasena = document.getElementById("contrasena").value;
        try {
          const response = await fetch(
            "http://localhost:8080/usuarios/registrar-usuario",
            {
              headers: { "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify({ email, contrasena }),
            }
          );
          if (!response.ok) throw new Error("Error en el registro");
          alert("Registro exitoso");
          returnToLogin();
        } catch (error) {
          console.error("Error:", error);
          alert("Hubo un problema al registrar");
        }
      };

    document.getElementById("cancelar-boton-registrar").onclick = returnToLogin;
  });

document
  .getElementById("boton-iniciar-sesion")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    const email = document.querySelector(
      '#formulario-login input[type="email"]'
    ).value;
    const contrasena = document.querySelector(
      '#formulario-login input[type="password"]'
    ).value;

    try {
      const response = await fetch(
        "http://localhost:8080/usuarios/iniciar-sesion",
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ email, contrasena }),
        }
      );
      if (!response.ok) throw new Error("Error en el inicio de sesión");
      document.getElementById("contenedor-login").style.display = "none";
      document.getElementById("contenedor-aplicacion").style.display = "block";
      mostrarContenido("reportes");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al iniciar sesión");
    }
  });

document.querySelectorAll(".icono").forEach((item) => {
  item.addEventListener("click", (event) => {
    document.querySelectorAll(".icono").forEach((icono) => {
      icono.classList.remove("activo");
    });

    item.classList.add("activo");

    document.querySelectorAll("#area-contenido > div").forEach((contenido) => {
      contenido.style.display = "none";
    });
  });
});

document.getElementById("reportes").addEventListener("click", function () {
  mostrarContenido("reportes");
});

document.getElementById("campos").addEventListener("click", function () {
  mostrarContenido("campos");
});

document.getElementById("inventarios").addEventListener("click", function () {
  mostrarContenido("inventarios");
});

function mostrarContenido(section) {
  const contenidoArea = document.getElementById("area-contenido");
  const contenedorAgregarBotones = document.getElementById("agregar-botones");

  if (section === "reportes") {
    contenidoArea.innerHTML = `
            <div class="header">
                <h1>Reportes</h1>
                <div>
                    <button id="boton-semillas" class="boton-toggle activo">Semillas</button>
                    <button id="boton-granos" class="boton-toggle">Granos</button>
                </div>
            </div>
            <canvas id="grafico-comparativo"></canvas>
            <div id="contenedor-graficos" class="contenedor-canvas"></div>`;
    crearGraficos("semillas");
    contenedorAgregarBotones.style.display = "none";
  } else if (section === "campos") {
    contenidoArea.innerHTML = `
            <div class="header">
                <h1>Campos</h1>
            </div>
            <div id="map"></div>`;
    inicializarMapa();
    contenedorAgregarBotones.style.display = "none";
  } else if (section === "inventarios") {
    contenidoArea.innerHTML = `
            <div class="header">
                <h1>Inventarios</h1>
                <div>
                    <button id="boton-semillas" class="boton-toggle activo">Semillas</button>
                    <button id="boton-granos" class="boton-toggle">Granos</button>
                </div>
            </div>
            <div id="inventarios-contenido"></div>`;
    contenedorAgregarBotones.style.display = "block";
    mostrarInventarios("semillas");
  }
}

async function mostrarInventarios(tipo) {
  const inventarioscontenido = document.getElementById("inventarios-contenido");
  const botonAgregarSemillas = document.getElementById("agregar-semillas");
  const botonAgregarGranos = document.getElementById("agregar-granos");

  if (tipo === "semillas") {
    inventarioscontenido.innerHTML = `
            <table id="tabla-semillas">
                <thead>
                    <tr>
                        <th>Semilla</th>
                        <th>Variedad</th>
                        <th>Cantidad Disponible</th>
                        <th>Fecha Adquisición</th>
                        <th>Fecha Expiración</th>
                        <th>Proveedor</th>
                    </tr>
                </thead>
                <tbody>
                    ${await fetch(`http://localhost:8080/inventarios/semillas`)
                      .then((r) => r.json())
                      .then((r) => r.results)
                      .then((semillas) =>
                        semillas
                          .map(
                            (semilla) => `
                        <tr>
                            <td>${semilla.nombre}</td>
                            <td>${semilla.variedad}</td>
                            <td>${semilla.cantidad}</td>
                            <td>${semilla.fechaAdquisicion}</td>
                            <td>${semilla.fechaExpiracion}</td>
                            <td>${semilla.proveedor}</td>
                        </tr>
                    `
                          )
                          .join("")
                      )}
                </tbody>
            </table>`;
    botonAgregarSemillas.style.display = "block";
    botonAgregarGranos.style.display = "none";
    document.getElementById("boton-semillas").classList.add("activo");
    document.getElementById("boton-granos").classList.remove("activo");
  } else {
    inventarioscontenido.innerHTML = `
            <table id="tabla-granos">
                <thead>
                    <tr>
                        <th>Grano</th>
                        <th>Variedad</th>
                        <th>Cantidad Almacenada</th>
                        <th>Fecha Cosecha</th>
                        <th>Lugar de Almacenamiento</th>
                        <th>Calidad</th>
                    </tr>
                </thead>
                <tbody>
                    ${await fetch(`http://localhost:8080/inventarios/granos`)
                      .then((r) => r.json())
                      .then((r) => r.results)
                      .then((granos) =>
                        granos
                          .map(
                            (grano) => `
                        <tr>
                            <td>${grano.nombre}</td>
                            <td>${grano.variedad}</td>
                            <td>${grano.cantidad}</td>
                            <td>${grano.fechaCosecha}</td>
                            <td>${grano.ubicacionAlmacenamiento}</td>
                            <td>${grano.calidad}</td>
                        </tr>
                    `
                          )
                          .join("")
                      )}
                </tbody>
            </table>`;
    botonAgregarSemillas.style.display = "none";
    botonAgregarGranos.style.display = "block";
    document.getElementById("boton-granos").classList.add("activo");
    document.getElementById("boton-semillas").classList.remove("activo");
  }

  botonAgregarSemillas.onclick = function () {
    registrarInventario("semillas");
  };

  botonAgregarGranos.onclick = function () {
    registrarInventario("granos");
  };

  document.getElementById("boton-semillas").onclick = function () {
    mostrarInventarios("semillas");
  };
  document.getElementById("boton-granos").onclick = function () {
    mostrarInventarios("granos");
  };
}

function registrarInventario(tipo) {
  const formContainer = document.getElementById("contenedor-formulario");
  let formContent = "";
  let endpoint = "";

  if (tipo === "semillas") {
    endpoint = "http://localhost:8080/inventarios/semillas";
    formContent = `
            <h2>Registro de Semillas</h2>
            <p>Semilla</p>
            <input type="text" id="nombre" required>
            <p>Variedad</p>
            <input type="text" id="variedad" required>
            <p>Cantidad</p>
            <input type="number" id="cantidad" required>
            <p>Fecha de Adquisición</p>
            <input type="date" id="fechaAdquisicion" required>
            <p>Fecha de Expiración</p>
            <input type="date" id="fechaExpiracion" required>
            <p>Proveedor</p>
            <input type="text" id="proveedor" required>
            <button id="registrar-inventario-boton">Registrar</button>
            <button class="cancelar" id="cancelar-boton">Cancelar</button>
        `;
  } else if (tipo === "granos") {
    endpoint = "http://localhost:8080/inventarios/granos";
    formContent = `
            <h2>Registro de Granos</h2>
            <p>Grano</p>
            <input type="text" id="nombre" required>
            <p>Variedad</p>
            <input type="text" id="variedad" required>
            <p>Cantidad</p>
            <input type="number" id="cantidad" required>
            <p>Fecha de Cosecha</p>
            <input type="date" id="fechaCosecha" required>
            <p>Lugar de Almacenamiento</p>
            <input type="text" id="lugarAlmacenamiento" required>
            <p>Calidad</p>
            <input type="text" id="calidad" required>
            <button id="registrar-inventario-boton">Registrar</button>
            <button class="cancelar" id="cancelar-boton">Cancelar</button>
        `;
  }

  formContainer.innerHTML = formContent;
  formContainer.style.display = "block";

  document.getElementById("registrar-inventario-boton").onclick =
    async function () {
      const nombre = document.getElementById("nombre").value;
      const variedad = document.getElementById("variedad").value;
      const cantidad = parseFloat(document.getElementById("cantidad").value);
      let data = { nombre, variedad, cantidad };

      if (tipo === "semillas") {
        data.fechaAdquisicion =
          document.getElementById("fechaAdquisicion").value;
        data.fechaExpiracion = document.getElementById("fechaExpiracion").value;
        data.proveedor = document.getElementById("proveedor").value;
      } else if (tipo === "granos") {
        data.fechaCosecha = document.getElementById("fechaCosecha").value;
        data.lugarAlmacenamiento = document.getElementById(
          "lugarAlmacenamiento"
        ).value;
        data.calidad = document.getElementById("calidad").value;
      }

      try {
        const response = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Error en el registro");
        }
        alert("Registro exitoso");
        formContainer.style.display = "none";
        mostrarInventarios(tipo);
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al registrar");
      }
    };

  document.getElementById("cancelar-boton").onclick = function () {
    formContainer.style.display = "none";
  };
}

function definirColorParcela(estado) {
  switch (estado) {
    case "Vacía":
      return "#d0d0d0";
    case "Cultivada":
      return "#e76f51";
    case "Alquilada":
      return "#f4a261";
    case "Con agroquímicos":
      return "#ff6347";
    case "En descanso":
      return "#b0e0e6";
    case "Con riego":
      return "#2c3e50";
    case "Sin riego":
      return "#f39c12";
    case "En preparación":
      return "#f0e68c";
    case "Con cosecha pendiente":
      return "#8b0000";
    case "Abandonada":
      return "#a9a9a9";
    case "Con rotación de cultivos":
      return "#8b4513";
    case "Con maleza":
      return "#5d4037";
    case "Con cobertura vegetal":
      return "#f5f5dc";
    case "Con sistema agroforestal":
      return "#34495e";
    default:
      return "red";
  }
}

function inicializarMapa() {
  const map = L.map("map").setView([-32.8624, -63.7037], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  const elementosDibujados = new L.FeatureGroup();
  map.addLayer(elementosDibujados);

  const controlDibujo = new L.Control.Draw({
    draw: {
      polygon: {
        allowIntersection: false,
      },
      rectangle: {
        shapeOptions: {
          clickable: false,
        },
      },
      polyline: false,
      circle: false,
      circlemarker: false,
      marker: false,
    },
    edit: {
      featureGroup: elementosDibujados,
      remove: true,
    },
  });
  map.addControl(controlDibujo);

  fetch("http://localhost:8080/campos")
    .then((r) => r.json())
    .then((r) => r.results)
    .then((r) =>
      r.forEach((campo) => {
        let polygon = L.polygon(campo.coordenadas, {
          color: "green",
          fillColor: "none",
          fillOpacity: 0,
        }).addTo(map);

        polygon.on("click", function (e) {
          mostrarInfoCampo(campo, e.latlng);
        });
      })
    );

  fetch("http://localhost:8080/parcelas")
    .then((r) => r.json())
    .then((r) => r.results)
    .then((r) =>
      r.forEach((parcela) => {
        let color = definirColorParcela(parcela.estado);
        let polygon = L.polygon(parcela.coordenadas, { color: color }).addTo(
          map
        );

        polygon.on("click", function (e) {
          mostrarInfoParcela(parcela, e.latlng);
        });
      })
    );

  function mostrarInfoCampo(campo, latlng) {
    const formContainer = document.getElementById("contenedor-formulario");
    let formContent = `
            <h2>Información del Campo</h2>
            <p>Nombre: ${campo.nombre}</p>
            <p>Superficie: ${campo.superficie} m²</p>
            <button id="cerrar-boton">Cerrar</button>
        `;

    formContainer.innerHTML = formContent;
    formContainer.style.display = "block";

    document.getElementById("cerrar-boton").onclick = function () {
      formContainer.style.display = "none";
    };
  }

  function mostrarInfoParcela(parcela, latlng) {
    const formContainer = document.getElementById("contenedor-formulario");
    let formContent = `
            <h2>Información de Parcela</h2>
            <p>Nombre: ${parcela.nombre}</p>
            <p>Superficie: ${parcela.superficie} m²</p>
            <p>Estado: ${parcela.estado}</p>
            <button id="cerrar-boton">Cerrar</button>
        `;

    formContainer.innerHTML = formContent;
    formContainer.style.display = "block";

    document.getElementById("cerrar-boton").onclick = function () {
      formContainer.style.display = "none";
    };
  }

  map.on(L.Draw.Event.CREATED, function (event) {
    const capa = event.layer;
    const formContainer = document.getElementById("contenedor-formulario");

    formContainer.innerHTML = `
            <h2>Agregar</h2>
            <button id="registrar-campo-boton">Campo</button>
            <button id="registrar-parcela-boton">Parcela</button>
            <button id="cancelar-boton">Cancelar</button>
        `;
    formContainer.style.display = "block";

    document.getElementById("registrar-campo-boton").onclick = function () {
      registrarMapa("campo", capa, elementosDibujados);
    };

    document.getElementById("registrar-parcela-boton").onclick = function () {
      registrarMapa("parcela", capa, elementosDibujados);
    };

    document.getElementById("cancelar-boton").onclick = function () {
      formContainer.style.display = "none";
    };
  });
}

function registrarMapa(tipo, capa, elementosDibujados) {
  const formContainer = document.getElementById("contenedor-formulario");
  let formContent = "";
  let endpoint = "";

  if (tipo === "campo") {
    endpoint = "http://localhost:8080/campos";
    formContent = `
            <h2>Registrar Campo</h2>
            <p>Nombre</p>
            <input type="text" id="nombre" required>
            <p>Superficie (en m²)</p>
            <input type="number" id="superficie" required>
            <button id="registrar-mapa-boton">Registrar</button>
            <button class="cancelar" id="cancelar-boton">Cancelar</button>
        `;
  } else if (tipo === "parcela") {
    endpoint = "http://localhost:8080/parcelas";
    formContent = `
            <h2>Registrar Parcela</h2>
            <p>Nombre</p>
            <input type="text" id="nombre" required>
            <p>Superficie (en m²)</p>
            <input type="number" id="superficie" required>
            <p>Estado</p>
            <select id="estado">
                <option value="Vacía">Vacía</option>
                <option value="Cultivada">Cultivada</option>
                <option value="Alquilada">Alquilada</option>
                <option value="Con agroquímicos">Con Agroquímicos</option>
                <option value="En descanso">En Descanso</option>
                <option value="Con riego">Con Riego</option>
                <option value="Sin riego">Sin Riego</option>
                <option value="En preparación">En Preparación</option>
                <option value="Con cosecha pendiente">Con Cosecha Pendiente</option>
                <option value="Abandonada">Abandonada</option>
                <option value="Con rotación de cultivos">Con Rotación de Cultivos</option>
                <option value="Con maleza">Con Maleza</option>
                <option value="Con cobertura vegetal">Con Cobertura Vegetal</option>
                <option value="Con sistema agroforestal">Con Sistema Agroforestal</option>
            </select>
            <button id="registrar-mapa-boton">Registrar Parcela</button>
            <button class="cancelar" id="cancelar-boton">Cancelar</button>
        `;
  }

  formContainer.innerHTML = formContent;
  formContainer.style.display = "block";

  document.getElementById("registrar-mapa-boton").onclick = async function () {
    const nombre = document.getElementById("nombre").value;
    const superficie = document.getElementById("superficie").value;
    const coordenadas = capa._latlngs[0].map((coordenada) => [
      coordenada.lat,
      coordenada.lng,
    ]);

    let estado = null;

    if (tipo === "parcela") {
      estado = document.getElementById("estado").value;
    }

    let data = { nombre, superficie, estado, coordenadas };

    try {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error en el registro");
      }
      alert("Registro exitoso");
      formContainer.style.display = "none";
      mostrarInventarios(tipo);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al registrar");
    }

    if (tipo === "campo") {
      capa.setStyle({
        color: "green",
        fillColor: "none",
        fillOpacity: 0,
      });
    } else if (tipo === "parcela") {
      let color = definirColorParcela(estado);
      capa.setStyle({
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
      });
    }

    elementosDibujados.addLayer(capa);
  };

  document.getElementById("cancelar-boton").onclick = function () {
    formContainer.style.display = "none";
  };
}

function procesarDatosSemillas(semillas) {
  const anios = [
    ...new Set(semillas.map((s) => new Date(s.fechaAdquisicion).getFullYear())),
  ].sort();
  const tiposSemillas = [...new Set(semillas.map((s) => s.nombre))];

  const datosPorAnio = {};
  anios.forEach((anio) => {
    datosPorAnio[anio] = {};
    tiposSemillas.forEach((tipo) => {
      datosPorAnio[anio][tipo] = 0;
    });
  });

  semillas.forEach(({ nombre, cantidad, fechaAdquisicion }) => {
    const anio = new Date(fechaAdquisicion).getFullYear();
    if (datosPorAnio[anio] && datosPorAnio[anio][nombre] !== undefined) {
      datosPorAnio[anio][nombre] += cantidad;
    }
  });

  return { anios, tiposSemillas, datosPorAnio };
}

function procesarDatosGranos(granos) {
  const anios = [
    ...new Set(granos.map((g) => new Date(g.fechaCosecha).getFullYear())),
  ].sort();
  const tiposGranos = [...new Set(granos.map((g) => g.nombre))];

  const datosPorAnio = {};
  anios.forEach((anio) => {
    datosPorAnio[anio] = {};
    tiposGranos.forEach((tipo) => {
      datosPorAnio[anio][tipo] = 0;
    });
  });

  granos.forEach(({ nombre, cantidad, fechaCosecha }) => {
    const anio = new Date(fechaCosecha).getFullYear();
    if (datosPorAnio[anio] && datosPorAnio[anio][nombre] !== undefined) {
      datosPorAnio[anio][nombre] += cantidad;
    }
  });

  return { anios, tiposGranos, datosPorAnio };
}

async function crearGraficos(tipo) {
  const graficos = document.getElementById(`contenedor-graficos`);

  if (Chart.getChart("grafico-comparativo"))
    Chart.getChart("grafico-comparativo").destroy();

  if (tipo === "semillas") {
    const semillas = await fetch("http://localhost:8080/inventarios/semillas")
      .then((r) => r.json())
      .then((r) => r.results);

    const { anios, tiposSemillas, datosPorAnio } =
      procesarDatosSemillas(semillas);

    const ctxComparativo = document
      .getElementById("grafico-comparativo")
      .getContext("2d");
    new Chart(ctxComparativo, {
      type: "line",
      data: {
        labels: anios,
        datasets: tiposSemillas.map((tipo) => ({
          label: tipo,
          data: anios.map((anio) => datosPorAnio[anio][tipo] || 0),
          borderColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
          fill: false,
        })),
      },
      options: {
        scales: { y: { beginAtZero: true } },
      },
    });

    tiposSemillas.forEach((tipo) => {
      const ctx = document.createElement("canvas");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: anios,
          datasets: [
            {
              label: `Cantidad de ${tipo} Adquirida (kg)`,
              data: anios.map((anio) => datosPorAnio[anio][tipo] || 0),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: { y: { beginAtZero: true } },
        },
      });
      graficos.appendChild(ctx);
    });

    document.getElementById("boton-semillas").classList.add("activo");
    document.getElementById("boton-granos").classList.remove("activo");
  } else if (tipo === "granos") {
    const granos = await fetch("http://localhost:8080/inventarios/granos")
      .then((r) => r.json())
      .then((r) => r.results);

    const { anios, tiposGranos, datosPorAnio } = procesarDatosGranos(granos);

    const ctxComparativo = document
      .getElementById("grafico-comparativo")
      .getContext("2d");
    new Chart(ctxComparativo, {
      type: "line",
      data: {
        labels: anios,
        datasets: tiposGranos.map((tipo) => ({
          label: tipo,
          data: anios.map((anio) => datosPorAnio[anio][tipo] || 0),
          borderColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
          fill: false,
        })),
      },
      options: {
        scales: { y: { beginAtZero: true } },
      },
    });

    tiposGranos.forEach((tipo) => {
      const ctx = document.createElement("canvas");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: anios,
          datasets: [
            {
              label: `Cantidad de ${tipo} Cosechado (kg)`,
              data: anios.map((anio) => datosPorAnio[anio][tipo] || 0),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: { y: { beginAtZero: true } },
        },
      });
      graficos.appendChild(ctx);
    });

    document.getElementById("boton-semillas").classList.remove("activo");
    document.getElementById("boton-granos").classList.add("activo");
  }

  document.getElementById("boton-semillas").onclick = function () {
    crearGraficos("semillas");
  };

  document.getElementById("boton-granos").onclick = function () {
    crearGraficos("granos");
  };
}
