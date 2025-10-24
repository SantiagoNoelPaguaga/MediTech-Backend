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

  btnBuscarPaciente.addEventListener("click", () => {
    const dni = dniPaciente.value.trim();
    if (!dni) return alert("Ingrese un DNI");
    window.location.href = `/pacientes/buscar?dni=${dni}`;
  });

  tipoTurno.addEventListener("change", async () => {
    const tipo = tipoTurno.value;

    let opciones = [];

    if (tipo === "estudio") {
      opciones = ["Radiografía", "Electrocardiograma", "Análisis de Sangre"];
    } else {
      opciones = ["Cardiología", "Oftalmología", "Psiquiatría"];
      try {
        // const res = await fetch("/api/especialidades");
        // const data = await res.json();
        opciones = data.map((e) => e.nombre);
      } catch (err) {
        console.error("Error en fetch:", err);
        opciones = [];
      }
    }

    descripcionSelect.innerHTML = `<option value="" selected disabled>Seleccione una opción</option>`;
    opciones.forEach((op) => {
      const opt = document.createElement("option");
      opt.value = op;
      opt.textContent = op;
      descripcionSelect.appendChild(opt);
    });

    descripcionLabel.hidden = false;
    descripcionSelect.hidden = false;
  });

  descripcionSelect.addEventListener("change", async () => {
    cargarMedicos();
  });

  async function cargarMedicos() {
    try {
      //TODO: pull medicos from API
      const medicosEjemplo = [
        { _id: "68f9105defad632b396a94a0", nombre: "Martín", apellido: "Fernández" }
      ];

      await new Promise((res) => setTimeout(res, 300));

      const medicos = medicosEjemplo.filter((m) => true);

      medicoSelect.innerHTML = `<option value="" selected disabled>Seleccione un médico</option>`;
      medicos.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m._id;
        opt.textContent = `${m.nombre} ${m.apellido}`;
        opt.dataset.nombreCompleto = `${m.nombre} ${m.apellido}`;
        medicoSelect.appendChild(opt);
      });

      medicoLabel.hidden = false;
      medicoSelect.hidden = false;
    } catch (err) {
      console.error(err);
      alert("Error al cargar médicos de prueba");
    }
  }

  medicoSelect.addEventListener("change", () => {
    const selected = medicoSelect.selectedOptions[0];
    nombreMedicoHidden.value = selected.dataset.nombreCompleto;
  });
});