const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === "") {
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {
    const alertaPrevia = document.querySelector('.bg-red-100');
    if(!alertaPrevia) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3','rounded','max-w-lg','mx-auto','mt-6','text-center');

        alerta.innerHTML = `
            <strong class="font-bold">¡Error!</strong>
            <span class="block">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

async function buscarImagenes() {
    const terminoBusqueda = document.querySelector('#termino').value;
    const termino = terminoBusqueda.replaceAll(' ', '+');
    const key = '33519014-7f1e8e01fe2ce65daa39866a5';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page${registrosPorPagina}&page=${paginaActual}`;


    const respuesta = await fetch(url);
    const data = await respuesta.json(); 
    console.log(data);

    totalPaginas = calcularPaginas(data.totalHits);
    
    mostrarImagenes(data.hits);
}

function mostrarImagenes(imagenes) {
    limpiarHTML(resultado);
    
    //Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach( imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src=${previewURL}>
                    <div class="p-4">
                        <p class="font-bold">${likes}<span class="font-light"> Me gusta </span></p>
                        <p class="font-bold">${views}<span class="font-light"> Veces Vista</span></p>

                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                        >
                            Ver Imagen
                        </a>
                    </div>
                </div>
                
            </div>
        `;
    });

    //Limpiar el paginador previo 
    limpiarHTML(paginacionDiv);
    //Generamos el nuevo HTML
    imprimirPaginador();
}

//Generador que va a mostrar la cantidad de elementos de acuerdo a las páginas
function *crearPaginador(total) {
    for(let i = 1;  i <= total; i++) {
        yield i;
    }
}

function limpiarHTML(selector) {
    while(selector.firstChild)  selector.removeChild(selector.firstChild);
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while(true) {
        const { value, done } = iterador.next();
        if(done) return;

        //Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold','mb-4', 'uppercase', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacionDiv.appendChild(boton)
    }
}