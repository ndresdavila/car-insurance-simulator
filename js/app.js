
// constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// realiza cotizacion con datos
Seguro.prototype.cotizarSeguro = function() { // acá no uso arrow function porque debo acceder a los datos del objeto seguro
    
    let cantidad;
    const base = 2000;
    
    // evaluar 3 opciones según la marca del seguro
    switch(this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    // leer el anio, cada anio la diferencia es mayor
    const diferencia = new Date().getFullYear() - this.year;
    // el costo se reducirá un 3% del valor del seguro
    cantidad -= ((diferencia*3)*cantidad)/100;

    // si el seguro es básico se multiplica un30% más, si es completo 50% más
    if(this.tipo === 'basico') {
        cantidad *=1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

function UI() {}

// Llena las funciones de los anios
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;
    const selectYear = document.querySelector('#year');

    for(let i =max; i>min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

// Muestra laertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('DIV');
    if(tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // insertar en html
    const fomrulario = document.querySelector('#cotizar-seguro');
    fomrulario.insertBefore(div,document.querySelector('#resultado')); //(nuevo nodo, nodo de referencia antes de la inserción)
    setTimeout(() => {
        div.remove();
    }, 3000);
}

// mostrar resultado en htlm
UI.prototype.mostrarRestulado = (seguro, total) => {

    const {marca, year, tipo} = seguro;
    let textoMarca;

    switch(marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiátcio';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
    }

    // crear resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"></span> ${textoMarca}</p>
        <p class="font-bold">Año: <span class="font-normal"></span> ${year}</p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"></span> ${tipo}</p>
        <p class="font-bold">Total: <span class="font-normal"></span> $${total}</p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    
    // mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    // borro spinner y muestro resultado
    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 3000);
}

// instanciar UI
const ui = new UI();

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones() // llena select con los anios
})

eventListeners();
function eventListeners() {
    const fomrulario = document.querySelector('#cotizar-seguro');
    fomrulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    // leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    
    // leer el anio seleccionado
    const year = document.querySelector('#year').value;

    // leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value; // leer input tipo radio
    
    if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'exito');

    // ocultar cotizaciones previas: si no está vacío, eliminar el div con el resultado
    const resultados = document.querySelector('#resultado div');
    if(resultados != null) {
        resultados.remove();
    }

    // instanciar seguro
    const seguro = new Seguro(marca,year,tipo); // con estos datos cotizo el seguro

    // utilizar prototype que va a cotizar el seguro y pasarlo al constructor de UI para mostrarlo en html
    const total = seguro.cotizarSeguro();

    ui.mostrarRestulado(seguro, total);
}