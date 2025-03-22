//================================================================
// ドキュメントエレメント
//================================================================
/* 資格ブロック関連 */
const $qual_cards = document.getElementsByClassName('qual_card');
const $qual_content = document.getElementById('qual_content');
const $qual_name = document.getElementById('qual_name');
const $qual_time = document.getElementById('qual_time');
const $screan_lock = document.getElementById('screan_lock');
const $qual_content_close_button = document.getElementById('qual_content_close_button');

/* ツール関連 */
const $tool_place_area = document.getElementById('tool_place_area');
const $tool_main = document.getElementById('tool_main');
const $tool_header_contents = document.getElementsByClassName('tool_header_content');
const $tool_main_contents = document.getElementsByClassName('tool_main_content');

/* 制作物関連 */
const $sub_works = document.getElementsByClassName("sub_work");
const $main_work = document.getElementById("main_work");

/* スキル関連 */
const $skill_cards = document.getElementsByClassName('skill_card');
const $skill_cards_block = document.getElementById('skill_cards');
const $slide_locations = document.getElementById('slide_location').getElementsByTagName('a');

/* 携帯用処理 */
const $phone_icon = document.getElementById("phone_icon");
const $header = document.getElementsByTagName('header')[0];
const $header_contents = document.getElementsByClassName('header_content');
const $header_links = document.getElementsByClassName('header_a');


//================================================================
// 定数定義
//================================================================
/* ブロック識別用ID */
const SKILL_ID = "skill";
const QUAL_ID = "_qual";
const WORK_ID = "_work";
const TOOL_ID = "_tool";

/* デバイスの横幅切り替え閾値 */
const DEVICE_WIDTH_HOLD = 750;


//================================================================
// 共通変数定義
//================================================================
/* 切り替えフラグ */
let device_flg = true;

/* メインの上方向のマージン値 */
let main_margin = 0;


//================================================================
// 関数定義
//================================================================

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
// 資格詳細オープン関数
/******************************************/
function open_qual_content(e){
    // ターゲットの取得
    let target = e.currentTarget;

    // 資格名称と取得日時の取得
    let name = target.getElementsByClassName('edit_name')[0].textContent;
    let time = target.getElementsByClassName('edit_time')[0].textContent;

    // 資格詳細ブロックに反映
    $qual_name.textContent = name;
    $qual_time.textContent = time;

    // 資格詳細ブロックを表示
    $qual_content.style.display = "block";
    $screan_lock.style.display = "block";

    // スクロール動作を無効化
    document.addEventListener( 'touchmove', stop_scroll, { passive: false } ); 
    document.addEventListener( 'wheel', stop_scroll, { passive: false } );
}


/******************************************/
// 資格詳細クローズ関数
/******************************************/
function close_qual_content(){
    // 資格詳細ブロックを非表示
    $qual_content.style.display = "none";
    $screan_lock.style.display = "none";

    // スクロール動作の無効化を解除
    document.removeEventListener( 'touchmove', stop_scroll, { passive: true } ); 
    document.removeEventListener( 'wheel', stop_scroll, { passive: true } );
}


/******************************************/
// 資格カードクリック時の処理初期設定関数
/******************************************/
function set_qual_card_init(){
    // 資格カードクリック時の動作を設定
    for(const qual_card of $qual_cards){
        qual_card.addEventListener('click', open_qual_content);
    }
}


/******************************************/
// ツール使用経験ブロック処理初期設定関数
/******************************************/
function set_tool_init(){
    // ツールヘッダの初期設定
    for(let i = 0; i < $tool_header_contents.length; i++){

        // ツールヘッダとそれに対応するメインブロック内のコンテンツを取得
        let tool_header_content = $tool_header_contents[i];
        let tool_main_content = $tool_main_contents[i];

        // ツールヘッダクリック時の動作を設定
        tool_header_content.onclick = () => {

            // ツールメインブロックの高さを明示的に設定
            $tool_main.style.height = $tool_main.getBoundingClientRect().height + "px";
            void $tool_main.offsetWidth;

            // メインブロック内のコンテンツを全て非表示
            for(const tmc of $tool_main_contents){
                tmc.style.display = "none";
            }

            // ヘッダに適応されている選択中のスタイルをすべて削除
            let remove_target = $tool_place_area.getElementsByClassName('tool_header_content_selected');
            while(remove_target[0]){
                remove_target[0].classList.remove('tool_header_content_selected');
            }

            // 対応するメインブロック内のコンテンツを表示
            tool_main_content.style.display = "block";

            // 対応するヘッダに選択中のスタイルを適用
            tool_header_content.classList.add('tool_header_content_selected');

            // ツールメインブロックの高さを設定
            let set_height = tool_main_content.getBoundingClientRect().height;
            $tool_main.style.height = set_height + 8 + "px";

            // ツールメインブロックの高さの設定が終わり次第、高さを内部の高さに合わせる設定にする
            $tool_main.ontransitionend = () => {
                $tool_main.style.height = "fit-content";
                $tool_main.ontransitionend = null;
            }
            
            // 対応する色情報を取得
            let styles = getComputedStyle(tool_header_content);
            let set_color = styles.getPropertyValue('--main-color');

            // ツール配置エリアの枠線の色を変更
            $tool_place_area.style.setProperty('--select-color', set_color);
        }
    }
}


/******************************************/
// 成果物カードクリック時の動作関数
/******************************************/
function work_link(e){
    // ターゲットとリンクを取得
    let target = e.currentTarget;
    let link = target.getElementsByTagName('a')[0];

    // リンク先に移動
    link.click();
}



/******************************************/
// 成果物ブロックの初期設定関数
/******************************************/
function set_work_init(){
    // メインの成果物カードにクリック時の処理を設定
    $main_work.getElementsByClassName('work_card')[0].addEventListener('click', work_link);

    // サブブロック内のカードに処理を設定
    for(const sub_work of $sub_works){
        
        // カードブロックとカードを取得
        let work_card_block = sub_work.getElementsByClassName('work_card_block')[0];
        let work_card = work_card_block.getElementsByClassName('work_card')[0];

        // カードのクリック時の処理を設定
        work_card.onclick = () => {
            
            // 選択中のスタイルを削除
            let remove_target = document.getElementsByClassName('work_card_selected');
            while(remove_target[0]){
                remove_target[0].classList.remove('work_card_selected');
            }

            // クリックされた要素のコピーを生成
            let clone = work_card_block.cloneNode(true);

            // コピーからid要素を削除
            clone.getElementsByClassName('work_card')[0].removeAttribute('id');

            // コピーにクリック時の処理を設定
            clone.getElementsByClassName('work_card')[0].addEventListener('click', work_link);

            // メイン内のコンテンツをクリア
            $main_work.innerHTML = "";

            // 生成したコピーをメインに追加
            $main_work.appendChild(clone);

            // クリックされた要素に選択中のスタイルを適用
            work_card.classList.add('work_card_selected');
        }
    }
}


/******************************************/
// スキルブロックの初期設定関数
/******************************************/
function set_skill_init(){
    // スキルカードブロックの最初と最後の要素のコピーを生成
    let slide_num = $skill_cards.length;
    let clone_first = $skill_cards[0].cloneNode(true);
    let clone_last = $skill_cards[slide_num - 1].cloneNode(true);
    
    // 生成したコピーからidを削除
    clone_first.removeAttribute('id');
    clone_last.removeAttribute('id');
    
    // スキルブロックに生成したコピーを追加
    $skill_cards_block.appendChild(clone_first);
    $skill_cards_block.insertBefore(clone_last, $skill_cards_block.children[0]);


    // スクロール時の処理を設定
    $skill_cards_block.onscroll = (e) => {
        // ロケーションマップの更新
        for(let i = 1; i < slide_num + 1; i++){
            // スライドのページからの横位置を取得
            let left = $skill_cards[i].getBoundingClientRect().left;

            // 横位置がページ内に収まっている場合
            if((left >= 0) && (left <= $skill_cards_block.getBoundingClientRect().width)){
                
                // 選択中のスタイルを削除
                let remove_target = document.getElementsByClassName('a_selected');
                while(remove_target[0]){
                    remove_target[0].classList.remove('a_selected');
                }

                // 対象のロケーションマップに選択中のスタイルを適用
                $slide_locations[i-1].classList.add('a_selected');
                break;
            }
        }
    
        // スクロール量を取得
        let left_amount = e.currentTarget.scrollLeft;

        // 最後までスクロールしたら、コピーを追加する前の最初のスライドに戻る
        if(left_amount == clone_first.offsetLeft){
            let remove_target = document.getElementsByClassName('a_selected');
    
            while(remove_target[0]){
                remove_target[0].classList.remove('a_selected');
            }
            $slide_locations[0].classList.add('a_selected');
            $skill_cards_block.scrollTo({
                top: 0, 
                left: $skill_cards[1].offsetLeft,
                behavior: "instant"
            });
        } 
        
        // 最初までスクロールしたら、コピーを追加する前の最後のスライドに戻る
        else if(left_amount == clone_last.offsetLeft){
            let remove_target = document.getElementsByClassName('a_selected');
    
            while(remove_target[0]){
                remove_target[0].classList.remove('a_selected');
            }
            $slide_locations[slide_num - 1].classList.add('a_selected');
            $skill_cards_block.scrollTo({
                top: 0, 
                left: $skill_cards[slide_num].offsetLeft,
                behavior: "instant"
            });
        }
    }

    // ロケーション選択時の処理を設定
    for(const slide_location of $slide_locations){
        slide_location.onclick = (e) => {
            // 既存処理の無効化
            e.preventDefault();
    
            // 対象のidの要素を取得
            let id = slide_location.href;
            id = id.slice(id.indexOf("#")+1, id.length);
            let target = document.getElementById(id);

            // idの要素の横位置を取得
            let left = target.offsetLeft;
    
            // idの要素までスクロール
            $skill_cards_block.scrollTo({
                top: 0, 
                left:left,
                behavior: "smooth"
            });
        }
    }

    // 初めは元の1枚目のスライドに設定
    $skill_cards_block.scrollTo({
        top: 0, 
        left: $skill_cards[1].offsetLeft,
        behavior: "instant"
    });
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
        header_content.addEventListener('click', display_header_in_content);
    }
}


/******************************************/
// PCとスマホでのスタイル変更関数
/******************************************/
function style_change(){
    // スクリーンの横幅を取得
    let media_screen_width = window.innerWidth;

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
            main_margin = 20;
            
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
    let left = 0;

    // 対象のidの要素を取得
    let id = e.currentTarget.href;
    id = id.slice(id.indexOf("#")+1, id.length);
    check_title = id.slice(id.length - 5, id.length);
    let id_target = document.getElementById(id);

    // idがスキルブロックの場合
    if(check_title == SKILL_ID){
        // idの要素の上位置と横位置を取得
        top = id_target.getBoundingClientRect().top + window.scrollY - main_margin;
        left = id_target.offsetLeft;

        // スキルブロックを対象のidの要素までスクロール
        $skill_cards_block.scrollTo({
            top: 0, 
            left:left,
            behavior: "smooth"
        });
        
    }
    
    // idが資格ブロックの場合
    else if(check_title == QUAL_ID){
        // idの要素の上位置を取得
        top = id_target.getBoundingClientRect().top + window.scrollY - main_margin*2 - 20;

    } 
    
    // idが成果物ブロックの場合
    else if(check_title == WORK_ID){
        // idの要素の上位置を取得
        top = $main_work.getBoundingClientRect().top + window.scrollY - main_margin*2 - 20;

        // 対象のidの要素をクリック
        id_target.click();

    } else if(check_title == TOOL_ID){
        // idの要素の上位置を取得
        top = $tool_place_area.getBoundingClientRect().top + window.scrollY - main_margin*2 - 20;

        // 対象のidの要素をクリック
        id_target.click();

    } else {
        return;
    }

    // ウィンドウを対象の位置までスクロール
    window.scrollTo({
        top: top,
        left: 0,
        behavior: "smooth"
    })
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
// イベント設定関数
/******************************************/
function set_event(){
    // 資格カードのイベントを設定
    set_qual_card_init();

    // 資格詳細ブロックのクローズボタンのイベント設定
    $qual_content_close_button.addEventListener('click', close_qual_content);

    // ツールブロックのイベントを設定
    set_tool_init();

    // 成果物ブロックのイベントを設定
    set_work_init();

    // スキルブロックのイベントを設定
    set_skill_init();

    // アイコンのイベントを設定
    $phone_icon.addEventListener('pointerdown', icon_move);

    // ヘッダ内のコンテンツのイベントを設定
    set_header_content_init();

    // ヘッダ内のリンクのイベントを設定
    set_header_link_init();

    // ウィンドウリサイズ時のイベントを設定
    window.addEventListener('resize', style_change);

    // デバイス判定
    style_change();
}


set_event();



// ここから下は遊び要素、なくてもいい

//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// ツールアイコン狙撃用
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// 要素の取得
const $tool_icons = document.getElementsByClassName('tool_icon');
const $tool_title = document.getElementById('tool_title');

// カウンタの定義
let nock_down_count = 0;

// ツールアイコンクリック時の処理
function click_tool_icon(e){
    // ターゲットの取得
    let target = e.currentTarget;

    // ターゲットの横位置を取得し、その位置に固定させる
    target.style.left = target.offsetLeft + "px";

    // 倒れるアニメーションを適用
    target.style.animation = "nock_down 2s forwards";

    // クリック時のエフェクトを取得
    let clone = document.getElementsByClassName('flower')[0].cloneNode(true);

    // エフェクトをクリック位置に配置
    clone.style.top = e.clientY + "px";
    clone.style.left = e.clientX + "px";
    clone.style.display = "block";
    document.body.appendChild(clone);

    // カウンタを回す
    nock_down_count += 1;

    // ターゲットのアニメーションが終了したら
    target.onanimationend = () => {
        // ターゲットを非表示に設定
        target.style.display = "none";

        // アニメーション終了時の処理を削除
        target.onanimationend = null;

        // エフェクトを削除
        clone.remove();

        //全てのアイコンをクリックしていたら、タイトルバーの横に王冠を出す
        if(nock_down_count == $tool_icons.length){
            $tool_title.style.setProperty('--display-before', 'block');
        }
    }
}

// ツールアイコンにクリック時の処理を追加
for(const tool_icon of $tool_icons){
    tool_icon.addEventListener('click', click_tool_icon);
}


//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// 猫お怒り用
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// 要素の取得 
const $cat = document.getElementById('cat');
const $crow = document.getElementById('crow');

// 猫の攻撃
function cat_atack(e){
    // ターゲットを取得
    let target = e.currentTarget;

    // クリック位置を取得
    let locX = e.clientX;
    let locY = e.clientY;

    // 猫のアニメーション位置を取得
    let animation_loc = window.getComputedStyle(target).offsetDistance;
    animation_loc = parseFloat(animation_loc.slice(0, animation_loc.length - 1));

    // 猫のアニメーションを一時停止する
    target.style.animationPlayState = "paused";

    // 猫を攻撃のgifに変更する
    const gifUrl = "./img/cat_atack.gif";
    const timestamp = new Date().getTime();
    target.style.maskImage = `url('${gifUrl}?t=${timestamp}')`;

    // ドキュメントのスクロールと全てのイベントを無効にする
    document.body.style.pointerEvents = "none";
    document.body.style.overflowY = "hidden";

    // 爪の位置をクリックしたところにする
    $crow.style.top = locY + "px";
    $crow.style.left = locX + "px";

    // 爪をアニメーションの進行状況に合わせて回転させる
    if(animation_loc > 50){
        $crow.style.rotate = "0deg";
    } else {
        $crow.style.rotate = "90deg";
    }

    // 爪を表示
    $crow.style.display = "flex";

    // リセット関数
    function reset(){
        // 猫のアニメーションを元に戻す
        target.style.maskImage = "url(./img/cat_wark.gif)";
        target.style.animationPlayState = "running";

        // ドキュメントの状態を元に戻す
        document.body.classList.remove('body_animation');
        document.body.style.pointerEvents = "all";
        document.body.style.overflowY = "auto";
        document.body.onanimationend = null;
        document.body.onanimationcancel = null;

        // 爪の状態を元に戻す
        $crow.style.display = "none";
        $crow.onanimationend = null;
        $crow.onanimationcancel = null;
    }

    // 爪のアニメーション終了時
    $crow.onanimationend = () => {
        // 爪を非表示に設定
        $crow.style.display = "none";

        // ドキュメントにアニメーションを設定
        document.body.classList.add('body_animation');
    }

    // 爪のアニメーションキャンセル時はリセット
    $crow.onanimationcancel = () => {
        reset();
    }

    // ドキュメントのアニメーション終了時はリセット
    document.body.onanimationend = (e) => {
        if(e.target != document.body){
            return;
        }
        reset();
    }

    // ドキュメントのアニメーションキャンセル時はリセット
    document.body.onanimationcancel = (e) => {
        if(e.target != document.body){
            return;
        }
        reset();
    }
}

// 猫にクリック時の処理を設定
$cat.addEventListener('click', cat_atack);