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
  const proveedorDiv = document.getElementById("proveedorDiv");
  const nombreEmpleadoHidden = document.getElementById("nombreEmpleadoHidden");
  const apellidoEmpleadoHidden = document.getElementById(
    "apellidoEmpleadoHidden"
  );
  const rolEmpleadoHidden = document.getElementById("rolEmpleadoHidden");
  const nombrePacienteHidden = document.getElementById("nombrePacienteHidden");

  function cargarTitulos(area) {
    if (!tituloSelect) return;
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
    if (!dniPacienteDiv || !proveedorDiv) return;

    if (
      ["Administración de Turnos", "Atención Médica", "Facturación"].includes(
        area
      )
    ) {
      dniPacienteDiv.style.display = "block";
      proveedorDiv.style.display = "none";
      const proveedorSelect = document.getElementById("proveedor");
      if (proveedorSelect) proveedorSelect.value = "";
    } else if (area === "Gestión de Insumos Médicos") {
      dniPacienteDiv.style.display = "none";
      if (infoPaciente) infoPaciente.style.display = "none";
      proveedorDiv.style.display = "block";
      if (document.getElementById("dniPaciente"))
        document.getElementById("dniPaciente").value = "";
      if (document.getElementById("pacienteHidden"))
        document.getElementById("pacienteHidden").value = "";
      if (document.getElementById("nombrePacienteHidden"))
        document.getElementById("nombrePacienteHidden").value = "";
      if (nombrePaciente) nombrePaciente.textContent = "";
    } else {
      dniPacienteDiv.style.display = "block";
      proveedorDiv.style.display = "block";
    }

    cargarTitulos(area);
  }

  function mostrarCamposTarea() {
    if (camposTarea) camposTarea.style.display = "block";
  }

  async function buscarEmpleadoPorDni(dni) {
    try {
      const res = await fetch(`/tareas/api/empleado/dni/${dni}`);
      if (!res.ok) throw new Error("Empleado no encontrado");
      const empleado = await res.json();

      if (empleadoHidden) empleadoHidden.value = empleado._id;
      if (areaHidden) areaHidden.value = empleado.area;

      if (nombreEmpleado) nombreEmpleado.textContent = empleado.nombre;
      if (apellidoEmpleado) apellidoEmpleado.textContent = empleado.apellido;
      if (rolEmpleado) rolEmpleado.textContent = empleado.rol || "-";
      if (areaEmpleado) areaEmpleado.textContent = empleado.area || "-";

      if (nombreEmpleadoHidden) nombreEmpleadoHidden.value = empleado.nombre;
      if (apellidoEmpleadoHidden)
        apellidoEmpleadoHidden.value = empleado.apellido;
      if (rolEmpleadoHidden) rolEmpleadoHidden.value = empleado.rol || "-";

      if (infoEmpleado) infoEmpleado.style.display = "block";
      aplicarReglas(empleado.area);
      mostrarCamposTarea();
    } catch (err) {
      alert(err.message);
      if (infoEmpleado) infoEmpleado.style.display = "none";
      if (camposTarea) camposTarea.style.display = "none";
    }
  }

  async function buscarPacientePorDni(dni) {
    try {
      const res = await fetch(`/tareas/api/paciente/dni/${dni}`);
      if (!res.ok) throw new Error("Paciente no encontrado");
      const paciente = await res.json();

      if (pacienteHidden) pacienteHidden.value = paciente._id;
      if (nombrePaciente)
        nombrePaciente.textContent = `${paciente.nombre || ""} ${
          paciente.apellido || ""
        }`.trim();
      if (nombrePacienteHidden) nombrePacienteHidden.value = paciente.nombre;

      if (infoPaciente) infoPaciente.style.display = "block";
    } catch (err) {
      alert(err.message);
      if (infoPaciente) infoPaciente.style.display = "none";
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
    const tarea = window.formData;

    if (tarea.area) {
      aplicarReglas(tarea.area);
      mostrarCamposTarea();
      cargarTitulos(tarea.area);
      if (tarea.titulo && tituloSelect) tituloSelect.value = tarea.titulo;
    }

    if (tarea.empleado) {
      if (infoEmpleado) infoEmpleado.style.display = "block";
      if (nombreEmpleado)
        nombreEmpleado.textContent = tarea.nombreEmpleado || "";
      if (apellidoEmpleado)
        apellidoEmpleado.textContent = tarea.apellidoEmpleado || "";
      if (rolEmpleado) rolEmpleado.textContent = tarea.rolEmpleado || "-";
      if (areaEmpleado) areaEmpleado.textContent = tarea.area || "-";
    }

    if (tarea.pacienteId) {
      if (infoPaciente) infoPaciente.style.display = "block";
      if (nombrePaciente)
        nombrePaciente.textContent = `${tarea.nombrePaciente || ""} ${
          tarea.apellidoPaciente || ""
        }`.trim();
    }
  }
});
