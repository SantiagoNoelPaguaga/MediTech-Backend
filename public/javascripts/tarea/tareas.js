document.addEventListener("DOMContentLoaded", () => {
  const viewLinks = document.querySelectorAll(".view-info");
  const modal = document.getElementById("modalInfo");
  const modalTitle = modal.querySelector(".modal-info-title");
  const modalBody = modal.querySelector(".modal-info-body");
  const closeBtn = modal.querySelector(".modal-info-close");

  viewLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const label = link.dataset.label || "Info";
      const content = link.dataset.content || "";
      modalTitle.textContent = label;
      modalBody.textContent = content;
      modal.classList.add("show");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
  });
});
