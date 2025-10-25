document.addEventListener("DOMContentLoaded", () => {
  const areasPorRol = {
    Administrador: ["Administración de Turnos", "Facturación"],
    Médico: ["Atención Médica"],
    Recepcionista: ["Administración de Turnos", "Facturación"],
    "Encargado de Stock": ["Gestión de Insumos Médicos"],
  };

  const rolSelect = document.getElementById("rol");
  const areaSelect = document.getElementById("area");

  rolSelect.addEventListener("change", () => {
    const rol = rolSelect.value;
    const areasValidas = areasPorRol[rol] || [];

    areaSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Seleccione un área";
    areaSelect.appendChild(defaultOption);

    areasValidas.forEach((area) => {
      const option = document.createElement("option");
      option.value = area;
      option.textContent = area;
      areaSelect.appendChild(option);
    });
  });

  const rolInicial = rolSelect.value;
  if (rolInicial) {
    const event = new Event("change");
    rolSelect.dispatchEvent(event);
    if (areaSelect.dataset.selected) {
      areaSelect.value = areaSelect.dataset.selected;
    }
  }
});
