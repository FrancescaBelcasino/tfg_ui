window.addEventListener("load", () => {
  if (localStorage.getItem("user") != null) {
      document.getElementById("contenedor-login").style.display = "none";
      document.getElementById("contenedor-aplicacion").style.display = "block";
      mostrarContenido("reportes");
  }
})

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

        if (!validarContrasena(contrasena)) {
          swal({
            title: "Error",
            text: "La contraseña debe tener al menos 12 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
            icon: "error",
            confirmButtonColor: "#228b22",
          });
          return;
        }

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

          let responseBody = await response.json()
          localStorage.setItem("user", responseBody.id)

          swal({
            title: "Registro exitoso",
            text: "El usuario ha sido creado.",
            icon: "success",
            confirmButtonColor: "#228b22",
          });
          returnToLogin();
        } catch (error) {
          console.error("Error:", error);
          swal({
            title: "Oops...",
            text: "Ha ocurrido un problema al registrar los datos.",
            icon: "error",
            confirmButtonColor: "#228b22",
          });
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
      if (!response.ok) {throw new Error("Error en el inicio de sesión");}
      
      document.getElementById("contenedor-login").style.display = "none";
      document.getElementById("contenedor-aplicacion").style.display = "block";

      let responseBody = await response.json()
      localStorage.setItem("user", responseBody.id)

      mostrarContenido("reportes");
    } catch (error) {
      console.error("Error:", error);
      swal({
        title: "Oops...",
        text: "Ha ocurrido un problema al iniciar sesión.",
        icon: "error",
        confirmButtonColor: "#228b22",
      });
    }
  });

document
  .getElementById("icono-logout")
  .addEventListener("click", function() {
    localStorage.removeItem("user")
    document.getElementById("contenedor-login").style.display = "flex";
    document.getElementById("contenedor-aplicacion").style.display = "none";
  });

function validarContrasena(contrasena) {
  return (
    contrasena.length >= 12 &&
    /[A-Z]/.test(contrasena) &&
    /[a-z]/.test(contrasena) &&
    /\d/.test(contrasena) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(contrasena)
  );
}

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
            <th>Acciones</th>
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
                    <tr data-id="${semilla.id}">
                      <td>${semilla.nombre}</td>
                      <td>${semilla.variedad}</td>
                      <td>${semilla.cantidad}</td>
                      <td>${semilla.fechaAdquisicion}</td>
                      <td>${semilla.fechaExpiracion}</td>
                      <td>${semilla.proveedor}</td>
                      <td>
                        <button class="editar-semilla" onclick="editarSemilla('${semilla.id}')">
                            <img src="./assets/editar.png" alt="Editar">
                        </button>
                        <button class="eliminar-semilla" onclick="eliminarSemilla('${semilla.id}')">
                            <img src="./assets/eliminar.png" alt="Eliminar">
                        </button>
                      </td>
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
            <th>Acciones</th>
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
                    <tr data-id="${grano.id}">
                      <td>${grano.nombre}</td>
                      <td>${grano.variedad}</td>
                      <td>${grano.cantidad}</td>
                      <td>${grano.fechaCosecha}</td>
                      <td>${grano.ubicacionAlmacenamiento}</td>
                      <td>${grano.calidad}</td>
                      <td>
                        <button class="editar-grano" onclick="editarGrano('${grano.id}')">
                            <img src="./assets/editar.png" alt="Editar">
                        </button>
                        <button class="eliminar-grano" onclick="eliminarGrano('${grano.id}')">
                            <img src="./assets/eliminar.png" alt="Eliminar">
                        </button>
                      </td>
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

async function editarSemilla(id) {
  const response = await fetch(
    `http://localhost:8080/inventarios/semillas/${id}`
  );
  const data = await response.json();
  const semilla = data.results[0];

  const formContainer = document.getElementById("contenedor-formulario");
  formContainer.innerHTML = `
      <h2>Editar Semilla</h2>
      <p>Semilla</p>
      <input type="text" id="nombre" value="${semilla.nombre}" required>
      <p>Variedad</p>
      <input type="text" id="variedad" value="${semilla.variedad}" required>
      <p>Cantidad</p>
      <input type="number" id="cantidad" value="${semilla.cantidad}" required>
      <p>Fecha de Adquisición</p>
      <input type="date" id="fechaAdquisicion" value="${semilla.fechaAdquisicion}" required>
      <p>Fecha de Expiración</p>
      <input type="date" id="fechaExpiracion" value="${semilla.fechaExpiracion}" required>
      <p>Proveedor</p>
      <input type="text" id="proveedor" value="${semilla.proveedor}" required>
      <button id="guardar-cambios">Guardar</button>
      <button class="cancelar" id="cancelar-boton">Cancelar</button>
    `;
  formContainer.style.display = "block";

  document.getElementById("guardar-cambios").onclick = async function () {
    const nombre = document.getElementById("nombre").value;
    const variedad = document.getElementById("variedad").value;
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const fechaAdquisicion = document.getElementById("fechaAdquisicion").value;
    const fechaExpiracion = document.getElementById("fechaExpiracion").value;
    const proveedor = document.getElementById("proveedor").value;

    const data = {
      nombre,
      variedad,
      cantidad,
      fechaAdquisicion,
      fechaExpiracion,
      proveedor,
    };

    await fetch(`http://localhost:8080/inventarios/semillas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    swal({
      title: "Semilla actualizada exitosamente",
      text: "El inventario ha sido actualizado.",
      icon: "success",
      confirmButtonColor: "#228b22",
    });
    formContainer.style.display = "none";
    mostrarInventarios("semillas");
  };

  document.getElementById("cancelar-boton").onclick = function () {
    formContainer.style.display = "none";
  };
}

async function eliminarSemilla(id) {
  const formContainer = document.getElementById("contenedor-formulario");
  formContainer.innerHTML = `
      <h2>Eliminar Semilla</h2>
      <p>¿Estás seguro de que deseas eliminar esta semilla?</p>
      <button id="confirmar-eliminar">Eliminar</button>
      <button class="cancelar" id="cancelar-boton">Cancelar</button>
    `;
  formContainer.style.display = "block";

  document.getElementById("confirmar-eliminar").onclick = async function () {
    await fetch(`http://localhost:8080/inventarios/semillas/${id}`, {
      method: "DELETE",
    });
    swal({
      title: "Semilla eliminada exitosamente",
      text: "El inventario ha sido actualizado.",
      icon: "success",
      confirmButtonColor: "#228b22",
    });
    formContainer.style.display = "none";
    mostrarInventarios("semillas");
  };

  document.getElementById("cancelar-boton").onclick = function () {
    formContainer.style.display = "none";
  };
}

async function editarGrano(id) {
  const response = await fetch(
    `http://localhost:8080/inventarios/granos/${id}`
  );
  const data = await response.json();
  const grano = data.results[0];

  const formContainer = document.getElementById("contenedor-formulario");
  formContainer.innerHTML = `
        <h2>Editar Grano</h2>
        <p>Grano</p>
        <input type="text" id="nombre" value="${grano.nombre}" required>
        <p>Variedad</p>
        <input type="text" id="variedad" value="${grano.variedad}" required>
        <p>Cantidad</p>
        <input type="number" id="cantidad" value="${grano.cantidad}" required>
        <p>Fecha de Cosecha</p>
        <input type="date" id="fechaCosecha" value="${grano.fechaCosecha}" required>
        <p>Ubicación en Almacenamiento</p>
        <input type="text" id="ubicacionAlmacenamiento" value="${grano.ubicacionAlmacenamiento}" required>
        <p>Calidad</p>
        <input type="text" id="calidad" value="${grano.calidad}" required>
        <button id="guardar-cambios">Guardar</button>
        <button class="cancelar" id="cancelar-boton">Cancelar</button>
      `;
  formContainer.style.display = "block";

  document.getElementById("guardar-cambios").onclick = async function () {
    const nombre = document.getElementById("nombre").value;
    const variedad = document.getElementById("variedad").value;
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const fechaCosecha = document.getElementById("fechaCosecha").value;
    const ubicacionAlmacenamiento = document.getElementById(
      "ubicacionAlmacenamiento"
    ).value;
    const calidad = document.getElementById("calidad").value;

    const data = {
      nombre,
      variedad,
      cantidad,
      fechaCosecha,
      ubicacionAlmacenamiento,
      calidad,
    };

    await fetch(`http://localhost:8080/inventarios/granos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    swal({
      title: "Grano actualizado exitosamente",
      text: "El inventario ha sido actualizado.",
      icon: "success",
      confirmButtonColor: "#228b22",
    });
    formContainer.style.display = "none";
    mostrarInventarios("granos");
  };

  document.getElementById("cancelar-boton").onclick = function () {
    formContainer.style.display = "none";
  };
}

async function eliminarGrano(id) {
  const formContainer = document.getElementById("contenedor-formulario");
  formContainer.innerHTML = `
        <h2>Eliminar Grano</h2>
        <p>¿Estás seguro de que deseas eliminar este grano?</p>
        <button id="confirmar-eliminar">Eliminar</button>
        <button class="cancelar" id="cancelar-boton">Cancelar</button>
      `;
  formContainer.style.display = "block";

  document.getElementById("confirmar-eliminar").onclick = async function () {
    await fetch(`http://localhost:8080/inventarios/granos/${id}`, {
      method: "DELETE",
    });
    swal({
      title: "Grano actualizado exitosamente",
      text: "El inventario ha sido actualizado.",
      icon: "success",
      confirmButtonColor: "#228b22",
    });
    formContainer.style.display = "none";
    mostrarInventarios("granos");
  };

  document.getElementById("cancelar-boton").onclick = function () {
    formContainer.style.display = "none";
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
        swal({
          title: "Registro exitoso",
          text: "El inventario ha sido actualizado.",
          icon: "success",
          confirmButtonColor: "#228b22",
        });
        formContainer.style.display = "none";
        mostrarInventarios(tipo);
      } catch (error) {
        console.error("Error:", error);
        swal({
          title: "Oops...",
          text: "Ha ocurrido un problema al registrar los datos.",
          icon: "error",
          confirmButtonColor: "#228b22",
        });
      }
    };

  document.getElementById("cancelar-boton").onclick = function () {
    formContainer.style.display = "none";
  };
}

function definirColorParcela(estado) {
  switch (estado) {
    case "Cultivada":
      return "#e76f51";
    case "Sin cultivar":
      return "#d0d0d0";
    case "Alquilada":
      return "#f4a261";
    default:
      return "red";
  }
}

function definirColorCaracteristica(caracteristica) {
  switch (caracteristica) {
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
      return "#ccc";
  }
}

async function editarParcela(id) {
  const response = await fetch(`http://localhost:8080/parcelas/${id}`);
  const data = await response.json();
  const parcela = data.results[0];

  const formContainer = document.getElementById("contenedor-formulario");
  formContainer.innerHTML = `
    <h2>Editar Parcela</h2>
    <p>Nombre</p>
    <input type="text" id="nombre" value="${parcela.nombre}" required>
    <p>Superficie (m²)</p>
    <input type="number" id="superficie" value="${parcela.superficie}" required>
    <p>Estado</p>
      <select id="estado" required>
        <option value="Seleccionar" disabled selected>Seleccionar</option>
        <option value="Cultivada">Cultivada</option>
        <option value="Sin cultivar">Sin cultivar</option>
        <option value="Alquilada">Alquilada</option>
      </select>
      <div id="seleccionar-semillas" style="display:none;">
        <p>Tipo de semilla</p>
        <select id="tipoSemilla">
          <option value="Seleccionar" disabled selected>Seleccione una semilla</option>
          ${await fetch(`http://localhost:8080/inventarios/semillas`)
            .then((r) => r.json())
            .then((r) => r.results)
            .then((semillas) =>
              semillas
                .map(
                  (semilla) => `
                  <option value="${semilla.id}" amount="${semilla.cantidad}">${semilla.nombre}</option>
                  `
                )
                .join("")
            )}
        </select>
        <p>Cantidad sembrada</p>
        <input type="number" id="cantidadSembrada">
      </div>      
      <p>Características</p>
      <select id="caracteristicas" multiple>
        <option value="Con agroquímicos">Con agroquímicos</option>
        <option value="En descanso">En descanso</option>
        <option value="Con riego">Con riego</option>
        <option value="Sin riego">Sin riego</option>
        <option value="En preparación">En preparación</option>
        <option value="Con cosecha pendiente">Con cosecha pendiente</option>
        <option value="Abandonada">Abandonada</option>
        <option value="Con rotación de cultivos">Con rotación de cultivos</option>
        <option value="Con maleza">Con maleza</option>
        <option value="Con cobertura vegetal">Con cobertura vegetal</option>
        <option value="Con sistema agroforestal">Con sistema agroforestal</option>
      </select>
      <button id="guardar-cambios">Guardar</button>
    <button class="cancelar" id="cancelar-boton">Cancelar</button>
    `;
  formContainer.style.display = "block";

  let estadoElement = document.getElementById("estado");
  if (estadoElement) {
    estadoElement.addEventListener("change", mostrarCamposCultivo);
  }

  document.getElementById("guardar-cambios").onclick = async function () {
    let nombre = document.getElementById("nombre").value;
    let superficie = document.getElementById("superficie").value;
    let estado = document.getElementById("estado").value;
    let semillaSeleccionada = document.getElementById("tipoSemilla");
    let cantidadSeleccionada =
      document.getElementById("cantidadSembrada").value;
    let caracteristicas = Array.from(
      document.getElementById("caracteristicas").selectedOptions
    ).map((o) => o.value);

    let data = {
      nombre,
      superficie,
      estado,
      semillaSeleccionada,
      cantidadSeleccionada,
      caracteristicas,
    };

    await fetch(`http://localhost:8080/parcelas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    swal({
      title: "Parcela actualizada",
      text: "La información del mapa ha sido actualizada.",
      icon: "success",
      confirmButtonColor: "#228b22",
    });
    formContainer.style.display = "none";
  };

  document.getElementById("cancelar-boton").onclick = function () {
    formContainer.style.display = "none";
  };
}

async function eliminarParcela(id) {
  const formContainer = document.getElementById("contenedor-formulario");
  formContainer.innerHTML = `
      <h2>Eliminar Parcela</h2>
      <p>¿Estás seguro de que deseas eliminar esta parcela?</p>
      <button id="confirmar-eliminar">Eliminar</button>
      <button class="cancelar" id="cancelar-boton">Cancelar</button>
    `;
  formContainer.style.display = "block";

  document.getElementById("confirmar-eliminar").onclick = async function () {
    await fetch(`http://localhost:8080/parcelas/${id}`, {
      method: "DELETE",
    });
    swal({
      title: "Parcela eliminada",
      text: "La información del mapa ha sido actualizada.",
      icon: "success",
      confirmButtonColor: "#228b22",
    });
    formContainer.style.display = "none";
  };

  document.getElementById("cancelar-boton").onclick = function () {
    formContainer.style.display = "none";
  };
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
            <h2>${campo.nombre}</h2>
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
    let caracteristicasTags = parcela.caracteristicas
      .map(
        (c) =>
          `<span class='tag' style='background-color: ${definirColorCaracteristica(
            c
          )};'>${c}</span>`
      )
      .join(" ");
    let formContent = `
            <h2>${parcela.nombre}</h2>
            <p>${caracteristicasTags}</p>
            <p>Superficie: ${parcela.superficie} m²</p>
            <p>Estado: ${parcela.estado}</p>
            <button class="editar-parcela" onclick="editarParcela('${parcela.id}')">Editar</button>
            <button class="eliminar-parcela" onclick="eliminarParcela('${parcela.id}')">Eliminar</button>
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

async function registrarMapa(tipo, capa, elementosDibujados) {
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
      <select id="estado" required>
        <option value="Seleccionar" disabled selected>Seleccionar</option>
        <option value="Cultivada">Cultivada</option>
        <option value="Sin cultivar">Sin cultivar</option>
        <option value="Alquilada">Alquilada</option>
      </select>
      <div id="seleccionar-semillas" style="display:none;">
        <p>Tipo de semilla</p>
        <select id="tipoSemilla">
          <option value="Seleccionar" disabled selected>Seleccione una semilla</option>
          ${await fetch(`http://localhost:8080/inventarios/semillas`)
            .then((r) => r.json())
            .then((r) => r.results)
            .then((semillas) =>
              semillas
                .map(
                  (semilla) => `
                  <option value="${semilla.id}" amount="${semilla.cantidad}">${semilla.nombre}</option>
                  `
                )
                .join("")
            )}
        </select>
        <p>Cantidad sembrada</p>
        <input type="number" id="cantidadSembrada">
      </div>      
      <p>Características</p>
      <select id="caracteristicas" multiple>
        <option value="Con agroquímicos">Con agroquímicos</option>
        <option value="En descanso">En descanso</option>
        <option value="Con riego">Con riego</option>
        <option value="Sin riego">Sin riego</option>
        <option value="En preparación">En preparación</option>
        <option value="Con cosecha pendiente">Con cosecha pendiente</option>
        <option value="Abandonada">Abandonada</option>
        <option value="Con rotación de cultivos">Con rotación de cultivos</option>
        <option value="Con maleza">Con maleza</option>
        <option value="Con cobertura vegetal">Con cobertura vegetal</option>
        <option value="Con sistema agroforestal">Con sistema agroforestal</option>
      </select>
      <button id="registrar-mapa-boton">Registrar Parcela</button>
      <button class="cancelar" id="cancelar-boton">Cancelar</button>
    `;
  }

  formContainer.innerHTML = formContent;
  formContainer.style.display = "block";

  let estadoElement = document.getElementById("estado");
  if (estadoElement) {
    estadoElement.addEventListener("change", mostrarCamposCultivo);
  }

  document.getElementById("registrar-mapa-boton").onclick = async function () {
    let nombre = document.getElementById("nombre").value;
    let superficie = document.getElementById("superficie").value;
    let coordenadas = capa._latlngs[0].map((coordenada) => [
      coordenada.lat,
      coordenada.lng,
    ]);

    let estado = null;
    let caracteristicas = null;

    if (tipo === "parcela") {
      estado = document.getElementById("estado").value;
      caracteristicas = Array.from(
        document.getElementById("caracteristicas").selectedOptions
      ).map((o) => o.value);
    }

    let data = { nombre, superficie, estado, caracteristicas, coordenadas };

    if (estado === "Cultivada") {
      let semillaSeleccionada = document.getElementById("tipoSemilla");
      let cantidadSeleccionada =
        document.getElementById("cantidadSembrada").value;
      let cantidadMaxima =
        semillaSeleccionada.options[
          semillaSeleccionada.selectedIndex
        ].getAttribute("amount");

      if (parseFloat(cantidadSeleccionada) > parseFloat(cantidadMaxima)) {
        alert("Elegir menor cantidad");
        return;
      }

      data.semilla = semillaSeleccionada.value;
      data.cantidadSembrada = cantidadSeleccionada;

      await fetch(
        `http://localhost:8080/inventarios/semillas/${data.semilla}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cantidad: cantidadMaxima - cantidadSeleccionada,
          }),
        }
      );
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
      swal({
        title: "Registro exitoso",
        text: "El mapa ha sido actualizado.",
        icon: "success",
        confirmButtonColor: "#228b22",
      });
      formContainer.style.display = "none";
      mostrarInventarios(tipo);
    } catch (error) {
      console.error("Error:", error);
      swal({
        title: "Oops...",
        text: "Ha ocurrido un problema al registrar los datos.",
        icon: "error",
        confirmButtonColor: "#228b22",
      });
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

function mostrarCamposCultivo() {
  const estado = document.getElementById("estado")?.value;
  document.getElementById("seleccionar-semillas").style.display =
    estado === "Cultivada" ? "block" : "none";
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
