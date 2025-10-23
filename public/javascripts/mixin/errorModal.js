document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalGeneric");
  if (!modal) return;

  const openModal = () => modal.classList.add("open");
  const closeModal = () => modal.classList.remove("open");

  openModal();

  const btnClose = modal.querySelector("#closeModal");
  if (btnClose) btnClose.addEventListener("click", closeModal);

  const confirmBtn = modal.querySelector("#confirmYes");
  if (confirmBtn) confirmBtn.addEventListener("click", closeModal);

  const cancelBtn = modal.querySelector("#confirmNo");
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});
