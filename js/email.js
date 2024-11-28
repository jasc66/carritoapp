document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío real del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;

        // Simulación del envío
        if (nombre && email && mensaje) {
            confirmationMessage.style.display = 'block'; // Muestra el mensaje de confirmación
            contactForm.reset(); // Limpia los campos del formulario

            // Opcional: Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                confirmationMessage.style.display = 'none';
            }, 3000);
        }
    });
});
