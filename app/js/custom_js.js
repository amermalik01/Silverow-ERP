function hideOtherTabs(a, e) {
  setTimeout(function() {
    "" != a &&
      $("ul.level-1 li").each(function(a) {
        $(this).hasClass("active") && $(this).removeClass("active");
      }),
      "mails" != a
        ? ($(".mails").removeClass("in"),
          $(".mails").attr("aria-expanded", "false"))
        : "mails" == a && 1 == e
        ? ($(".mails").removeClass("in"),
          $(".mails").attr("aria-expanded", "false"))
        : "mails" == a &&
          0 == e &&
          ($(".mails").addClass("in"),
          $(".mails").attr("aria-expanded", "true")),
      "calendar" != a
        ? ($(".calendar").removeClass("in"),
          $(".calendar").attr("aria-expanded", "false"))
        : "calendar" == a && 1 == e
        ? ($(".calendar").removeClass("in"),
          $(".calendar").attr("aria-expanded", "false"))
        : "calendar" == a &&
          0 == e &&
          ($(".calendar").addClass("in"),
          $(".calendar").attr("aria-expanded", "true"));
  }, 500);
}
$(".modal").draggable({ handle: ".modal-header" }),
  $(window).load(function() {
    setTimeout(function() {
      $(".mails").removeClass("in"),
        $(".mails").attr("aria-expanded", "false"),
        $(".calendar").removeClass("in"),
        $(".calendar").attr("aria-expanded", "false");
    }, 500);
  }),
  $(document).ready(function() {
    $(".right-sidebar").click();
  }),
  $(document).ready(function() {
    $(".btn-submit").attr({
      "button-spinner": "loading",
      "ng-disabled": "loading"
    });
  }),
  $(function() {
    $(document).tooltip({
      show: !1,
      hide: !1,
      position: { my: "center top", at: "center bottom+5" },
      tooltipClass: "tooltip-styling"
    });
  }),
  $(document).on("click", "#cssmenu ul li", function() {
    $("#cssmenu ul li").removeClass("active"), $(this).addClass("active");
  }),
  $(document).on("click", ".level-3 li a", function(a) {
    a.preventDefault(),
      "none" ==
      $(this)
        .next("ul.level-4")
        .css("display")
        ? ($(this)
            .find("i")
            .removeClass("fa fa-sort-desc"),
          $(this)
            .find("i")
            .addClass("fa fa-sort-asc"),
          $(this)
            .next("ul.level-4")
            .addClass("selected"))
        : ($(this)
            .find("i")
            .removeClass("fa fa-sort-asc"),
          $(this)
            .find("i")
            .addClass("fa fa-sort-desc"),
          $(this)
            .next("ul.level-4")
            .removeClass("selected"));
  }),
  $(function() {
    $.scrollUp({
      scrollName: "scrollUp",
      topDistance: "300",
      topSpeed: 300,
      animation: "fade",
      animationInSpeed: 400,
      animationOutSpeed: 400,
      scrollText: "Top",
      activeOverlay: !1
    });
  }),
  $(document).ready(function() {
    $(".ng-invalid-date").val(""),
      $(".date-picker")
        .datepicker({
          changeMonth: !0,
          changeYear: !0,
          dateFormat: $("#date_format").val()
        })
        .next(".ui-datepicker-trigger")
        .addClass("onspan"),
      $("#collapseExample").collapse({ toggle: !0 });
  }),
  (function() {
    "use strict";
    var a = function(a) {
      var e = document.querySelector(a.el),
        t = e.querySelectorAll(a.tabNavigationLinks),
        i = e.querySelectorAll(a.tabContentContainers),
        s = 0,
        l = !1,
        n = function() {
          if (!l) {
            (l = !0), e.classList.remove("no-js");
            for (var a = 0; a < t.length; a++) {
              var i = t[a];
              o(i, a);
            }
          }
        },
        o = function(a, e) {
          a.addEventListener("click", function(a) {
            a.preventDefault(), r(e);
          });
        },
        r = function(a) {
          a !== s &&
            a >= 0 &&
            a <= t.length &&
            (t[s].classList.remove("is-active"),
            t[a].classList.add("is-active"),
            i[s].classList.remove("is-active"),
            i[a].classList.add("is-active"),
            (s = a));
        };
      return { init: n, goToTab: r };
    };
    window.tabs = a;
  })();

$(document).ready(function() {
  $("body").on("mouseenter", ".dateHighlighter", function() {
    $(".highlightTh").addClass("activeRangeHighlight ");
    $(".highlightColBoth").addClass("activeRangeHighlightBorder");
  });
  $("body").on("mouseleave", ".dateHighlighter", function() {
    $(".highlightTh").removeClass("activeRangeHighlight");
    $(".highlightColBoth").removeClass("activeRangeHighlightBorder");
  });
  $("body").on("mouseenter", ".highlightTh", function() {
    $(".dateHighlighter").addClass("activeRangeHighlightDate");
  });
  $("body").on("mouseenter", ".highlightColBoth", function() {
    $(".dateHighlighter").addClass("activeRangeHighlightDate");
  });
  $("body").on("mouseleave", ".highlightTh", function() {
    $(".dateHighlighter").removeClass("activeRangeHighlightDate");
  });
  $("body").on("mouseleave", ".highlightColBoth", function() {
    $(".dateHighlighter").removeClass("activeRangeHighlightDate");
  });

  // var scripts = [];
  // $("script").each(function(i,e){

  //     scripts.push(e);
  // })

  // $("script").each(function(i,e){
  //     var src = $(e).attr("src");

  //     if (src && src.indexOf("app/views/") > -1)
  //     $(e).remove();
  // })

  // scripts.forEach(function(e){
  //     var src = $(e).attr("src");
  //     if (src && src.indexOf("app/views/") > -1)
  //     $("body").append(`<script async src='${src}'></script>`);
  // })
});
