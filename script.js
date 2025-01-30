let semillasData = [
    { nombre: "Trigo", variedad: "Klein Chaja", cantidad: "200 kg", fechaAdquisicion: "2024-05-31",  fechaExpiracion: "2025-05-31", proveedor: "Proveedor 1" },
    { nombre: "Maíz", variedad: "Dekalb 70", cantidad: "150 kg", fechaAdquisicion: "2023-06-09", fechaExpiracion: "2024-07-15", proveedor: "Proveedor 2" },
    { nombre: "Soja", variedad: "Inca", cantidad: "100 kg", fechaAdquisicion: "2023-08-21", fechaExpiracion: "2024-12-01", proveedor: "Proveedor 3" }
];

let granosData = [
    { nombre: "Arroz", variedad: "Chino", cantidad: "300 kg", fechaCosecha: "2025-01-20", lugarAlmacenamiento: "Almacén 1", calidad: "Alta" },
    { nombre: "Girasol", variedad: "P66", cantidad: "250 kg", fechaCosecha: "2024-10-10", lugarAlmacenamiento: "Almacén 2", calidad: "Media" },
    { nombre: "Lenteja", variedad: "Pardina", cantidad: "180 kg", fechaCosecha: "2024-11-30", lugarAlmacenamiento: "Almacén 3", calidad: "Alta" }
];

let parcelas = []; 

document.getElementById('formulario-login').addEventListener('submit', function(e) {
    e.preventDefault(); 
    document.getElementById('contenedor-login').style.display = 'none';
    document.getElementById('contenedor-aplicacion').style.display = 'block';
    mostrarContenido('reportes'); 
});

document.getElementById('boton-registrar').addEventListener('click', function() {
    const loginForm = document.getElementById('formulario-login');
    const formContainer = document.getElementById('contenedor-formulario');

    loginForm.style.display = 'none';

    formContainer.innerHTML = `
        <h2>Registro de Usuario</h2>
        <input type="email" id="registrar-email" placeholder="Correo Electrónico" required>
        <input type="password" id="registrar-contrasenia" placeholder="Contraseña" required>
        <button id="registrar-usuario-boton">Registrar</button>
        <button class="cancelar" id="cancelar-boton-registrar">Cancelar</button>
    `;
    formContainer.style.display = 'block';

    const returnToLogin = () => {
        formContainer.style.display = 'none';
        loginForm.style.display = 'block'; 
    };

    document.getElementById('registrar-usuario-boton').onclick = function() {
        const email = document.getElementById('registrar-email').value;
        const password = document.getElementById('registrar-contrasenia').value;
        console.log(`Registro de usuario: ${email}, ${password}`);
        returnToLogin();
    };

    document.getElementById('cancelar-boton-registrar').onclick = returnToLogin;
});

document.querySelectorAll('.icono').forEach(item => {
    item.addEventListener('click', event => {
        document.querySelectorAll('.icono').forEach(icono => {
            icono.classList.remove('activo');
        });

        item.classList.add('activo');

        document.querySelectorAll('#area-contenido > div').forEach(contenido => {
            contenido.style.display = 'none';
        });

        const contenidoId = item.id + '-contenido';
        document.getElementById(contenidoId).style.display = 'block';

        document.getElementById('contenido-title').textcontenido = item.textcontenido;
    });
});

document.getElementById('reportes').addEventListener('click', function() {
    mostrarContenido('reportes');
});

document.getElementById('campos').addEventListener('click', function() {
    mostrarContenido('campos');
});

document.getElementById('inventarios').addEventListener('click', function() {
    mostrarContenido('inventarios');
});

function mostrarContenido(section) {
    const contenidoArea = document.getElementById('area-contenido');
    const contenedorAgregarBotones = document.getElementById('agregar-botones');

    if (section === 'reportes') {
        contenidoArea.innerHTML = `
            <h1>Reportes</h1>
            <div class="contenedor-canvas">
                <canvas id="graficoTrigo"></canvas>
                <canvas id="graficoMaiz"></canvas>
                <canvas id="graficoSoja"></canvas>
                <canvas id="graficoCosechas"></canvas>
            </div>`;
        crearGraficos();
        contenedorAgregarBotones.style.display = 'none'; 
    } else if (section === 'campos') {
        contenidoArea.innerHTML = `
            <h1>Campos</h1>
            <div id="map"></div>`;
        inicializarMapa(); 
        contenedorAgregarBotones.style.display = 'none'; 
    } else if (section === 'inventarios') {
        contenidoArea.innerHTML = `
            <div class="header-inventarios">
                <h1>Inventarios</h1>
                <div>
                    <button id="boton-semillas" class="boton-toggle activo">Semillas</button>
                    <button id="boton-granos" class="boton-toggle">Granos</button>
                </div>
            </div>
            <div id="inventarios-contenido"></div>`;
        contenedorAgregarBotones.style.display = 'block'; 
        mostrarInventarios('semillas'); 
    }
}

function mostrarInventarios(tipo) {
    const inventarioscontenido = document.getElementById('inventarios-contenido');
    const botonAgregarSemillas = document.getElementById('agregar-semillas');
    const botonAgregarGranos = document.getElementById('agregar-granos');

    if (tipo === 'semillas') {
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
                    ${semillasData.map(semilla => `
                        <tr>
                            <td>${semilla.nombre}</td>
                            <td>${semilla.variedad}</td>
                            <td>${semilla.cantidad}</td>
                            <td>${semilla.fechaAdquisicion}</td>
                            <td>${semilla.fechaExpiracion}</td>
                            <td>${semilla.proveedor}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        botonAgregarSemillas.style.display = 'block';
        botonAgregarGranos.style.display = 'none';
        document.getElementById('boton-semillas').classList.add('activo');
        document.getElementById('boton-granos').classList.remove('activo');
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
                    ${granosData.map(grano => `
                        <tr>
                            <td>${grano.nombre}</td>
                            <td>${grano.variedad}</td>
                            <td>${grano.cantidad}</td>
                            <td>${grano.fechaCosecha}</td>
                            <td>${grano.lugarAlmacenamiento}</td>
                            <td>${grano.calidad}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        botonAgregarSemillas.style.display = 'none';
        botonAgregarGranos.style.display = 'block';
        document.getElementById('boton-granos').classList.add('activo');
        document.getElementById('boton-semillas').classList.remove('activo');
    }

    botonAgregarSemillas.onclick = function () {
        mostrarFormulario('semillas');
    };

    botonAgregarGranos.onclick = function () {
        mostrarFormulario('granos');
    };

    document.getElementById('boton-semillas').onclick = function () {
        mostrarInventarios('semillas');
    };
    document.getElementById('boton-granos').onclick = function () {
        mostrarInventarios('granos');
    };
}

function mostrarFormulario(tipo) {
    const formContainer = document.getElementById('contenedor-formulario');
    let formContent = '';
    
    if (tipo === 'semillas') {
        formContent = `
            <h2>Registro de Semillas</h2>
            <p>Semilla</p>
            <input type="text" id="nombre" required>
            <p>Variedad</p>
            <input type="text" id="variedad" required>
            <p>Cantidad</p>
            <input type="double" id="cantidad" required>
            <p>Fecha de Adquisición</p>
            <input type="date" id="fechaAdquisicion" required>
            <p>Fecha de Expiración</p>
            <input type="date" id="fechaExpiracion" required>
            <p>Proveedor</p>
            <input type="text" id="proveedor" required>
            <button id="registrar-inventario-boton">Registrar</button>
            <button class="cancelar" id="cancelar-boton">Cancelar</button>
        `;
    } else if (tipo === 'granos') {
        formContent = `
            <h2>Registro de Granos</h2>
            <p>Grano</p>
            <input type="text" id="nombre" required>
            <p>Variedad</p>
            <input type="text" id="variedad" required>
            <p>Cantidad</p>
            <input type="double" id="cantidad" required>
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
    formContainer.style.display = 'block';

    document.getElementById('registrar-inventario-boton').onclick = function () {
        const nombre = document.getElementById('nombre').value;
        const variedad = document.getElementById('variedad').value;
        const cantidad = document.getElementById('cantidad').value;

        if (tipo === 'semillas') {
            const fechaAdquisicion = document.getElementById('fechaAdquisicion').value;
            const fechaExpiracion = document.getElementById('fechaExpiracion').value;
            const proveedor = document.getElementById('proveedor').value;

            semillasData.push({ nombre, variedad, cantidad, fechaAdquisicion, fechaExpiracion, proveedor });
        } else if (tipo === 'granos') {
            const fechaCosecha = document.getElementById('fechaCosecha').value;
            const lugarAlmacenamiento = document.getElementById('lugarAlmacenamiento').value;
            const calidad = document.getElementById('calidad').value;

            granosData.push({ nombre, variedad, cantidad, fechaCosecha, lugarAlmacenamiento, calidad });
        }

        formContainer.style.display = 'none';
        mostrarInventarios(tipo);
    };

    document.getElementById('cancelar-boton').onclick = function () {
        formContainer.style.display = 'none';
    };
}

function inicializarMapa() {
    const map = L.map('map').setView([-32.8624, -63.7037], 13); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const elementosDibujados = new L.FeatureGroup();
    map.addLayer(elementosDibujados);
    const controlDibujo = new L.Control.Draw({
        edit: {
            featureGroup: elementosDibujados
        }
    });
    map.addControl(controlDibujo);

    map.on(L.Draw.Event.CREATED, function(event) {
        const capa = event.layer;
        const type = event.layerType;

        const estado = prompt("¿Cuál es el estado de la parcela? (ej. cultivo, sin cultivar, etc.)");

        let color;
        switch (estado) {
            case 'cultivo':
                color = 'green';
                break;
            case 'sin cultivar':
                color = 'yellow';
                break;
            case 'en descanso':
                color = 'orange';
                break;
            default:
                color = 'red'; 
        }

        capa.setStyle({
            color: color,
            fillColor: color,
            fillOpacity: 0.5
        });

        elementosDibujados.addLayer(capa);
        parcelas.push({ layer: capa, estado: estado }); 
    });

    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        L.marker([lat, lng]).addTo(map).bindPopup(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`).openPopup();
    });
}

function crearGraficos() {
    const ctxTrigo = document.getElementById('graficoTrigo').getContext('2d');
    const graficoTrigo = new Chart(ctxTrigo, {
        type: 'bar',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'Cantidad de Trigo Cosechado (kg)',
                data: [150, 200, 250, 300, 350],
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctxMaiz = document.getElementById('graficoMaiz').getContext('2d');
    const graficoMaiz = new Chart(ctxMaiz, {
        type: 'bar',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'Cantidad de Maíz Cosechado (kg)',
                data: [100, 150, 200, 250, 300],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctxSoja = document.getElementById('graficoSoja').getContext('2d');
    const graficoSoja = new Chart(ctxSoja, {
        type: 'bar',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'Cantidad de Soja Cosechada (toneladas)',
                data: [80, 120, 160, 200, 240],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctxCosechas = document.getElementById('graficoCosechas').getContext('2d');
    const graficoCosechas = new Chart(ctxCosechas, {
        type: 'line',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [
                {
                    label: 'Trigo',
                    data: [150, 200, 250, 300, 350],
                    borderColor: 'rgba(255, 206, 86, 1)',
                    fill: false
                },
                {
                    label: 'Maíz',
                    data: [100, 150, 200, 250, 300],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    fill: false
                },
                {
                    label: 'Soja',
                    data: [80, 120, 160, 200, 240],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}