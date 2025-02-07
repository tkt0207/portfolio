//=============================================
// ドキュメントエレメント
//=============================================
/* ヘッダー部 */
const $header = document.getElementsByTagName("header")[0];
const $content_block = document.getElementById("header-contents");
const $header_contents = document.getElementsByClassName("header-content");
const $content_menus = document.getElementsByClassName("content-menu");
const $header_selector = document.getElementById("header-selecter");
const $menu_expands = document.getElementsByClassName("menu-expand");

/* ツールブロック */
const $random_icons = document.getElementsByClassName("random_icons");
const $tool_table = document.getElementsByClassName("table_design")[0];
const $tool_table_block = document.getElementById("tool_table_block");

/* 資格ブロック */
const $qualification_block = document.getElementById("qualification_block");
const $qualification_name = document.getElementById("qualification_name");
const $qualification_date = document.getElementById("qualification_date");
const $screan_lock = document.getElementById("screan_lock");
const $contents = document.getElementsByClassName("contents");

/* 目次処理 */
const $aTags = document.getElementsByTagName("a");

//=============================================
// 共通定数の宣言
//=============================================
/* 種別切り替え閾値 */
const BREAK_WIDTH = 960;


//=============================================
// 共通変数の宣言
//=============================================
/* デバイス種別 */
let device_kind = "pc";

/* ウィンドウ幅 */
let window_width = document.documentElement.clientWidth;

/* セレクタークリックフラグ */
let header_selector_flg = false;

/* 拡張ボタンクリックフラグ */
let menu_expands_flg = [];

/* 初回PCフラグ */
let first_pc_kind = false;

/* 資格情報 */
let content_infomations = [
    ["基本情報技術者試験", "2023/11/15"],
    ["応用情報技術者試験", "2024/12/26"],
    ["MOS Excel", "2025/12/17"],
    ["VBA エキスパート", "2025/02/07"]
];


//=============================================
// 関数定義
//=============================================

/* ヘッダ部 */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ヘッダコンテントホバー時のアクション設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function header_content_hover_set(){
    // ヘッダコンテントホバー時のアクション設定
    for(const header_content of $header_contents){
        let content_menu = header_content.getElementsByClassName("content-menu")[0];

        header_content.onmouseover = () => {
            if(device_kind == "pc"){
                if(content_menu != null){
                    content_menu.style.display = "block";

                    if(!content_menu.classList.contains("overflowY")){
                        content_menu.classList.add("overflowY");
                    }
                }
            }
            $header.style.backgroundColor = "rgb(235, 235, 235)";
        };

        header_content.onmouseleave = () => {
            if(device_kind == "pc"){
                if(content_menu != null){
                    content_menu.style.display = "none";

                    if(content_menu.classList.contains("overflowY")){
                        content_menu.classList.remove("overflowY");
                    }
                }
            }
            $header.style.backgroundColor = "rgb(230, 230, 230, 0.8)";
        };
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ヘッダセレクタクリック時のアクション設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function header_selector_click_set(){
    $header_selector.addEventListener("click", () => {
        header_selector_flg = !(header_selector_flg);
    
        if(header_selector_flg){
            $header_selector.classList.add("cross");
            $content_block.style.display = "block";
            $header.style.backgroundColor = "rgb(235, 235, 235)";
        } else {
            $header_selector.classList.remove("cross");
            $content_block.style.display = "none";
            $header.style.backgroundColor = "rgba(230, 230, 230, 0.8)";
    
            for (let i = 0; i < $menu_expands.length; i++){
                menu_expands_flg[i] = false;
                $menu_expands[i].style.transform = "none";
                $content_menus[i].classList.remove("-hidden");
                $content_menus[i].style.display = "none";
            }
        }
    });
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 拡張ボタンクリック時のアクション設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function menu_expands_click_set(){
    for (let i = 0; i < $menu_expands.length; i++){
        menu_expands_flg.push(false);
    
        $menu_expands[i].addEventListener("click", () => {
            menu_expands_flg[i] = !(menu_expands_flg[i]);
    
            if(menu_expands_flg[i]){
                $menu_expands[i].style.transform = "rotate(90deg)";
                $content_menus[i].onanimationend = null;
                $content_menus[i].classList.remove("-hidden");
                $content_menus[i].style.display = "block";
            } else {
                $menu_expands[i].style.transform = "none";
                $content_menus[i].classList.add("-hidden");
                $content_menus[i].onanimationend = () =>{
                    $content_menus[i].style.display = "none";
                    $content_menus[i].onanimationend = null;
                }
            }
        });
    }
}

/* ツールブロック */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 配列シャッフル関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function shuffleArray(array) {
    const cloneArray = [...array]

    for (let i = cloneArray.length - 1; i >= 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1))
      // 配列の要素の順番を入れ替える
      let tmpStorage = cloneArray[i]
      cloneArray[i] = cloneArray[rand]
      cloneArray[rand] = tmpStorage
    }

    return cloneArray
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 整数ランダム返却関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function randRange(min, max){
    let ans = Math.floor(Math.random() * (max - min + 1)) + min;
    return ans;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ツールアイコンランダム配置関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function random_location(){
    const PERCENT = $tool_table.getBoundingClientRect().width / $tool_table_block.getBoundingClientRect().width * 100;
    const left_position = (50 - PERCENT/2) / 2;
    const right_position = (100 + (50 + PERCENT/2)) / 2;


    let locs = [
        [10, right_position],
        [26, right_position],
        [42, right_position],
        [58, right_position],
        [74, right_position],
        [90, right_position],
        [10, left_position],
        [26, left_position],
        [42, left_position],
        [58, left_position],
        [74, left_position],
        [90, left_position]
    ];

    let i = 0;
    locs = shuffleArray(locs);

    for(const ri of $random_icons){
        let width_random = randRange(5, 10);
        let x_loc = randRange(-left_position + width_random/2*Math.SQRT2, left_position - width_random/2*Math.SQRT2);
        let y_loc = randRange(-8 + width_random/2*Math.SQRT2, 8 - whole_width/2*Math.SQRT2);
        let rotate = randRange(-45, 45);

        // width_random = 10;
        x_loc = locs[i][1] + x_loc;
        y_loc = locs[i][0];
        i += 1;

        ri.style.width = width_random + "%";
        ri.style.top = y_loc + "%";
        ri.style.left = x_loc + "%";
        ri.style.rotate = rotate + "deg";
    }
}


/* 資格ブロック */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 資格詳細表示関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function display_infomation(e){
    let index = Array.prototype.indexOf.call($contents, e.currentTarget);

    $qualification_name.textContent = content_infomations[parseInt(index)][0];
    $qualification_date.textContent = content_infomations[parseInt(index)][1];
    $qualification_block.style.display = "flex";
    $screan_lock.style.display = "block";
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 資格コンテンツクリック時のアクション設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function set_content_click_event(){
    for(const content of $contents){
        content.onclick = display_infomation;
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// スクリーンロッククリック時のアクション設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function set_screanlock_click_event(){
    $screan_lock.onclick = () => {
        $screan_lock.style.display = "none";
        $qualification_block.style.display = "none";
    }
}


/* 目次処理 */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 特定箇所スクロール関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function scroll_to_id(e){
    e.preventDefault();

    let id = e.currentTarget.href;
    id = id.slice(id.indexOf("#")+1, id.length);

    let target = document.getElementById(id);
    let scroll_top = target.getBoundingClientRect().top + window.scrollY - 55;

    if(target.classList.contains("slide")){
        if(play_flg){
            $play_button.click();
        }

        let index = parseInt(id.slice(id.length-1, id.length))-1;

        $slider_selecters[index].click();
    }

    scrollTo({left:0, top:scroll_top, behavior:"smooth"});
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 目次処理設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function set_aTag_click_event(){
    for (const aTag of $aTags){
        if(!aTag.classList.contains("normal_a")){
            aTag.onclick = scroll_to_id;
        }
    }
}


//=============================================
// イベント設定
//=============================================
/* ヘッダ部 */
header_content_hover_set();
header_selector_click_set();
menu_expands_click_set();

/* 資格ブロック */
set_content_click_event();
set_screanlock_click_event();

/* 目次処理 */
set_aTag_click_event();



//=============================================
// スライダー部
//=============================================
const $slide_block = document.getElementById("slider-container");
const $slides = document.getElementsByClassName("slide");
const $slider_selecters = document.getElementsByClassName("slider-selecter");
const $play_button = document.getElementById("slider-play");
const $play_start = document.getElementById("play-start");
const $play_stop = document.getElementById("play-stop");

let whole_width = $slide_block.clientWidth;
let spase_width = 20;   /* px */
let slide_width = $slides[0].clientWidth;  /* px */

const SLIDE_NUM = $slides.length;

let active_slide = 0 + SLIDE_NUM;

let slide_transform_now = false;

// スライダー増加処理
for(let i = 0; i < SLIDE_NUM; i++){
    let copy_slide_after = $slides[i+(i*1)].cloneNode(true);
    let copy_slide_befor = $slides[$slides.length - 1 - 2*(i*1) ].cloneNode(true);
    
    $slide_block.appendChild(copy_slide_after);
    $slide_block.prepend(copy_slide_befor);
}



/* スライダーのアクティブスライド切り替え */
function active_change(){

    /* 移動処理 */
    for (let i = 0; i<$slides.length; i++){
        $slides[i].style.transitionDuration = "0.5s";

        let posi = (i - active_slide) * (slide_width + spase_width);
        $slides[i].style.left = whole_width / 2 - slide_width / 2 + posi + "px";
    
        if( i == active_slide) {
            $slides[i].style.opacity = "1";
        } else {
            $slides[i].style.opacity = "0.3";
        }
    }

    /* 選択バーの設定 */
    let active_slide_tmp = active_slide % SLIDE_NUM;
    for(let i = 0; i < $slider_selecters.length; i++){
        if( i == active_slide_tmp ){
            $slider_selecters[i%SLIDE_NUM].style.backgroundColor = "black";
        } else {
            $slider_selecters[i%SLIDE_NUM].style.backgroundColor = "gray";
        }
    }

    /* 標準化処理 */
    if(( active_slide < SLIDE_NUM ) || ( active_slide >= SLIDE_NUM*2 )){
        slide_transform_now = true;
        // $slides[$slides.length-1].ontransitionend = () => {
        $slides[active_slide].ontransitionend = () => {
            let active_slide_old = active_slide;
            if( active_slide < SLIDE_NUM ){
                active_slide = active_slide + SLIDE_NUM;
            } else if( active_slide >= SLIDE_NUM*2 ){
                active_slide = active_slide - SLIDE_NUM;
            }

            for (let i = 0; i<$slides.length; i++){
                $slides[i].style.transitionDuration = "0s";

                let posi = (i - active_slide) * (slide_width + spase_width);
                $slides[i].style.left = whole_width / 2 - slide_width / 2 + posi + "px";
            
                if( i == active_slide) {
                    $slides[i].style.opacity = "1";
                } else {
                    $slides[i].style.opacity = "0.3";
                }
            }
            // $slides[$slides.length-1].ontransitionend = null;
            $slides[active_slide_old].ontransitionend = null;
            slide_transform_now = false;
        }
    }
}



/* スライダークリック時はそのスライドに移動する */
for(let i = 0; i < $slides.length; i++){
    $slides[i].onclick = () => {
        if(( i != active_slide) && (!slide_transform_now)){
            active_slide = i;
            active_change();
        } else if(( i == active_slide) && (!slide_transform_now)){
            let link = $slides[i].getElementsByTagName("a")[0].getAttribute("href");
            window.location.href = link;
        }
    }
}


/* スライド選択処理 */
for(let i = 0; i < $slider_selecters.length; i++){
    $slider_selecters[i].onclick = () => {
        active_slide = i + SLIDE_NUM;
        active_change();
    }
}

/* スライド自動再生処理 */
let play_flg = false;
let play_interval = null;

$play_button.onclick = () =>{
    play_flg = !play_flg;

    if( play_flg ){
        $play_stop.style.display = "block";
        $play_start.style.display = "none";

        play_interval = setInterval(() => {
            active_slide = active_slide + 1;

            if(active_slide >= $slides.length){
                active_slide = 0;
            }

            active_change();
        }, 5000);
    } else {
        $play_stop.style.display = "none";
        $play_start.style.display = "block";

        clearInterval(play_interval);
    }
}

$play_button.onclick();


function noscroll(e){
    e.preventDefault();
}

/* スライド操作処理(スマホ時) */
$slide_block.ontouchstart = (event) => {
    let baseX = event.changedTouches[0].pageX;
    let distance = 0;
    let active_slide_tmp = active_slide;
    
    for (let i = 0; i<$slides.length; i++){
        $slides[i].style.transitionDuration = "0s";
    }

    document.addEventListener("touchmove", noscroll, {passive: false});
  
    function deside_event(){
        $slide_block.ontouchmove = null;
        $slide_block.ontouchend = null;
        $slide_block.ontouchcancel = null;
        for (let i = 0; i<$slides.length; i++){
            $slides[i].style.transitionDuration = "0.5s";
            $slides[i].style.transform = "none";
        }

        document.removeEventListener("touchmove", noscroll);
      
        active_slide = active_slide_tmp - Math.round(distance / (slide_width + spase_width));
        if (active_slide <= 0){
            active_slide = 0;
        } else if(active_slide >= $slides.length-1){
            active_slide = $slides.length-1;
        }

        active_change();
        if(play_flg){
            play_interval = setInterval(() => {
                if (active_slide + 1 <= $slides.length - 1){
                    active_slide = active_slide + 1;
                } else {
                    active_slide = 0;
                }
    
                active_change();
            }, 5000);
        }
      
    }
    
    $slide_block.ontouchmove = (event) => {
        if(play_flg){
            clearInterval(play_interval);
        }

        distance = event.changedTouches[0].pageX - baseX;
    
        active_slide = active_slide_tmp - Math.round(distance / (slide_width + spase_width));
        if (active_slide <= 0){
            active_slide = 0;
        } else if(active_slide >= $slides.length-1){
            active_slide = $slides.length-1;
        }
    
        for (let i = 0; i<$slides.length; i++){
            let posi = (i - active_slide_tmp) * (slide_width + spase_width);
            $slides[i].style.left = whole_width / 2 - slide_width / 2 + posi + distance + "px";

            if ( i == active_slide ) {
                // $slides[i].style.transform = "translateX(" + distance + "px)";
                $slides[i].style.opacity = "1";
            } else {
                // $slides[i].style.transform = "translateX(" + distance + "px)";
                $slides[i].style.opacity = "0.3";
            }
        }
  
    }
  
    $slide_block.ontouchend = deside_event;
    $slide_block.ontouchcancel = deside_event;
  
  }


/* スライドサイズ変更処理 */
function slider_size_change(){
    whole_width = $slide_block.clientWidth;
    slide_width = $slides[0].clientWidth;

    $slide_block.style.height = slide_width / 2 + "px";
    active_change();
}

active_change();




//=============================================
// ウィンドウサイズ変更時
//=============================================
function size_change(){
    window_width = document.documentElement.clientWidth;

    slider_size_change()

    if(window_width <= BREAK_WIDTH){
        device_kind = "phone";
        $content_block.style.display = "none";
    } else {
        device_kind = "pc";
        $content_block.style.display = "flex";

        header_selector_flg = false;
        $header_selector.classList.remove("cross");
        $header.style.backgroundColor = "rgba(230, 230, 230, 0.8)";

        for (let i = 0; i < $menu_expands.length; i++){
            menu_expands_flg[i] = false;
            $menu_expands[i].style.transform = "none";
            $content_menus[i].classList.remove("-hidden");
            $content_menus[i].style.display = "none";
        }

        if(!first_pc_kind){
            first_pc_kind = true;
            random_location();
        }
    }
}


size_change();
window.onresize = size_change;