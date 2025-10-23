document.addEventListener("DOMContentLoaded", () => {
  const deleteForms = document.querySelectorAll(".delete-form");
  const modal = document.getElementById("confirmModal");
  const modalMessage = modal.querySelector("#modalMessage");
  const confirmBtn = modal.querySelector("#confirmYes");
  const cancelBtn = modal.querySelector("#confirmNo");

  let currentForm = null;

  deleteForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      currentForm = form;
      modal.classList.add("open");
    });
  });

  confirmBtn.addEventListener("click", () => {
    if (currentForm) currentForm.submit();
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    currentForm = null;
  });

  const closeBtn = modal.querySelector("#closeModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open");
      currentForm = null;
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
      currentForm = null;
    }
  });
});
