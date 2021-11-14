$(".item").click(e => {
    $(".selected").removeClass("selected");
    $(e.target).addClass("selected");
    const text = $(e.target).children('span');
    $('.content-heading').text(text.text());
});

let displayMenu = false;
const toggleUserMenu = () => {
    let element = document.getElementById('user-menu')
    displayMenu = !displayMenu;
    (displayMenu) ? element.style.display = "none" : element.style.display = "block";
}
