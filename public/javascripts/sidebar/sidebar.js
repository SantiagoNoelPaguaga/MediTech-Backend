document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("openSidebar");
  const closeBtn = document.getElementById("closeSidebar");

  const handleResize = () => {
    if (window.innerWidth > 600) {
      sidebar.classList.add("open");
      openBtn.style.display = "none";
    } else {
      sidebar.classList.remove("open");
      openBtn.style.display = "block";
    }
  };

  openBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
    openBtn.style.display = "none";
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
    openBtn.style.display = "block";
  });

  handleResize();
  window.addEventListener("resize", handleResize);
});
