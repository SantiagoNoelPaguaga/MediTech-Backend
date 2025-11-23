<p align="center">

  <h3 align="center">MediTech</h3>

  <p align="center">
    Sistema clínico software
  </p>
</p>


## Tabla de contenidos

- [Funcionamiento](#funcionamiento)
- [Creadores](#creadores)
- [Links](#links)

## Funcionamiento

MediTech es un sistema de gestión clínica diseñado como una solución de backend integral, cuyo objetivo es digitalizar y centralizar la administración de una clínica médica. El sistema aborda la necesidad de gestionar de manera eficiente las operaciones críticas, incluyendo la administración del personal (médico y administrativo), el manejo completo de la información de pacientes, la gestión de turnos médicos y citas, así como la organización de tareas administrativas. Además, el sistema mantiene catálogos maestros para especialidades médicas y coberturas de salud.

El sistema se basa en una arquitectura monolítica que implementa rigurosamente el patrón MVC (Model-View-Controller) para asegurar una clara separación de responsabilidades. El backend está construido utilizando Node.js con el framework Express.js, y se apoya en MongoDB Atlas como su base de datos NoSQL. Para la visualización, utiliza Pug como motor de plantillas, lo que permite el renderizado de vistas directamente desde el servidor. La gestión de datos se facilita mediante el ODM Mongoose, y todo el código se estructura con Módulos ES6 (import/export) para mejorar la modularidad y el mantenimiento.

La aplicación cuenta con una arquitectura segura y robusta gracias a la implementación de un sistema integral de seguridad basado en JSON Web Tokens, control de roles y buenas prácticas de protección de credenciales.

Pilares de la seguridad implementada:

- JSON Web Token (JWT):
Se utiliza como credencial digital de sesión. Tras un inicio de sesión exitoso, el servidor emite un token firmado que no puede ser modificado por terceros. Este token contiene información esencial como el ID, DNI y el rol del empleado, permitiendo validar de forma confiable la identidad del usuario en cada solicitud.

- Hashing de contraseñas (bcrypt):
Las contraseñas se almacenan utilizando un algoritmo de hashing irreversible. Incluso si alguien obtiene acceso a la base de datos, únicamente verá los hashes, asegurando que las credenciales reales permanezcan protegidas.

- Cookies HTTP-Only:
El JWT se almacena en una cookie marcada como http-only, lo que impide que sea accedida mediante JavaScript en el navegador. Este mecanismo mitiga ataques comunes como XSS y aumenta significativamente la seguridad del manejo de sesiones.

- Autenticación y Autorización por Roles:
La autenticación determina quién es el usuario validando su identidad mediante el token.
La autorización garantiza que cada usuario solo pueda acceder a los recursos y operaciones que corresponden a su rol asignado, limitando el alcance de sus acciones dentro del sistema.

## Creadores

**Avalos, Santiago Germán**

**Paguaga, Santiago Noel**

**Verón, Mirta**

## Links

- [Repositorio GitHub](https://github.com/SantiagoNoelPaguaga/MediTech-Backend)
- [Deploy render](meditech-backend-uz2c.onrender.com)