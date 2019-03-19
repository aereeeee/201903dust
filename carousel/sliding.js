var carousel;
$(document).ready(function () {

    carousel = $(".container");

    carousel.itemslide({

    }); //initialize itemslide

    $(window).resize(function () {
        carousel.reload();
    }); //Recalculate width and center positions and sizes when window is resized

    $("#next").click(function() {
        carousel.next();
    });

    $("#previous").click(function() {
        carousel.previous();
    });


});
