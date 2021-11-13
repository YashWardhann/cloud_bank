$(".item").click(e => {
    $(".selected").removeClass("selected");
    $(e.target).addClass("selected");
});