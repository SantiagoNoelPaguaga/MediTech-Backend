document.addEventListener("DOMContentLoaded", () => {
  const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
  const dniPaciente = document.getElementById("dniPaciente");
  const tipoTurno = document.getElementById("tipoTurno");
  const descripcionSelect = document.getElementById("descripcion");
  const descripcionLabel = document.querySelector("label[for='descripcion']");
  const estudioSelect = document.getElementById("estudioMedico");
  const medicoLabel = document.querySelector("label[for='medicoId']");
  const medicoSelect = document.getElementById("medicoId");
  const nombreMedicoHidden = document.getElementById("nombreMedico");

  if (dniPaciente.value) {
    dniPaciente.readOnly = true;
  }

  async function inicializarFormulario() {
    await cargarTiposTurno();

    const tipoPreseleccionado = tipoTurno.dataset.preselected;
    if (tipoPreseleccionado && tipoTurno.value) {
      await manejarCambioTipoTurno(true);
    }
  }

  inicializarFormulario();

  btnBuscarPaciente.addEventListener("click", () => {
    const dni = dniPaciente.value.trim();
    if (!dni) return alert("Ingrese un DNI");
    window.location.href = `/turnos/paciente?dni=${dni}`;
  });

  tipoTurno.addEventListener("change", () => manejarCambioTipoTurno(false));

  async function cargarTiposTurno() {
    try {
      const res = await fetch("/turnos/api/tipo-turnos");
      if (!res.ok) throw new Error("Error al cargar tipos de turno");

      const tipos = await res.json();
      const valorPrecargado = tipoTurno.dataset.preselected;

      tipoTurno.innerHTML = `<option value="" selected disabled>Seleccione un tipo</option>`;

      tipos.forEach((tipo) => {
        const opt = document.createElement("option");
        opt.value = tipo.nombre;
        opt.textContent = tipo.nombre;

        if (valorPrecargado && tipo.nombre === valorPrecargado) {
          opt.selected = true;
        }

        tipoTurno.appendChild(opt);
      });
    } catch (error) {
      console.error("Error al cargar Tipos de Turno:", error);
    }
  }

  async function manejarCambioTipoTurno(isPreload = false) {
    const tipo = tipoTurno.value;
    let opciones = [];
    const valorDescripcionPrecargada = descripcionSelect.dataset.preselected;

    try {
      if (tipo === "consulta" || tipo === "control") {
        const res = await fetch("/turnos/api/especialidades");
        if (!res.ok) throw new Error("Error al cargar especialidades");
        const data = await res.json();
        opciones = data.map((e) => e.nombre);
      } else if (tipo === "estudio") {
        opciones = ["Radiografía", "Electrocardiograma", "Análisis de Sangre"];
      }
    } catch (err) {
      console.error("Error al cargar opciones de descripción:", err);
      opciones = [];
    }

    if (!isPreload || !valorDescripcionPrecargada) {
      descripcionSelect.innerHTML = `<option value="" selected disabled>Seleccione una opción</option>`;
    } else {
      const firstOption = descripcionSelect.querySelector("option[selected]");
      descripcionSelect.innerHTML = "";
      if (firstOption) {
        descripcionSelect.appendChild(firstOption);
      }
    }

    opciones.forEach((op) => {
      if (isPreload && op === valorDescripcionPrecargada) {
        return;
      }

      const opt = document.createElement("option");
      opt.value = op;
      opt.textContent = op;
      descripcionSelect.appendChild(opt);
    });

    if (opciones.length > 0) {
      descripcionLabel.hidden = false;
      descripcionSelect.hidden = false;
    }

    if ((isPreload && valorDescripcionPrecargada) || !isPreload) {
      await cargarMedicos(isPreload);
    }
  }

  descripcionSelect.addEventListener("change", async () => {
    await cargarMedicos(false);
  });

  async function cargarMedicos(isPreload = false) {
    try {
      const res = await fetch("/turnos/api/medicos");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const medicosData = await res.json();

      let medicos;
      const tipoTurnoValue = tipoTurno.value;
      const descripcionValue = descripcionSelect.value;

      if (
        (tipoTurnoValue === "consulta" || tipoTurnoValue === "control") &&
        descripcionValue
      ) {
        medicos = medicosData.filter(
          (m) =>
            m.especialidades && m.especialidades.includes(descripcionValue),
        );
      } else {
        medicos = medicosData;
      }

      const medicoPreseleccionado =
        medicoSelect.querySelector("option[selected]");
      const medicoIdPreseleccionado = medicoPreseleccionado
        ? medicoPreseleccionado.value
        : null;

      if (!isPreload || !medicoIdPreseleccionado) {
        medicoSelect.innerHTML = `<option value="" selected disabled>Seleccione un médico</option>`;
      } else {
        const firstOption = medicoSelect.querySelector("option[selected]");
        medicoSelect.innerHTML = "";
        if (firstOption) {
          medicoSelect.appendChild(firstOption);
        }
      }

      medicos.forEach((m) => {
        if (isPreload && m._id === medicoIdPreseleccionado) {
          return;
        }
        const opt = document.createElement("option");
        opt.value = m._id;
        opt.textContent = `${m.nombre} ${m.apellido}`;
        opt.dataset.nombreCompleto = `${m.nombre} ${m.apellido}`;
        medicoSelect.appendChild(opt);
      });

      if (medicos.length === 0 && !isPreload) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No hay médicos disponibles para esta especialidad";
        opt.disabled = true;
        medicoSelect.appendChild(opt);
      }

      medicoLabel.hidden = false;
      medicoSelect.hidden = false;
    } catch (err) {
      console.error(err);
      alert("Error al cargar médicos.");
    }
  }

  medicoSelect.addEventListener("change", () => {
    const selected = medicoSelect.selectedOptions[0];
    if (selected && selected.dataset.nombreCompleto) {
      nombreMedicoHidden.value = selected.dataset.nombreCompleto;
    }
  });
});
