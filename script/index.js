let g_userDevice = "pc";
let g_showPageIx = 0;

$(function() {
  if (window.matchMedia("(pointer: coarse)").matches) g_userDevice = "mobile";

  if (g_userDevice == "pc") $(".js-pc-show").removeClass("is-hide");

  filterBtn();
  slidePageManage();
  viewMainScreen();


  // ﾘｻｲｽﾞ毎の処理 (setTimeout によって 100ms ごとに処理)
  let timer;
  $(window).on("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (g_showPageIx != 0) slidePage();
    }, 100);
  });
});


// ----------------------------------------------
// js-filter-btn のｸﾘｯｸまたはﾎﾊﾞｰで、js-filter-screen の表示/非表示を切り替える
// > ﾓﾊﾞｲﾙ端末では click と pointerenter が同時発火するため、ﾓﾊﾞｲﾙ端末の pointerenter では処理しない
// ----------------------------------------------
function filterBtn() {
  let isWait = false;

  $(".header").on("click pointerenter", ".js-filter-btn", function(e) {
    if ((e.type == "pointerenter") && (e.pointerType != "mouse")) return;

    if (isWait) return;
    isWait = true;
    
    $(".js-filter-screen").toggleClass("is-show");

    setTimeout(() => {
      isWait = false;
    }, 200);
  });
}


// ----------------------------------------------
// main-screen 上での横ｽｸﾛｰﾙまたは次矢印のｸﾘｯｸで、js-pages を動かし、js-slide-page の表示を切り替える
// また、表示中の js-slide-page に伴う、js-dot を強調表示する
// > ﾓﾊﾞｲﾙ端末では横ｽｸﾛｰﾙ、pc端末では次矢印のｸﾘｯｸのみで発火する
// ----------------------------------------------
function slidePageManage() {
  const maxPageIx   = 2;
  let   isWait      = false;
  
  if (g_userDevice == "mobile") {
    let touchStartX = 0;
    let touchStartY = 0;

    $(".main-screen").on("touchstart", function(e) {
      isWait = false;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    $(".main-screen").on("touchmove", function(e) {
      if (isWait) return;
      isWait = true;

      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;

      // 横ｽｸﾛｰﾙ量 < 縦ｽｸﾛｰﾙ量 の場合は、縦ｽｸﾛｰﾙとみなし処理しない
      if (Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0) {
        g_showPageIx = Math.min(g_showPageIx + 1, maxPageIx);
      }
      else {
        g_showPageIx = Math.max(g_showPageIx - 1, 0);
      }

      slidePage();
      vividDot();
      growUnderLine();
    });
  }
  else if (g_userDevice == "pc") {
    $(".main-screen").on("click", ".js-arrow", function() {
      if (isWait) return;
      isWait = true;

      const arrow = $(this).data("arrow");
      if (arrow == "right") {
        g_showPageIx = Math.min(g_showPageIx + 1, maxPageIx);
      }
      else if (arrow == "left") {
        g_showPageIx = Math.max(g_showPageIx - 1, 0);
      }

      slidePage();
      vividDot();
      growUnderLine();

      setTimeout(() => {
        isWait = false;
      }, 200);
    });
  }

  // 表示中の js-slide-page に応じて、ﾍﾟｰｼﾞﾈｰｼｮﾝの js-dot を強調表示する
  function vividDot() {
    $(".js-dot").removeClass("is-vivid");
    $(".js-dot").eq(g_showPageIx).addClass("is-vivid");
  }

  // js-section-title の下線を描画するｱﾆﾒｰｼｮﾝｸﾗｽを追加/削除する
  function growUnderLine() {
    $(".main-screen .js-section-title").removeClass("is-grow");
    if (g_showPageIx == 0) return;
    $(".main-screen .js-slide-page").eq(g_showPageIx).find(".js-section-title").addClass("is-grow");
  }
}


// ----------------------------------------------
// 処理時点の js-slide-page の横幅に応じて js-pages の translateX をずらす
// > slidePageManage() と、ｳｲﾝﾄﾞｳﾘｻｲｽﾞ時から呼ばれる
// ----------------------------------------------
function slidePage() {
  const slideX = $(".main-screen .js-slide-page").innerWidth() * g_showPageIx * -1;
    $(".js-pages").css("transform", `translateX(${slideX}px)`);
}


// ----------------------------------------------
// ｸﾘｯｸした js-portfolio-item を main-screen に描画する
// 初期描画として、最初の js-portfolio-item を描画する
// ----------------------------------------------
function viewMainScreen() {
  viewMainScreenCore($(".js-portfolio-item").eq(0));

  $(".portfolio-list").on("click", ".js-portfolio-item", function() {
    viewMainScreenCore($(this));
  });


  function viewMainScreenCore($el) {
    const $clone  = $el.children(".js-copy-source").children().clone();
    const $toCopy = $(".main-screen .js-pages");
    $toCopy.children().remove();
    $toCopy.append($clone);

    setPortfolioTitle($el);
    setPortfolioURL($el);
    adjustCloneCopy($toCopy);
    setFadeInOutAnim($toCopy);
  }


  // --------------------------------------------
  // ｸﾘｯｸした js-portfolio-item に紐づく作品名 (js-title) を js-portfolio-title に表示する
  // --------------------------------------------
  function setPortfolioTitle($portfolioItem) {
    const title = $portfolioItem.find(".js-title").text();
    $(".js-portfolio-title").text(title);
  }


  // --------------------------------------------
  // ｸﾘｯｸした js-portfolio-item に紐づく URL を js-view-btn のﾘﾝｸ先に設定する
  // --------------------------------------------
  function setPortfolioURL($portfolioItem) {
    const url = $portfolioItem.data("url");
    $(".js-view-btn").attr("href", url);
  }


  // --------------------------------------------
  // ﾌｪｰﾄﾞｲﾝｱｳﾄの画像数 (js-fade-in-out) を 3枚 または 4枚 になるように複製する
  // > 枚数に応じて後続でｾｯﾄする animation-name が変化する
  // --------------------------------------------
  function adjustCloneCopy($pages) {
    const $slide       = $pages.find(".js-fade-in-out");
    let   adjustSlides = 0;
    
    if ($slide.length == 1) adjustSlides = 3;
    if ($slide.length == 2) adjustSlides = 4;

    if (adjustSlides == 0) return;

    const $slideClone  = $slide.clone();
    const $slideParent = $slide.parent(".js-img-list");

    for (let _ = 1; _ < adjustSlides; _++) {
      $slideParent.append($slideClone);
    }
  }


  // --------------------------------------------
  // ﾌｪｰﾄﾞｲﾝｱｳﾄの画像数 (js-fade-in-out) に応じて、animation ﾌﾟﾛﾊﾟﾃｨをセットする
  // --------------------------------------------
  function setFadeInOutAnim($pages) {
    const k      = 5;
    const $slide = $pages.find(".js-fade-in-out");
    const cnt    = $slide.length;

    let name = "fade-in-out-3th";
    if (cnt == 4) name = "fade-in-out-4th";

    $slide.each(function(ix) {
      $(this).css({
        "z-index"  : cnt - ix,
        "animation": `${name} ${k * cnt}s linear ${k * ix}s infinite none`,
      });
    });
  }
}
