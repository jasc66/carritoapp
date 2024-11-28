document.addEventListener('DOMContentLoaded', function () {
    // Variables generales
    const listaCursos = document.querySelector('#lista-productos');
    const carrito = document.querySelector('#carrito');
    const contenedorCarrito = document.querySelector('#lista-carrito tbody');
    const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
    const buscador = document.querySelector('#buscador');
    const menuToggle = document.querySelector('#menu-toggle');
    const navMenu = document.querySelector('#nav-menu');
    const carritoOverlay = document.querySelector('#carrito-overlay');
    const imgCarrito = document.querySelector('#img-carrito');
    const cerrarCarritoBtn = document.querySelector('#cerrar-carrito');
    let articulosCarrito = [];

    // Cargar productos dinámicamente
    cargarProductos();

    // Cargar Event Listeners
    cargarEventListeners();

    function cargarEventListeners() {
        // Abrir/Cerrar menú hamburguesa
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });

            navMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    navMenu.classList.remove('show');
                }
            });
        }

        // Mostrar carrito
        if (imgCarrito && carritoOverlay && cerrarCarritoBtn) {
            imgCarrito.addEventListener('click', () => {
                carritoOverlay.style.display = 'flex';
            });

            cerrarCarritoBtn.addEventListener('click', () => {
                carritoOverlay.style.display = 'none';
            });

            carritoOverlay.addEventListener('click', (e) => {
                if (e.target === carritoOverlay) {
                    carritoOverlay.style.display = 'none';
                }
            });
        }

        // Agregar producto al carrito
        if (listaCursos) {
            listaCursos.addEventListener('click', agregarCurso);
        }

        // Eliminar curso del carrito
        if (carrito) {
            carrito.addEventListener('click', eliminarCurso);
        }

        // Vaciar el carrito
        if (vaciarCarritoBtn) {
            vaciarCarritoBtn.addEventListener('click', () => {
                articulosCarrito = [];
                limpiarHTML();
                actualizarContadorCarrito();
            });
        }

        // Cargar carrito desde Local Storage
        try {
            articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
            carritoHTML();
        } catch (error) {
            console.error('Error al cargar el carrito desde Local Storage:', error);
            articulosCarrito = [];
        }

        // Buscador de productos
        if (buscador) {
            buscador.addEventListener('input', buscarProductos);
        }
    }

    function agregarCurso(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            const cursoSeleccionado = e.target.closest('.card');
            if (cursoSeleccionado) {
                leerDatosCurso(cursoSeleccionado);
            }
        }
    }

    function leerDatosCurso(curso) {
        const precioOriginal = parseFloat(curso.querySelector('.precio-original').textContent.replace('$', ''));
        const precioOferta = parseFloat(curso.querySelector('.precio-oferta').textContent.replace('$', ''));
    
        const infoCurso = {
            imagen: curso.querySelector('img').src,
            titulo: curso.querySelector('h4').textContent,
            precioOferta: precioOferta,
            precioOriginal: precioOriginal,
            ahorro: (precioOriginal - precioOferta).toFixed(2),
            id: curso.querySelector('a').getAttribute('data-id'),
            cantidad: 1,
        };
    
        const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
        if (existe) {
            articulosCarrito = articulosCarrito.map((curso) => {
                if (curso.id === infoCurso.id) {
                    curso.cantidad++;
                    curso.ahorro = (curso.cantidad * (curso.precioOriginal - curso.precioOferta)).toFixed(2);
                }
                return curso;
            });
        } else {
            articulosCarrito = [...articulosCarrito, infoCurso];
        }
    
        carritoHTML();
    }

    function carritoHTML() {
        limpiarHTML();
    
        let totalCompra = 0;
    
        articulosCarrito.forEach((curso) => {
            const subtotal = curso.precioOferta * curso.cantidad;
            totalCompra += subtotal;
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${curso.imagen}" width="100">
                </td>
                <td>${curso.titulo}</td>
                <td>$${curso.precioOferta.toFixed(2)}</td>
                <td>${curso.cantidad}</td>
                <td>$${(curso.cantidad * (curso.precioOriginal - curso.precioOferta)).toFixed(2)}</td>
                <td>
                    <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
                </td>
            `;
            contenedorCarrito.appendChild(row);
        });
    
        // Actualiza el total de la compra
        document.getElementById('total-compra').textContent = `$${totalCompra.toFixed(2)}`;
    
        sincronizarStorage();
        actualizarContadorCarrito();
    }
    
    function eliminarCurso(e) {
        e.preventDefault();
        if (e.target.classList.contains('borrar-curso')) {
            const cursoId = e.target.getAttribute('data-id');
            articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);
            carritoHTML();
        }
    }
    
    function sincronizarStorage() {
        localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
    }

    function limpiarHTML() {
        while (contenedorCarrito && contenedorCarrito.firstChild) {
            contenedorCarrito.removeChild(contenedorCarrito.firstChild);
        }
    }

    function actualizarContadorCarrito() {
        const contador = document.querySelector('#contador-carrito');
        if (contador) {
            const totalItems = articulosCarrito.reduce((total, curso) => total + curso.cantidad, 0);
            contador.textContent = totalItems;
        }
    }

    function buscarProductos() {
        const busqueda = buscador.value.toLowerCase().trim();
        const productos = document.querySelectorAll('.card');

        productos.forEach((producto) => {
            const titulo = producto.querySelector('h4').textContent.toLowerCase();
            producto.style.display = titulo.includes(busqueda) ? 'block' : 'none';
        });
    }

    function cargarProductos() {
        const productos = [
            { id: 1, nombre: 'Tomates Frescos', descripcion: '1 kg de tomates orgánicos', precio: 2.50, oferta: 2.00, imagen: 'img/tomates.webp' },
            { id: 2, nombre: 'Lechuga Orgánica', descripcion: 'Fresca y lista para tus ensaladas', precio: 1.50, oferta: 1.20, imagen: 'img/Lechuga.jpeg' },
            { id: 3, nombre: 'Zanahorias Dulces', descripcion: '1 kg de zanahorias frescas', precio: 2.00, oferta: 1.80, imagen: 'img/Zanahoria.webp' },
        ];

        const productosGrid = document.getElementById('productos-grid');
        if (productosGrid) {
            productos.forEach((producto) => {
                const productoHTML = `
                    <div class="card">
                        <div class="card-image">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                        </div>
                        <div class="info-card">
                            <h4>${producto.nombre}</h4>
                            <p>${producto.descripcion}</p>
                            <p>
                                <span class="precio-original">$${producto.precio.toFixed(2)}</span>
                                <span class="precio-oferta">$${producto.oferta.toFixed(2)}</span>
                            </p>
                            <a href="#" class="agregar-carrito" data-id="${producto.id}">Agregar Al Carrito</a>
                        </div>
                    </div>
                `;
                productosGrid.innerHTML += productoHTML;
            });
        }
    }
});
