/* Define se mostra ou oculta a navbar */
function toggleNavVisibility() {
    /* Primeiro obtém os elementos pela ID */
    const navbar = document.getElementById("navbar");
    const icon = document.getElementById("iconi");

    /* Verifica se a barra de navegação está visível */
    const isVisible = !navbar.hasAttribute("hidden");

    /* Altera a visibilidade da barra de navegação */
    navbar.toggleAttribute("hidden", isVisible);

    /* Altera o ícone com base na visibilidade atual */
    icon.classList.toggle('fa-list', isVisible);
    icon.classList.toggle('fa-eye-slash', !isVisible);
}
