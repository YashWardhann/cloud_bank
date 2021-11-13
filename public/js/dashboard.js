$(".item").click(e => {
    $(".selected").removeClass("selected");
    $(e.target).addClass("selected");
});

let displayMenu = false;

const toggleUserMenu = () => {
    let element = document.getElementById('user-menu')
    displayMenu = !displayMenu;
    (displayMenu) ? element.style.display = "none" : element.style.display = "block";
}