$(".item").click(e => {
    $(".selected").removeClass("selected");
    $(e.target).addClass("selected");
    const text = $(e.target).children('span');
    $('.content-heading').text(text.text());
});