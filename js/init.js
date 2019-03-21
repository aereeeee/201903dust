// ANIMATION ON SCROLL
// $(function() {
//     AOS.init();
// });

// $(window).on('load', function() {
//     AOS.refresh();
// });


// GOOGLE ANALYTICS
$(document).ready(function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create','UA-53828044-1','auto');
        ga('require', 'displayfeatures');
        ga('send','pageview');
});


// SNS LINK
function sharefb(url) {
    window.open('http://www.facebook.com/sharer/sharer.php?u=' + url);
};

function sharetwit(url, text) {
    window.open('http://twitter.com/intent/tweet?text=' + text + '&url=' + url);
};

$('#facebook').on("click", function() {
    sharefb('http://mabu.newscloud.sbs.co.kr/201902budget');
});

$('#twitter').on("click", function() {
    sharetwit('http://mabu.newscloud.sbs.co.kr/201902budget', 'SBS마부작침: ');
});


// PROGRESS BAR
$(document).ready(function(){

    var windowWidth = $(window).width();

    $(window).scroll(function() {

        var winScroll = $(window).scrollTop();
        var docheight = $(document).height();
        var winheight = $(window).height();

        var totalScroll = (winScroll/(docheight - winheight)) * 100;
        $("#bar").css("width", totalScroll + "%");

    });
});