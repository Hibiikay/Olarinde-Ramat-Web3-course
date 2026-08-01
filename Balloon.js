<p>🎈</p>

<script>
  let balloon = document.querySelector("p");
  let size = 20;

  balloon.style.fontSize = size + "px";

  function resize(event) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      size *= 1.1;

      if (size > 100) {
        balloon.textContent = "💥";
        window.removeEventListener("keydown", resize);
      } else {
        balloon.style.fontSize = size + "px";
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      size *= 0.9;
      balloon.style.fontSize = size + "px";
    }
  }

  window.addEventListener("keydown", resize);
</script>
