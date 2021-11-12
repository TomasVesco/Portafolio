//Variables
let carrito;
let productos;

// Selector
const listaProductos = document.querySelector('#lista-productos');
const tableCarrito = document.querySelector('#lista-carrito tbody');
const buscador = document.querySelector('#formulario');
const vaciar = document.querySelector('#vaciar-carrito');

//Listeners
$(()=>{
    const carritoStorage = JSON.parse(localStorage.getItem('carrito'));
    carrito = carritoStorage || [];
    $.ajax({
        method: 'GET',
        contentType: 'JSON',
        url: 'https://fakestoreapi.com/products',
        success: function(data, textStatus, xhr){ //Recibe data | textStatus | xhr
            productos = data;
            renderProducts(productos);
        },
        error: function(xhr, textStatus, error){ //Recibe xhr | textStatus | error
            console.log(xhr);
            console.log(textStatus);
            console.log(error);
        }
    });
});
listaProductos.addEventListener('click', agregarProducto);
tableCarrito.addEventListener('click', borrarProducto);
buscador.addEventListener('submit', buscarProducto);
vaciar.addEventListener('click', vaciarCarrito);

//Funciones
function renderProducts(data) {

    listaProductos.innerHTML = '';
    data.forEach( producto => {
        
        listaProductos.innerHTML += 
        `
            <div class="card">
                <img src="${producto.image}">
                <h4>${producto.title}</h4>
                <p class="precio">$<span>${producto.price}</span></p>
                <a href="#" class="agregar-carrito" data-id="${producto.id}">Agregar al carrito</a>
            </div>
        `;
    } )
    actualizarCarritoHTML();
}

function agregarProducto(e) {
    e.preventDefault();

    if(e.target.classList.contains("agregar-carrito")) {
        const productCard = e.target.parentElement;
        
        const productoAgregado = {
            imagen: productCard.querySelector('img').src,
            nombre: productCard.querySelector('h4').textContent, 
            precio: productCard.querySelector('.precio span').textContent,
            cantidad: 1,
            id: productCard.querySelector('a').dataset.id
        }


        // Chequea si existe el producto en el carrito
        const existe = carrito.some(producto => producto.id === productoAgregado.id);
        // map copia y además, recorre el arreglo como el forEach

        if(existe){
            const nuevoCarrito = carrito.map(producto => {
                if(producto.id === productoAgregado.id){
                    producto.cantidad++;
                }
                return producto;
            });
            carrito = [...nuevoCarrito];
        }else{
            carrito.push(productoAgregado);
        }
    }
    actualizarCarritoHTML();
    actualizarStorage();
}

function actualizarCarritoHTML() {
    tableCarrito.innerHTML = '';
    carrito.forEach( producto => {
        const {imagen, nombre, precio, cantidad, id} = producto;
        tableCarrito.innerHTML +=
        `
        <tr>
            <td>
                <img src="${imagen}">
            </td>
            <td>
                ${nombre}
            </td>
            <td>
                $${precio}
            </td>
            <td>
                ${cantidad}
            </td>
            <td>
                <a href="#" data-id="${id}"><i class="fas fa-trash borrar-producto"></i></a>
            </td>
        </tr>
        `;
    } );
}

function actualizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function buscarProducto(e) {
    e.preventDefault();

    const inputBuscador = document.querySelector('#buscador').value;
    const inputFiltrado = inputBuscador.toLowerCase().trim();

    const resultado = productos.filter(producto => producto.title.toLowerCase().includes(inputFiltrado));

    renderProducts(resultado);
    console.log(resultado);
    buscador.reset();
}

function vaciarCarrito(e) {
    e.preventDefault();

    carrito = [];

    actualizarCarritoHTML();
    actualizarStorage();
}

function borrarProducto(e) {
    e.preventDefault();
    if(e.target.classList.contains("borrar-producto")) {
        const id = e.target.parentElement.dataset.id;
        const indexToDelete = carrito.findIndex(producto => producto.id == id);
        carrito.splice(indexToDelete, 1);
        actualizarCarritoHTML();
        actualizarStorage()
    }
}