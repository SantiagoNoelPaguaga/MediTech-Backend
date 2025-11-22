document.addEventListener("DOMContentLoaded", () => {
  const modales = document.querySelectorAll(".modal");

  modales.forEach((modal) => {
    if (!modal) return;

    const openModal = () => modal.classList.add("open");
    const closeModal = () => modal.classList.remove("open");

    const btnClose = modal.querySelector("#closeModal");
    const confirmBtn = modal.querySelector("#confirmYes");

    if (btnClose && !confirmBtn) {
      openModal();
    }

    if (btnClose) btnClose.addEventListener("click", closeModal);

    if (confirmBtn) confirmBtn.addEventListener("click", closeModal);

    const cancelBtn = modal.querySelector("#confirmNo");
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  });
});
