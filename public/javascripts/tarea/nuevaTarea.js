document.addEventListener("DOMContentLoaded", () => {
  const btnBuscarEmpleado = document.getElementById("btnBuscarEmpleado");
  const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
  const dniEmpleadoInput = document.getElementById("dniEmpleado");
  const dniPacienteInput = document.getElementById("dniPaciente");
  const infoEmpleado = document.getElementById("infoEmpleado");
  const infoPaciente = document.getElementById("infoPaciente");
  const camposTarea = document.getElementById("camposTarea");
  const dniPacienteDiv = document.getElementById("dniPacienteDiv");
  const empleadoHidden = document.getElementById("empleadoHidden");
  const areaHidden = document.getElementById("areaHidden");
  const pacienteHidden = document.getElementById("pacienteHidden");
  const nombreEmpleado = document.getElementById("nombreEmpleado");
  const apellidoEmpleado = document.getElementById("apellidoEmpleado");
  const rolEmpleado = document.getElementById("rolEmpleado");
  const areaEmpleado = document.getElementById("areaEmpleado");
  const nombrePaciente = document.getElementById("nombrePaciente");
  const tituloSelect = document.getElementById("titulo");
  const proveedorSelect = document.getElementById("proveedor");
  const proveedorDiv = document.getElementById("proveedorDiv");

  const nombreEmpleadoHidden = document.getElementById("nombreEmpleadoHidden");
  const apellidoEmpleadoHidden = document.getElementById(
    "apellidoEmpleadoHidden"
  );
  const rolEmpleadoHidden = document.getElementById("rolEmpleadoHidden");
  const nombrePacienteHidden = document.getElementById("nombrePacienteHidden");

  function cargarTitulos(area) {
    tituloSelect.innerHTML =
      '<option value="" disabled selected>Seleccione un título</option>';
    const titulos = window.TITULOS_POR_AREA[area] || [];
    titulos.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      tituloSelect.appendChild(opt);
    });
  }

  function aplicarReglas(area) {
    const pacienteInput = dniPacienteInput;
    const proveedorInput = proveedorSelect;

    if (
      ["Administración de Turnos", "Atención Médica", "Facturación"].includes(
        area
      )
    ) {
      dniPacienteDiv.style.display = "block";
      pacienteInput.disabled = false;

      proveedorDiv.style.display = "none";
      proveedorInput.disabled = true;
      proveedorInput.value = "";
    } else if (area === "Gestión de Insumos Médicos") {
      dniPacienteDiv.style.display = "none";
      infoPaciente.style.display = "none";
      pacienteInput.value = "";
      pacienteHidden.value = "";
      nombrePacienteHidden.value = "";

      proveedorDiv.style.display = "block";
      proveedorInput.disabled = false;
    } else {
      dniPacienteDiv.style.display = "block";
      pacienteInput.disabled = false;

      proveedorDiv.style.display = "block";
      proveedorInput.disabled = false;
    }

    cargarTitulos(area);
  }

  function mostrarCamposTarea() {
    camposTarea.style.display = "block";
  }

  async function buscarEmpleadoPorDni(dni) {
    try {
      const res = await fetch(`/tareas/api/empleado/dni/${dni}`);
      if (!res.ok) throw new Error("Empleado no encontrado");
      const empleado = await res.json();

      empleadoHidden.value = empleado._id;
      areaHidden.value = empleado.area;
      nombreEmpleado.textContent = empleado.nombre;
      apellidoEmpleado.textContent = empleado.apellido;
      rolEmpleado.textContent = empleado.rol || "-";
      areaEmpleado.textContent = empleado.area || "-";
      nombreEmpleadoHidden.value = empleado.nombre;
      apellidoEmpleadoHidden.value = empleado.apellido;
      rolEmpleadoHidden.value = empleado.rol || "-";

      infoEmpleado.style.display = "block";
      aplicarReglas(empleado.area);
      mostrarCamposTarea();
    } catch (err) {
      alert(err.message);
      infoEmpleado.style.display = "none";
      camposTarea.style.display = "none";
    }
  }

  async function buscarPacientePorDni(dni) {
    try {
      const res = await fetch(`/tareas/api/paciente/dni/${dni}`);
      if (!res.ok) throw new Error("Paciente no encontrado");
      const paciente = await res.json();

      pacienteHidden.value = paciente._id;
      nombrePaciente.textContent = paciente.nombre + " " + paciente.apellido;
      nombrePacienteHidden.value = paciente.nombre + " " + paciente.apellido;

      infoPaciente.style.display = "block";
    } catch (err) {
      alert(err.message);
      infoPaciente.style.display = "none";
    }
  }

  btnBuscarEmpleado?.addEventListener("click", () => {
    const dni = dniEmpleadoInput.value.trim();
    if (dni) buscarEmpleadoPorDni(dni);
  });

  btnBuscarPaciente?.addEventListener("click", () => {
    const dni = dniPacienteInput.value.trim();
    if (dni) buscarPacientePorDni(dni);
  });

  if (window.formData) {
    if (window.formData.empleado) {
      empleadoHidden.value = window.formData.empleado;
      areaHidden.value = window.formData.area || "";

      nombreEmpleado.textContent =
        window.formData.nombreEmpleado || window.formData.nombre || "";
      apellidoEmpleado.textContent =
        window.formData.apellidoEmpleado || window.formData.apellido || "";
      rolEmpleado.textContent =
        window.formData.rolEmpleado || window.formData.rol || "-";
      areaEmpleado.textContent = window.formData.area || "-";
      nombreEmpleadoHidden.value = nombreEmpleado.textContent;
      apellidoEmpleadoHidden.value = apellidoEmpleado.textContent;
      rolEmpleadoHidden.value = rolEmpleado.textContent;

      infoEmpleado.style.display = "block";
      camposTarea.style.display = "block";
      if (window.formData.area) aplicarReglas(window.formData.area);
    }

    if (window.formData.pacienteId) {
      pacienteHidden.value = window.formData.pacienteId;
      const nombreCompleto =
        window.formData.pacienteNombre || window.formData.nombrePaciente || "";
      nombrePaciente.textContent = nombreCompleto;
      nombrePacienteHidden.value = nombreCompleto;
      infoPaciente.style.display = "block";
    }

    if (window.formData.titulo) {
      cargarTitulos(window.formData.area || "");
      tituloSelect.value = window.formData.titulo;
    }
  }
});
