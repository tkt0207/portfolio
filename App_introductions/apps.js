//=============================================
// ドキュメントエレメント
//=============================================
/* 携帯用処理 */
const $phone_icon = document.getElementById("phone_icon");
const $header = document.getElementsByTagName('header')[0];
const $header_contents = document.getElementsByClassName('header_content');
const $header_links = document.getElementsByClassName('header_a');
const $header_links_plus = document.getElementsByClassName('header_content_a');

/* プレビュー関連 */
const $slide_view_contents = document.getElementsByClassName('slide_view_content');
const $preview_big = document.getElementById('preview_big');
const $preview_big_return_button = document.getElementById('preview_big_return_button');
const $preview_big_view_area = document.getElementById('preview_big_view_area');
const $preview_big_content = $preview_big_view_area.getElementsByTagName('div');

/* 使い方関連 */
const $use_blocks = document.getElementsByClassName('use_block');
const $columns = document.getElementsByClassName('columns');

/* 開発環境関連 */
const $tags = document.getElementsByClassName('tag');
const $tag_contents = document.getElementsByClassName('tag_content');
const $tag_main = document.getElementById('tag_main');


// 遊び要素
const $title_img = document.getElementById("title_img");
const $smooth_circle = document.getElementById('smooth_circle');
const $smooth_after =$smooth_circle.getElementsByTagName('div')[0];


//=============================================
// 定数定義
//=============================================
/* ブロック識別用ID */
const TOP_ID = "title_block";
const PREVIEW_ID = "preview_block";
const USE_ID = "use";
const TAG_ID = "tag";

/* デバイスの横幅切り替え閾値 */
const DEVICE_WIDTH_HOLD = 750;

/* 使い方ブロック列数閾値 */ 
const USE_WIDTH_HOLD = [
    1000,
    1540
];


//=============================================
// 共通変数定義
//=============================================
/* 切り替えフラグ */
let device_flg = true;

/* メインの上方向のマージン値 */
let main_margin = 0;

/* ウィンドウの横幅 */
let media_screen_width = window.innerWidth;

/* 使い方ブロック(コピー) */
let use_blocks_copy = [];

/* 使い方ブロック列数 */
let col_num = 3;

/* 使い方ブロック列数 前回値 */
let col_num_old = 0;

/* 使い方ブロック開閉フラグ */
let open_flgs = [];


//=============================================
// 関数定義
//=============================================

/******************************************/
// スクロール禁止関数
/******************************************/
function stop_scroll(e){
    // 既存処理の無効化
    if(e.cancelable){
        e.preventDefault();
    }
}


/******************************************/
// ヘッダ表示関数(スマホ時)
/******************************************/
function header_display(set_x, set_y){
    // アイコンのポジションを保持
    let save_x = set_x;
    let save_y = set_y;

    // y位置がページの上下120pxを除くエリア内に収まっていない場合、y位置を補正
    if(set_y <= 120){
        set_y = 120;
    } else if(set_y >= window.innerHeight - 120){
        set_y = window.innerHeight - 120;
    }
    
    // ヘッダのy位置を更新
    $header.style.top = set_y + "px";

    // アイコンに選択中のスタイルを適用
    $phone_icon.classList.add('phone_icon_selected');

    // アイコンの位置をヘッダが表示される真ん中に更新
    $phone_icon.style.top = set_y + "px";
    $phone_icon.style.left = "50%";

    // アイコンの移動が終わったら
    $phone_icon.ontransitionend = () => {
        // ヘッダを表示
        $header.classList.add('display_flex');

        // アイコン移動完了のイベントを削除
        $phone_icon.ontransitionend = null;
    }


    // 終了処理
    function decide(e){
        // 押されたのがヘッダ内の要素の場合、何もしない
        if($header.contains(e.target)){
            return;
        }

        // アイコンから選択中のスタイルを削除
        $phone_icon.classList.remove('phone_icon_selected');

        // アイコンの移動完了イベントを削除
        $phone_icon.ontransitionend = null;

        // アイコンの位置を元の位置に戻す
        $phone_icon.style.top = save_y + "px";
        $phone_icon.style.left = save_x + "px";

        // ヘッダを非表示
        $header.classList.remove('display_flex');

        // ドキュメントからポインターダウンイベントを削除
        document.removeEventListener('pointerdown', decide);
    }

    // ドキュメントにポインターダウンイベントを設定
    document.addEventListener('pointerdown', decide);
}


/******************************************/
// アイコン移動処理関数(スマホ時)
/******************************************/
function icon_move(e){
    // 既存処理の無効化
    e.preventDefault();

    // スマホのタッチムーブイベントを停止
    document.addEventListener( 'touchmove', stop_scroll, { passive: false } );

    // ターゲットを取得
    let target = e.currentTarget;

    // クリック判定をTrueに設定
    let click_check = true;

    // ターゲットのサイズを少し下げる
    target.style.scale = 0.9;

    // アイコンの移動時間を0秒に設定
    target.style.transitionDuration = "0s";

    // 押された位置を取得
    let move_x = e.clientX;
    let move_y = e.clientY;


    // 移動処理
    function move(e){
        // クリック判定をfalseに設定
        click_check = false;

        // 移動後の位置情報を取得
        move_x = e.clientX;
        move_y = e.clientY;

        // アイコンの位置情報を更新
        target.style.top = move_y + "px";
        target.style.left = move_x + "px";
    }


    // 終了処理
    function decide(){
        // アイコンの移動時間を0.2秒に設定
        target.style.transitionDuration = "0.2s";

        // ターゲットのスケールを元に戻す
        target.style.scale = 1;

        // スマホのタッチムーブイベントを元に戻す
        document.removeEventListener( 'touchmove', stop_scroll, { passive: false } ); 

        // 移動補正フラグを定義
        let move_check = false;

        // 横位置が左右40pxを除くページ内に収まっていない場合、横位置を補正
        if(move_x <= 40){
            move_x = 40;
            move_check = true;
        } else if(move_x >= window.innerWidth - 40){
            move_x = window.innerWidth - 40;
            move_check = true;
        }

        // 縦位置が上下40pxを除くページ内に収まっていない場合、縦位置を補正
        if(move_y <= 40){
            move_y = 40;
            move_check = true;
        } else if(move_y >= window.innerHeight - 40){
            move_y = window.innerHeight - 40;
            move_check = true;
        }

        // クリック判定がTrueの場合
        if(click_check){
            // クリック処理
            header_display(move_x, move_y);
        } 
        
        // クリック判定がfalseの場合
        else {
            // 移動補正がされていたら
            if(move_check){
                // アイコンの位置情報を更新
                target.style.top = move_y + "px";
                target.style.left = move_x + "px";
            }
        }
        
        // ドキュメントに設定していたイベントを削除
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerleave', decide);
        document.removeEventListener('pointerup', decide);
    }

    // ドキュメントにイベントを設定
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', decide);
    document.addEventListener('pointerup', decide);
}


/******************************************/
// ヘッダ内のコンテントクリック時の処理関数(スマホ時)
/******************************************/
function display_header_in_content(e){
    // ターゲットを取得
    let target = e.currentTarget;

    // ターゲット内のコンテンツと、戻るボタンを取得
    let in_content = target.getElementsByClassName('header_in_content')[0];
    let return_head = target.getElementsByClassName('return_head')[0];

    // クリックされた要素がターゲット内のコンテンツなら何もしない
    if(in_content.contains(e.target)){
        return;
    }

    // ターゲット内のコンテンツを表示
    in_content.classList.add('display_flex');


    // 終了処理
    function decide(e){
        // 押されたのがヘッダ内のコンテンツなら何もしない
        if($header.contains(e.target)){
            return;
        }

        // ターゲット内のコンテンツを非表示
        in_content.classList.remove('display_flex');

        // ドキュメントに設定していたイベントを削除
        document.removeEventListener('pointerdown', decide);

        // 戻るボタンのイベントを削除
        return_head.removeEventListener('click', decide2);
    }

    // ドキュメントにポインターダウンのイベントを設定
    document.addEventListener('pointerdown', decide);


    // 終了処理2
    function decide2(e){
        // 既存処理の無効化
        e.preventDefault();

        // ターゲット内のコンテンツを非表示
        in_content.classList.remove('display_flex');

        // ドキュメントに設定していたイベントを削除
        document.removeEventListener('pointerdown', decide);
        
        // 戻るボタンのイベントを削除
        return_head.removeEventListener('click', decide2);
    }

    // 戻るボタンにイベントを設定
    return_head.addEventListener('click', decide2);
}


/******************************************/
// ヘッダの初期設定関数(スマホ時)
/******************************************/
function set_header_content_init(){
    for(const header_content of $header_contents){
        if(header_content.classList.contains('header_content_a')){
            continue;
        }
        header_content.addEventListener('click', display_header_in_content);
    }
}


/******************************************/
// PCとスマホでのスタイル変更関数
/******************************************/
function style_change(){
    // スクリーンの横幅を取得
    media_screen_width = window.innerWidth;
    col_change();

    // 横幅が閾値より上の場合
    if(media_screen_width > DEVICE_WIDTH_HOLD){
        // 切り替えフラグがfalseなら何もしない
        if(!device_flg){
            return;
        } 
        
        // 切り替えフラグがtrueの場合
        else {
            // アイコン選択中のスタイルを削除
            $phone_icon.classList.remove('phone_icon_selected');

            // アイコンの移動完了イベントを削除
            $phone_icon.ontransitionend = null;

            // ヘッダの上位置を0に設定
            $header.style.top = "0px";

            // スマホ時専用の表示スタイルを削除
            let remove_target = document.getElementsByClassName('display_flex');
            while(remove_target[0]){
                remove_target[0].classList.remove('display_flex');
            }

            // 切り替えフラグをfalseに設定
            device_flg = false;

            // メインの上方向のマージン値を20に設定
            main_margin = 40;

            // 遊び要素の削除
            $title_img.style.transform = "translateX(0px) translateY(0px)";
            $title_img.style.scale = 1;
            $title_img.classList.remove('title_img_clicked');
            $title_img.classList.remove('title_img_clicked2');
            $title_img.onanimationend = null;
            document.body.classList.remove('body_gragra');
            document.onanimationend = null;
        }
    } 
    
    // 横幅が閾値以下の場合
    else {
        // 切り替えフラグをtrueに設定
        device_flg = true;

        // メインの上方向のマージン値を0に設定
        main_margin = 0;
    }
}

    
/******************************************/
// ヘッダ内のリンククリック処理関数
/******************************************/
function header_link_click_event(e){
    // 既存処理の無効化
    e.preventDefault();

    // 上位置と左位置の変数を定義
    let top = 0;

    // 対象のidの要素を取得
    let id = e.currentTarget.href;
    id = id.slice(id.indexOf("#")+1, id.length);
    let id_target = document.getElementById(id);

    // idがTOPの場合
    if (~id.indexOf(TOP_ID)){
        // idの要素の上位置を取得
        top = id_target.getBoundingClientRect().top + window.scrollY - main_margin;
    }

    // idがプレビューの場合
    else if(~id.indexOf(PREVIEW_ID)){
        // idの要素の上位置を取得
        top = id_target.getBoundingClientRect().top + window.scrollY - main_margin - 20;
    }

    // idが使い方ブロックの場合
    else if(~id.indexOf(USE_ID)){
        // idの要素の上位置を取得
        top = id_target.getBoundingClientRect().top + window.scrollY - main_margin - 20;

        // TODO:対象の使い方ブロックが閉じていたら開く
    }

    // idが開発環境の場合
    else if(~id.indexOf(TAG_ID)){
        // idの要素の上位置を取得
        top = id_target.getBoundingClientRect().top + window.scrollY - main_margin - 20;

        // 対象のidの要素をクリック
        $tag_main.style.transitionDuration = "0s";
        id_target.click();
    }

    // 上記以外の場合は何もしない
    else {
        return;
    }
    

    // ウィンドウを対象の位置までスクロール
    window.scrollTo({
        top: top,
        left: 0,
        behavior: "smooth"
    })

    // 開発環境の場合、スクロール後に変形時間を元に戻す
    if(~id.indexOf(TAG_ID)){
        $tag_main.style.transitionDuration = "1s";
    }
}


/******************************************/
// ヘッダ内のリンクのイベント設定関数
/******************************************/
function set_header_link_init(){
    for(const header_link of $header_links){
        header_link.addEventListener('click', header_link_click_event);
    }
}


/******************************************/
// ヘッダリンクのイベント設定関数
/******************************************/
function set_header_link_plus_init(){
    for(const header_link_p of $header_links_plus){
        header_link_p.addEventListener('click', header_link_click_event);
    }
}



/******************************************/
// ビッグスライドオープン関数
/******************************************/
function open_big_preview(e){
    // ドキュメントのスクロールをOFF
    document.body.style.overflowY = "hidden";

    // ターゲットを取得
    let target = e.currentTarget;

    // ターゲットの要素番号を取得
    let num = Array.prototype.indexOf.call($slide_view_contents, target) - 1;

    // ビッグスライドを表示
    $preview_big.style.display = "flex";

    // ターゲットに対応するブロックまでスクロール
    $preview_big_view_area.scrollTo({
        top: 0,
        left: $preview_big_content[num].offsetLeft,
        behavior: "instant"
    })
}


/******************************************/
// ビッグスライドクローズ関数
/******************************************/
function close_big_preview(){
    document.body.style.overflowY = "auto";
    $preview_big.style.display = "none";
}


/******************************************/
// スライドコンテンツ初期設定関数
/******************************************/
function set_slide_view_init(){
    // 動画判定用の変数を定義
    let video_check = true;

    // スライドの数だけループ
    for(const slide_view_content of $slide_view_contents){
        // 動画の場合は設定しない
        if(video_check){
            video_check = false;
            continue;
        }

        // ビッグスライドオープン処理を設定
        slide_view_content.addEventListener('click', open_big_preview)
    }
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 使い方ブロックコピー初期設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function set_use_blocks(){
    for(let i = 0; i < $use_blocks.length; i++){
        // 使い方ブロックを配列にまとめる(違う配列にまとめておかないと、初めの順番が維持されなくなるため)
        use_blocks_copy.push($use_blocks[i]);
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 使い方ブロック列数変更関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function col_change(){
    // 列数を3(最大値)で初期化
    col_num = 3;

    // ウィンドウの横幅に応じた列数を取得
    for(let i = 0; i < USE_WIDTH_HOLD.length; i++){
        if( media_screen_width < USE_WIDTH_HOLD[i]){
            col_num = i + 1;
            break;
        }
    }

    // 列数が前回と変わらない場合、何もしない
    if(col_num == col_num_old){
        return;
    }

    // 列数の前回値を更新
    col_num_old = col_num;
    
    // 不要なブロックを非表示
    for(let i = 0; i < 3; i++){
        if(i < col_num){
            $columns[i].style.display = "block";
        } else {
            $columns[i].style.display = "none";
        }
    }

    // 使い方ブロックを再配置
    for(let i = 0; i < use_blocks_copy.length; i++){
        let content_index = i % col_num;
        $columns[content_index].appendChild(use_blocks_copy[i]);
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 使い方ブロック拡張処理設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function use_block_set_click(){
    for(let i = 0; i < $use_blocks.length; i++){
        // 使い方ブロックを取得
        let use_block = $use_blocks[i];

        // 対応するフラグをセット
        open_flgs.push(false);

        // タイトル、高さ取得用ブロック、説明ブロック、閉じるボタンを取得
        let use_title = use_block.getElementsByClassName('use_title')[0];
        let get_height = use_block.getElementsByClassName('get_height')[0];
        let use_explain_block = use_block.getElementsByClassName('use_explain_block')[0];
        let use_close_button = use_block.getElementsByClassName('close_use_block')[0];

        // タイトルクリック時の動作を設定
        use_title.onclick = () => {
            // 高さを取得
            let height = get_height.getBoundingClientRect().height;

            // 開閉フラグがONの場合
            if(open_flgs[i]){
                // タイトルから選択中のスタイルを削除
                use_title.classList.remove('use_title_checked');

                // 説明ブロックの変形終了時の処理を削除し、高さを明示的に設定する
                use_explain_block.ontransitionend = null;
                use_explain_block.style.height = height + "px";

                // 説明ブロックの更新
                void use_explain_block.offsetWidth; 
                
                // 説明ブロックの高さを0にする
                use_explain_block.style.height = "0px";

                // 閉じるボタンを非表示
                use_close_button.style.display = "none";
            } 
            
            // 開閉フラグがOFFの場合
            else {
                // タイトルに選択中のスタイルを適用
                use_title.classList.add('use_title_checked');

                // 説明ブロックに高さを設定
                use_explain_block.style.height = height + "px";

                // 説明ブロックの変形が終わり次第、高さを子要素に合わせるように設定
                use_explain_block.ontransitionend = () => {
                    use_explain_block.style.height = "fit-content";
                    use_explain_block.ontransitionend = null;
                }

                // 閉じるボタンを表示
                use_close_button.style.display = "block";
            }

            // 開閉フラグをトグル
            open_flgs[i] = !open_flgs[i];
        }

        // 閉じるボタンクリック時の動作を設定
        use_close_button.onclick = () => {
            // 高さを取得
            let height = get_height.getBoundingClientRect().height;

            // タイトルから選択中のスタイルを削除
            use_title.classList.remove('use_title_checked');

            // 説明ブロックの変形時間終了時の処理を削除し、高さを明示的に設定する
            use_explain_block.ontransitionend = null;
            use_explain_block.style.height = height + "px";

            // 説明ブロックの更新
            void use_explain_block.offsetWidth;
            
            // 説明ブロックの高さを0に設定
            use_explain_block.style.height = "0px";

            // 閉じるボタンを非表示
            use_close_button.style.display = "none";

            // 開閉フラグをOFFに設定
            open_flgs[i] = false;
        }
    }
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 開発環境タグ処理設定関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function set_tag_event(){
    for(const tag of $tags){
        // 開発タグにクリック時の処理を設定
        tag.onclick = click_tags;
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// タグクリック処理関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function click_tags(e){
    // ターゲットを取得
    let target = e.currentTarget;

    // ターゲットに対応するコンテンツを取得
    let content_id = "content" + target.id.slice(target.id.indexOf('tag')+3, target.id.length);
    let display_target = document.getElementById(content_id);

    // タグメインの変形終了時の処理を削除し、高さを明示的に設定
    $tag_main.ontransitionend = null;
    $tag_main.style.height = $tag_main.getBoundingClientRect().height + "px";

    // タグメインを更新
    void $tag_main.offsetWidth;

    // 対応するコンテンツのみ表示
    for(const tag_content of $tag_contents){
        if(tag_content == display_target){
            tag_content.classList.remove('tag_content_hidden');
        } else {
            tag_content.classList.add('tag_content_hidden');
        }
    }

    // タグから選択中のスタイルを削除
    for(const tag of $tags){
        if(tag != target){
            tag.classList.remove('tag_selected');
        }
    }

    // 対象のタグに選択中のスタイルを適用
    target.classList.add('tag_selected');

    // タグメインの高さを設定
    $tag_main.style.height = display_target.getBoundingClientRect().height + "px";

    // タグメインの変形終了時に、高さを子要素に合わせるように設定
    $tag_main.ontransitionend = () => {
        $tag_main.style.height = "fit-content";
        $tag_main.ontransitionend = null;
    }
}



/******************************************/
// イベント設定関数
/******************************************/
function set_event(){
    // アイコンのイベントを設定
    $phone_icon.addEventListener('pointerdown', icon_move);

    // ヘッダ内のコンテンツのイベントを設定
    set_header_content_init();

    // ヘッダ内のリンクのイベントを設定
    set_header_link_init();
    set_header_link_plus_init();

    // ビッグスライド閉じる処理を設定
    $preview_big_return_button.addEventListener('click', close_big_preview);

    // ビッグスライド開く処理を設定
    set_slide_view_init();

    // 使い方ブロックの初期設定
    set_use_blocks();

    // 使い方ブロッククリック時の処理を設定
    use_block_set_click();

    // タグイベントを設定
    set_tag_event();

    // ウィンドウリサイズ時のイベントを設定
    window.addEventListener('resize', style_change);

    // デバイス判定
    style_change();
}


set_event();


/******************************************/
// 遊び要素
/******************************************/
function rotate_img(e){
    // cssで設定してるけど一応
    if(!device_flg){
        return;
    }

    // 既存処理の無効化
    e.preventDefault();

    // ドキュメントのタッチムーブ処理を無効化
    document.addEventListener( 'touchmove', stop_scroll, { passive: false } );

    // ターゲットを取得
    let target = e.currentTarget;

    // クリック位置を取得
    let clientX = e.clientX;
    let clientY = e.clientY;

    // 必要な変数を定義
    let moveX = 0;
    let moveY = 0;
    let deg = 0;
    let distance = 0;

    // 移動処理
    function move(e){
        // 移動量を取得
        moveX = e.clientX - clientX;
        moveY = e.clientY - clientY;

        // 移動距離を取得
        distance = moveX ** 2 + moveY ** 2;

        // 角度を取得
        let rad = Math.atan(moveY/moveX);
        deg = rad * 180 / Math.PI;

        // 距離が閾値未満の場合
        if ( distance < 240 ** 2){
            // 角度を補正
            if(moveX >= 0){
                if(moveY >= 0){
                    deg = 360 - deg;
                } else {
                    deg = -deg;
                }
            } else {
                if(moveY >= 0){
                    deg = 180 - deg;
                } else {
                    deg = 180 - deg;
                }
            }
        } 
        
        // 角度が閾値以上の場合
        else {
            // sin値とcos値を取得
            let sin = Math.sin(rad);
            let cos = Math.cos(rad);

            // 角度と移動量を補正
            if(moveX >= 0){
                if(moveY >= 0){
                    moveX = cos * 240;
                    moveY = sin * 240;
                    deg = 360 - deg;
                } else {
                    moveX = cos * 240;
                    moveY = sin * 240;
                    deg = -deg;
                }
            } else {
                if(moveY >= 0){
                    moveX = cos * -240;
                    moveY = sin * -240;
                    deg = 180 - deg;
                } else {
                    moveX = cos * -240;
                    moveY = sin + -240;
                    deg = 180 - deg;
                }
            }

            // 距離を最大に設定
            distance = 240 ** 2;
        }
        
        // 移動量を半分に設定
        moveX = moveX / 2;
        moveY = moveY / 2;

        // 距離の最大からのパーセント値と拡大係数を定義
        let tmp = distance / (240 ** 2);
        let scale_num = 1 - (tmp * 0.2);
        
        // ターゲットのスケールと位置を更新
        target.style.scale = scale_num;
        target.style.transform = "translateX(" + moveX + "px) translateY(" + moveY + "px)";

        // 角丸サイズを定義
        let left_top = 50 + (tmp * 80);
        let right_bottom = 50 + (tmp * 40);
        let other_radius = 50 + (tmp * 160);

        // ぷにぷにの角丸と角度、位置情報を更新
        $smooth_after.style.borderRadius = left_top + "% " + other_radius + "% " + right_bottom + "% " + other_radius + "%";
        $smooth_after.style.rotate = 315 - deg + "deg";
        $smooth_circle.style.transform = "translateX(" + moveX/4 + "px) translateY(" + moveY/4 + "px)";
    }


    // 終了処理
    function decide(){
        // ターゲットにアニメーションクラスを追加
        $title_img.classList.add('title_img_clicked');
        $title_img.style.setProperty('--x-loc', moveX * -3 + "px");
        $title_img.style.setProperty('--y-loc', moveY * -3 + "px");

        // ぷにぷににアニメーションクラスを追加
        $smooth_circle.classList.add('smooth_animation');
        $smooth_circle.style.setProperty('--x-loc', moveX / -6 + "px");
        $smooth_circle.style.setProperty('--y-loc', moveY / -6 + "px");
        $smooth_after.classList.add('smooth_animation_br');

        // 距離が最大かつ、角度が所定の範囲内の場合
        if((distance >= 240 ** 2) && (deg >= 300) && (deg <= 320)){
            // ドキュメントにグラグラアニメーションを設定(アニメーション終了時に自動でクラスは削除される)
            document.body.classList.add('body_gragra');
            document.body.onanimationend = (e) => {
                if(e.target != document.body){
                    return;
                }
                document.body.classList.remove('body_gragra');
                document.onanimationend = null;
            }
        }

        // ターゲットのアニメーションが終了したら
        $title_img.onanimationend = () => {
            // ターゲットに2回目のアニメーションが適用されている場合
            if($title_img.classList.contains('title_img_clicked2')){
                // ターゲットの位置情報とスケールをリセット
                target.style.transform = "translateX(0px) translateY(0px)";
                target.style.scale = 1;
                
                // ターゲットからアニメーションクラスを削除
                $title_img.classList.remove('title_img_clicked');
                $title_img.classList.remove('title_img_clicked2');
                $title_img.onanimationend = null;

                // ぷにぷにからアニメーションクラスを削除
                $smooth_circle.classList.remove('smooth_animation');
                $smooth_after.classList.remove('smooth_animation_br');

                // ぷにぷにの角丸、角度、位置情報をリセット
                $smooth_after.style.borderRadius = "50%";
                $smooth_after.style.rotate = "0deg";
                $smooth_circle.style.transform = "translateX(0px) translateY(0px)";

            } 
            
            // ターゲットに2回目のアニメーションが適用されていない場合
            else {
                // ターゲットのスケールをリセット
                target.style.scale = 1;

                // ターゲットの位置情報を現在の位置に更新
                target.style.transform = "translateX(" + moveX * -3 + "px) translateY(" + moveY * -3 + "px)";

                // ターゲットに2回目のアニメーションを適用
                $title_img.classList.add('title_img_clicked2');
            }
        }

        // ドキュメントに設定していたイベントを削除
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerleave', decide);
        document.removeEventListener('pointerup', decide);
        document.removeEventListener('touchmove', stop_scroll, { passive: false } );
    }

    // ドキュメントにイベントを設定
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', decide);
    document.addEventListener('pointerup', decide);
}


// タイトル画像ポインターダウン時に処理を実施
$title_img.addEventListener('pointerdown', rotate_img);