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
const $header_icon = document.getElementById("header-icon");

/* 開発環境ブロック */
const $tags = document.getElementsByClassName("tag");
const $tag_contents = document.getElementsByClassName("tag_content");
const $content_area = document.getElementsByClassName("content_area")[0];

/* 使い方ブロック */
const $use_blocks = document.getElementsByClassName("use_block");

/* 目次処理 */
const $aTags = document.getElementsByTagName("a");

//=============================================
// 共通定数の宣言
//=============================================
/* 種別切り替え閾値 */
const BREAK_WIDTH = 960;

/* 使い方ブロック列数閾値 */ 
const view_width_hold = [
    1040,
    1560,
    2080
];


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

/* 使い方ブロック(コピー) */
let use_blocks_copy = [];

/* 使い方ブロック列数 */
let col_num = 3;

/* 使い方ブロック列数 前回値 */
let col_num_old = 0;

/* 使い方ブロック 内包ブロック */
let contents = [document.getElementById("dummy")];

/* 使い方ブロック開閉フラグ */
let open_flgs = [];


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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ホームアイコンクリック処理関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function header_icon_click_event(){
    $header_icon.onclick = () => {
        window.location.href = "../../index.html";
    }
}


/* 目次処理 */
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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 特定箇所スクロール関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function scroll_to_id(e){
    e.preventDefault();

    let id = e.currentTarget.href;
    id = id.slice(id.indexOf("#")+1, id.length);

    let target = document.getElementById(id);
    let scroll_top = target.getBoundingClientRect().top + window.scrollY - 55;

    if(target.classList.contains("tag_content")){
        let index = parseInt(id.slice(id.length-1, id.length))-1;

        $content_area.style.transitionDuration = "0s";
        $tags[index].click();

        scroll_top = target.getBoundingClientRect().top + window.scrollY - 55;
        scrollTo({left:0, top:scroll_top, behavior:"smooth"});
        $content_area.style.transitionDuration = "1s";

        return;
    }

    scrollTo({left:0, top:scroll_top, behavior:"smooth"});
}


/* 使い方ブロック */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 使い方ブロックコピー初期設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function set_use_blocks(){
    for(let i = 0; i < $use_blocks.length; i++){
        use_blocks_copy.push($use_blocks[i]);
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 使い方ブロック列数変更関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function col_change(){
    for(let i = 0; i < view_width_hold.length; i++){
        if( window_width < view_width_hold[i]){
            col_num = i + 1;
            break;
        }
    }

    if(col_num == col_num_old){
        return;
    }

    col_num_old = col_num;

    const $change_col_block = document.getElementsByClassName("change_col_block")[0];
    let del_contents = contents;
    contents = [];
    
    for(let i = 0; i < col_num; i++){
        let content = document.createElement("div");
        $change_col_block.appendChild(content);
        contents.push(content);
    }
    
    for(let i = 0; i < use_blocks_copy.length; i++){
        let content_index = i % col_num;
        contents[content_index].appendChild(use_blocks_copy[i]);
    }

    for(const dc of del_contents){
        dc.remove();
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 使い方ブロック拡張処理設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function use_block_set_click(){
    for(let i = 0; i < $use_blocks.length; i++){
        let use_block = $use_blocks[i];
        open_flgs.push(false);

        let use_title = use_block.getElementsByClassName("use_title")[0];
        let get_height = use_block.getElementsByClassName("get_height")[0];
        let use_explain_block = use_block.getElementsByClassName("use_explain_block")[0];
        let use_close_button = use_block.getElementsByClassName("close_use_block")[0];

        use_title.onclick = () => {
            let height = get_height.getBoundingClientRect().height;
            if(open_flgs[i]){
                use_title.style.background = "none";
                use_title.style.backgroundColor = "white";
                use_title.style.color = "rgb(124, 124, 124)";
                use_title.style.borderRadius = "18px";
                use_title.style.setProperty("--color_outline", "rgba(36, 22, 238, 0.2)");

                use_explain_block.ontransitionend = null;
                use_explain_block.style.height = height + 34 + "px";

                void use_explain_block.offsetWidth; 
                
                use_explain_block.style.height = "0px";

                use_close_button.style.display = "none";
            } else {
                // use_title.style.backgroundColor = "rgb(124, 124, 124)";
                use_title.style.background = "linear-gradient(to right, rgb(200, 50, 200,0.8), rgb(50, 50, 200,0.8), rgb(50, 200, 200,0.8))"
                use_title.style.color = "white";
                use_title.style.borderRadius = "18px 18px 0px 0px";
                use_title.style.setProperty("--color_outline", "transparent");

                // use_title.style.borderRadius = "18px 18px 0px 0px";
                // use_title.style.setProperty("--color_outline", "transparent");
                // use_title.style.backgroundColor = "rgba(36, 22, 238, 0.2)";
                // use_title.style.color = "white";
                // use_title.style.borderBottom = "4px solid rgba(36, 22, 238, 0.2)";
                // use_title.style.color = "rgba(36, 22, 238, 0.2)";
                

                use_explain_block.style.height = height + 34 + "px";
                use_explain_block.ontransitionend = () => {
                    use_explain_block.style.height = "inherit";
                    use_explain_block.ontransitionend = null;
                }

                use_close_button.style.display = "block";
            }

            open_flgs[i] = !open_flgs[i];
        }

        use_close_button.onclick = () => {
            let height = get_height.getBoundingClientRect().height;

            use_title.style.background = "none";
            use_title.style.backgroundColor = "white";
            use_title.style.color = "rgb(124, 124, 124)";
            use_title.style.borderRadius = "18px";
            use_title.style.setProperty("--color_outline", "rgba(36, 22, 238, 0.2)");

            use_explain_block.ontransitionend = null;
            use_explain_block.style.height = height + 34 + "px";

            void use_explain_block.offsetWidth; 
            
            use_explain_block.style.height = "0px";

            use_close_button.style.display = "none";

            open_flgs[i] = false;
        }

    }
}


/* 開発環境ブロック */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 開発環境タグ処理設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function set_tag_event(){
    for(const tag of $tags){
        tag.onclick = click_tags;
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// タグクリック処理関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function click_tags(e){
    let target = e.currentTarget;
    let content_id = "content" + target.id.slice(target.id.indexOf("tag")+3, target.id.length);

    let display_target = document.getElementById(content_id);

    $content_area.ontransitionend = null;
    $content_area.style.height = $content_area.getBoundingClientRect().height + "px";
    void $content_area.offsetWidth;

    for(const tag_content of $tag_contents){
        if(tag_content == display_target){
            tag_content.classList.remove("hidden");
        } else {
            tag_content.classList.add("hidden");
        }
    }

    target.classList.add("selected");

    for(const tag of $tags){
        if(tag != target){
            tag.classList.remove("selected");
        }
    }

    

    $content_area.style.height = display_target.getBoundingClientRect().height + "px";
    $content_area.ontransitionend = () => {
        $content_area.style.height = "inherit";
        $content_area.ontransitionend = null;
    }
}


/* ウィンドウサイズ変更時処理 */
//=============================================
// ウィンドウサイズ変更時
//=============================================
function size_change(){
    window_width = document.documentElement.clientWidth;

    col_change();


    if(window_width <= BREAK_WIDTH){
        device_kind = "phone";
        $content_block.style.display = "none";
    } else {
        device_kind = "pc";
        $content_block.style.display = "flex";

        header_selector_flg = false
        $header_selector.classList.remove("cross");
        $header.style.backgroundColor = "rgba(230, 230, 230, 0.8)";

        for (let i = 0; i < $menu_expands.length; i++){
            menu_expands_flg[i] = false;
            $menu_expands[i].style.transform = "none";
            $content_menus[i].classList.remove("-hidden");
            $content_menus[i].style.display = "none";
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
header_icon_click_event();

/* 目次処理 */
set_aTag_click_event();

/* 使い方ブロック */
set_use_blocks();
col_change();
use_block_set_click();

/* 開発環境ブロック */
set_tag_event();
$tags[0].click();

/* ウィンドウサイズ変更時 */
size_change();
window.onresize = size_change;



const $slide_view_contents = document.getElementsByClassName("slide_view_content");
const $big_img = document.getElementById("big_img");


function zoom_img(e){
    let target = e.currentTarget;
    let target_img = target.getElementsByTagName("img")[0];

    if(target_img == null){
        return;
    }

    target.style.opacity = 0;
    let target_width = target.getBoundingClientRect().width + 80;
    let target_height = target.getBoundingClientRect().height + 80;
    let target_top = target.getBoundingClientRect().top - 40;
    let target_left = target.getBoundingClientRect().left - 40;

    let img = $big_img.getElementsByTagName("img")[0];

    img.setAttribute("src", target_img.getAttribute("src"));
    // img.style.borderRadius = "15px";

    $big_img.style.width = target_width + "px";
    $big_img.style.height = target_height + "px";
    $big_img.style.top = target_top + "px";
    $big_img.style.left = target_left + "px";
    $big_img.style.backgroundColor = "transparent";
    $big_img.style.borderRadius = "50%";

    $big_img.style.display = "flex";

    function deceide_event(){
        target.style.opacity = 1;
        $big_img.style.display = "none";
        document.onclick = "none";
        document.onscroll = "none";
    }

    function click_check(e){
        if(e.target != target && e.target != target_img){
            deceide_event();
        }
    }

    document.onclick = click_check;
    document.onscroll = deceide_event;
}

function slide_content_click_set(){
    for(const slide_view_content of $slide_view_contents){
        slide_view_content.onclick = zoom_img;
    }
}

slide_content_click_set();