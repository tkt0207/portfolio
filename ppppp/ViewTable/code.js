import * as DB from './db.js';

//=============================================================================
// ドキュメント要素
//=============================================================================

//---- インプット要素 ----//
// 対象データベースリスト
const $select_db = document.querySelector("#select_db");
// 対象テーブルリスト
const $select_table = document.querySelector("#select_table");

// 表示件数リスト
const $select_count = document.querySelector("#select_count");
// ページ選択リスト
const $select_page = document.querySelector("#select_page");

// 最初に戻るボタン
const $btn_rtn_all = document.querySelector("#btn_rtn_all");
// 一つ戻るボタン
const $btn_rtn_one = document.querySelector("#btn_rtn_one");
// 一つ進むボタン
const $btn_nxt_one = document.querySelector("#btn_nxt_one");
// 最後に進むボタン
const $btn_nxt_all = document.querySelector("#btn_nxt_all");

// 改行切替チェックボックス
const $chk_switch_enter = document.querySelector("#chk_switch_enter");
// 表幅切替チェックボックス
const $chk_switch_view = document.querySelector("#chk_switch_view");

// テーブル情報切替チェックボックス
const $chk_switch_type = document.querySelector("#chk_switch_type");

// テーブルデータコピーボタン
const $btn_copy_table = document.querySelector("#btn_copy_table");

// お気に入り表示ボタン
const $btn_show_favorite = document.querySelector("#btn_show_favorite");
// お気に入り追加ボタン
const $btn_add_favorite = document.querySelector("#btn_add_favorite");

// フィルタ追加ボタン
const $filter_add_btn = document.querySelector("#filter_add_btn");

// 設定表示切替チェックボックス
const set_tgl = document.querySelector("#set_tgl");

// お気に入り名
const $i_fav_name = document.querySelector("#i_fav_name");

// お気に入り追加ボタン
const $btn_fav_add = document.querySelector("#btn_fav_add");

// お気に入りキャンセルボタン
const $btn_fav_cancel = document.querySelector("#btn_fav_cancel");


//---- アウトプット要素 ----//
// 設定画面
const $setting_view = document.querySelector("#setting_view");

// 設定リスト
const $lists = $setting_view.querySelectorAll(".list");

// 表示テーブル
const $view_table = document.querySelector("#view_table");

// 表示メッセージ
const $view_message = document.querySelector("#view_message");

// テーブル情報
const $view_table_explain = document.querySelector("#view_table_explain");

// 総ページ数
const $total_page_no = document.querySelector("#total_page_no");

// 総行数
const $total_row_no = document.querySelector("#total_row_no");

// お気に入りリストラッパー
const $favorite_list = document.querySelector("#favorite_list").querySelector(".wrapper");

// お気に入り追加画面
const $favorite_add_view = document.querySelector("#favorite_add_view");

//=============================================================================
// 定数定義
//=============================================================================
const LIST_TYPES = {
    VIEW: 0,
    SORT: 1,
    FILTER: 2
}
const FILTER_TYPES = ["=", ">=", "<=", ">", "<", "!=", "in"];
const SORT_TYPES = ["－", "▲", "▼"];
const TABLE_CLASS = "d_table";
const TABLE_HEAD_PIC_CLASS = "pic";

const COL_MIN_WIDTH = 30;

const SET_TIMINGS = {
    IMD: 0,
    CLOSE: 1,
    OPEN: 2,
}

//=============================================================================
// グローバル変数
//=============================================================================
let table_data = {};
let init_table = [];
let sort_order = [];
let col_views = [];
let page_num = 0;

// 設定反映タイミングフラグ(0:条件変更時 1:設定画面閉時)
let set_timing_flg = SET_TIMINGS.CLOSE;

// 設定変更有無フラグ
let change_setting_flg = false;

// テーブル変更フラグ
let change_table_flg = true;

// お気に入り設定
let fav_setting = {d_name:"", t_name:"", type:"", count:10, filters:[], sorts:[], views:[], order:[]};

// 現在の設定
let now_setting = {d_name:"", t_name:"", type:"", count:10, filters:[], sorts:[], views:[], order:[]};


//=============================================================================
// 関数定義
//=============================================================================

//=============================================
// スクロール禁止関数
//---------------------------------------------
// 引数: e -> イベント変数
// 戻り値: -
//---------------------------------------------
// 説明：
//   スクロール禁止
//=============================================
function stop_scroll(e){
    // 既存処理の無効化
    if(e.cancelable){
        e.preventDefault();
    }
}

//=============================================
// テーブル初期情報保持関数
//---------------------------------------------
// 引数: table -> 対象のテーブル
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルの初期状態を保持
//=============================================
function state_init_table(table) {
    return Array.from(table.querySelectorAll('tr')).map(row =>
        Array.from(row.children)
    );
}


//=============================================
// お気に入り呼び出し関数
//---------------------------------------------
// 引数: e -> イベント変数
// 戻り値: -
//---------------------------------------------
// 説明：
//   お気に入り設定を呼び出す
//=============================================
async function call_fav_setting(e) {
    const target = e.currentTarget;
    const fav_id = target.dataset.fav_id;

    // TODO:DBからの呼び出し処理でfav_settingを更新する
    fav_setting = DB.get_fav_setting(fav_id);

    // 件数/列並び順/列表示情報を更新
    $select_count.value = fav_setting.count;
    sort_order = fav_setting.order;
    col_views = fav_setting.views;

    // DB変更
    $select_db.value = fav_setting.d_name;
    
    // 対象テーブル取得
    const table_names = await DB.get_tables(fav_setting.d_name);

    // テーブル選択リスト更新
    $select_table.innerHTML = "";
    $select_table.value = -1;
    table_names.forEach(t_name => {
        const table_name = t_name;
        const option = document.createElement("option");
        option.value = table_name;
        option.innerHTML = table_name;
        if(table_name == fav_setting.t_name){
            option.selected = true;
        }
        $select_table.appendChild(option);
    })

    // テーブル変更
    setTimeout(() => {
        change_table();
        // お気に入り設定クリア
        fav_setting = {d_name:"", t_name:"", type:"", count:10, filters:[], sorts:[], views:[], order:[]};
    })
}


//=============================================
// お気に入りリスト作成関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   お気に入りリストを作成する
//=============================================
function create_fav_list(){
    const list = DB.get_fav_list();

    $favorite_list.innerHTML = "";
    list.forEach(l => {
        const item = document.createElement("button");
        item.classList.add("item");
        item.dataset.fav_id = l.id;
        
        const text = document.createElement("div");
        text.innerHTML = l.name;

        item.addEventListener("click", call_fav_setting);
        item.addEventListener("contextmenu", async (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const fav_id = target.dataset.fav_id;
            const info = DB.get_fav_setting(fav_id);

            if (confirm(`${info.name}を削除しますか？`)) {
                await DB.delete_fav_setting(fav_id);
                create_fav_list();
            }
        })

        item.appendChild(text);
        $favorite_list.appendChild(item);
    })
}


//=============================================
// お気に入り追加関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   お気に入りに追加する
//=============================================
async function add_fav(){
    now_setting.order = sort_order;
    now_setting.views = col_views;

    // TODO:追加のDB
    await DB.add_fav_setting({name: $i_fav_name.value, ...now_setting});
    create_fav_list();

    // 追加画面を閉じる
    close_fav_add_view();

    $view_message.style.display = "none";
    $view_message.classList.remove("anime");
    void $view_message.offsetWidth;

    $view_message.textContent = "お気に入りに追加しました。";

    $view_message.classList.add("anime");
    $view_message.style.display = "block";
}


//=============================================
// お気に入り追加画面閉じる関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   お気に入り追加画面を閉じる
//=============================================
function close_fav_add_view(){
    $i_fav_name.value = "";
    $favorite_add_view.hidePopover();
}


//=============================================
// お気に入り追加イベント設定関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   お気に入り追加イベントを設定する
//=============================================
function set_fav_add_event(){
    $btn_fav_cancel.addEventListener("click", close_fav_add_view);
    $btn_fav_add.addEventListener("click", add_fav);
}


//=============================================
// テーブルデータ取得関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルの初期状態を保持
//=============================================
async function get_table_data() {
    // DB名
    const db_name = $select_db.value;
    // テーブル名
    const table_name = $select_table.value;
    // テーブル種別
    const table_type = $chk_switch_type.checked;
    // 表示件数
    const view_count = Number($select_count.value);
    // ページNo
    const page_no = Number($select_page.value);

    // フィルターアイテム
    const filter_items = document.querySelectorAll(".filter_item");
    // フィルター条件
    let filters = [];
    filter_items.forEach(f => {
        const f_col_no = Number(f.querySelector(".filter_col").value);
        const f_type = Number(f.querySelector(".filter_type").value);
        const f_content = f.querySelector(".filter_content").value;

        if(f_col_no == -1) return;
        if(f_type == -1) return;

        filters.push({col_no: f_col_no, type: f_type, content: f_content});
    })

    // 並び替えアイテム
    const sort_items = document.querySelectorAll(".sort_item");
    // 並び替え条件
    let sorts = [];
    sort_items.forEach(s => {
        const s_prim = s.querySelector(".sort_prim").value;
        const s_type = s.querySelector(".sort_type").value;

        if(s_prim <= 0) return;
        if(s_type <= 0) return;

        sorts.push({col_no: s.dataset.no, prim: s_prim, type: s_type});
    })
    sorts.sort((a,b) => {
        const pa = Number(a.prim);
        const pb = Number(b.prim);
        return pa - pb;
    })

    // テーブルデータ更新
    table_data = await DB.get_table_data(db_name, table_name, table_type, view_count, page_no, filters, sorts);

    // 現在設定更新
    now_setting = {d_name:db_name, t_name:table_name, type:table_type, count:view_count, filters:filters, sorts:sorts, views:[], order:[]};
}


//=============================================
// テーブル作成関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルを作成する
//=============================================
function create_table(){
    // テーブルヘッダ生成
    const keys = table_data.keys;
    const data = table_data.data;
    const thead = document.createElement("thead");
    const thead_tr = document.createElement("tr");
    keys.forEach(key => {
        // TH生成
        const th = document.createElement("th");

        // 列名表示ラベル生成
        const div = document.createElement("div");
        div.innerHTML = key;

        // ピッカー生成
        const pic = document.createElement("div");
        pic.classList.add(TABLE_HEAD_PIC_CLASS);
        pic.addEventListener("pointerdown", change_col_width);
        
        // DOMツリー作成
        th.appendChild(div);
        th.appendChild(pic);
        thead_tr.appendChild(th);
    })
    thead.appendChild(thead_tr);

    // テーブルボディ生成
    const tbody = document.createElement("tbody");
    data.forEach(row => {
        // 行生成
        const tbody_tr = document.createElement("tr");
        // TD生成
        keys.forEach(key => {
            const td = document.createElement("td");
            td.innerHTML = row[key];
            tbody_tr.appendChild(td);
        })
        tbody.appendChild(tbody_tr);
    })

    // テーブル作成
    if(change_table_flg){
        $view_table.innerHTML = "";
        $view_table.appendChild(thead);
    } else {
        if(sort_order.length != 0){
            const tr = $view_table.querySelector("thead").querySelector("tr");
            const cells = tr.querySelectorAll("th");
            const reverse_order = [];
            sort_order.forEach((value, index) => {
                reverse_order[value] = index;
            });

            // 対象の列を並び替え
            const newCells = reverse_order.map(oldIndex => cells[oldIndex]);
            newCells.forEach(cell => tr.appendChild(cell));
        }
        const t_body = $view_table.querySelector("tbody");
        $view_table.removeChild(t_body);
    }
    $view_table.appendChild(tbody);

    change_table_flg = false;
}


//=============================================
// 列幅変更関数
//---------------------------------------------
// 引数: e -> イベント変数
// 戻り値: -
//---------------------------------------------
// 説明：
//  列幅を変更する
//=============================================
function change_col_width(e){
    // 既存処理の無効化
    e.preventDefault();
    // タッチムーブイベントの一時無効化
    document.addEventListener("touchmove", stop_scroll, {passive: false});

    // ターゲットとタッチ位置(X軸)を取得
    const target = e.currentTarget;
    const baseX = e.clientX;

    // 対象のTHとTHの横幅を取得
    const target_th = target.closest("th");
    const th_baseWidth = target_th.getBoundingClientRect().width;
    

    //------------------------------------
    // 移動イベント関数
    //------------------------------------
    function move(e){
        // 移動量を取得
        const moveX = e.clientX - baseX;
        
        // 設定する横幅を計算
        let set_width = th_baseWidth + moveX;
        
        // 閾値判定(TODO:いらんかも)
        if(set_width < COL_MIN_WIDTH){
            set_width = COL_MIN_WIDTH;
        }

        // THに横幅設定
        target_th.style.width = `${set_width}px`;
    }

    //------------------------------------
    // 終了イベント関数
    //------------------------------------
    function end(){
        // 設定したイベントを削除
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", end);
        document.removeEventListener("pointercancel", end);
        document.removeEventListener("pointerup", end);
        document.removeEventListener("touchmove", stop_scroll, {passive: true});
    }

    // イベント設定
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", end);
    document.addEventListener("pointercancel", end);
    document.addEventListener("pointerup", end);
}


//=============================================
// 列表示アイテム作成関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   列表示アイテムを生成する
//=============================================
function create_col_view_item(){
    // キーを取得
    const keys = table_data.keys;
    
    keys.forEach((key, i) => {
        // 列表示アイテムを生成
        const v_label = document.createElement("label");
        v_label.classList.add("vs_col_label");
        v_label.for = `vs_col${i}`;

        // チェックマークを生成
        const v_div = document.createElement("div");
        v_div.classList.add("check_mark");

        // 対象列表示ラベルを生成
        const v_span = document.createElement("span");
        v_span.classList.add("col_name");
        v_span.innerHTML = key;

        // チェックボックスを生成
        const v_input = document.createElement("input");
        v_input.type = "checkbox";
        v_input.id = `vs_col${i}`;
        v_input.dataset.no = i;
        v_input.checked = true;

        // TODO: 要調整。設定読み込み時用
        if(i in fav_setting.views){
            v_input.checked = fav_setting.views[i];
            col_views[i] = fav_setting.views[i];
        }

        // DOMツリー作成
        v_label.appendChild(v_div);
        v_label.appendChild(v_span);
        v_label.appendChild(v_input);

        /* --- イベント設定 --- */
        // チェックボックス
        v_input.addEventListener("change", switch_col_view);

        // アイテム追加
        $lists[LIST_TYPES.VIEW].appendChild(v_label);

        // イベント起動
        if(!v_input.checked){
            v_input.dispatchEvent(new Event("change"));
        }
    })

}


//=============================================
// 並び替えアイテム作成関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   並び替えアイテムを生成する
//=============================================
function create_sort_item(){
    // キーを取得
    const keys = table_data.keys;
    const key_num = keys.length;

    keys.forEach((key, i) => {
        // 並び替えアイテムを生成
        const s_div = document.createElement("div");
        s_div.classList.add("sort_item");
        s_div.dataset.no = i;

        // 並び替え対象列ラベルを生成
        const s_span = document.createElement("span");
        s_span.classList.add("sort_col_name");
        s_span.innerHTML = key;

        // TODO：要調整。設定読み込み時用
        let p_sel_index = 1;
        let t_sel_index = 0;
        const setting = fav_setting.sorts.find(s => s.col_no == i);
        if(setting){
            p_sel_index = setting.prim;
            t_sel_index = setting.type;
        }

        // 並び替え優先度リストを生成
        const s_d_list_p = document.createElement("design-list");
        s_d_list_p.classList.add("sort_prim");
        for(let k = 0; k < key_num; k++){
            const p_op = document.createElement("option");
            const prim_no = k+1;
            p_op.value = prim_no;
            p_op.innerHTML = prim_no;
            if(prim_no == p_sel_index){
                p_op.selected = true;
            }
            s_d_list_p.appendChild(p_op);
        }
        
        // 並び替え種別リストを生成
        const s_d_list_t = document.createElement("design-list");
        s_d_list_t.classList.add("sort_type");
        SORT_TYPES.forEach((type, t) => {
            const t_op = document.createElement("option");
            t_op.value = t;
            t_op.innerHTML = type;
            if(t == t_sel_index){
                t_op.selected = true;
            }
            s_d_list_t.appendChild(t_op);
        })
        
        // DOMツリー作成
        s_div.appendChild(s_span);
        s_div.appendChild(s_d_list_p);
        s_div.appendChild(s_d_list_t);


        /* --- イベント設定 --- */
        // 並び替え優先度リスト
        s_d_list_p.addEventListener("change", () => {
            sort_table();
        })
        // 並び替え種別リスト
        s_d_list_t.addEventListener("change", () => {
            sort_table();
        })
        // 並び替えアイテム
        s_div.addEventListener("pointerdown", col_sort_table_event);

        // アイテム追加
        $lists[LIST_TYPES.SORT].appendChild(s_div);
    })

    // TODO:列並び替え設定参照時
    if(fav_setting.order.length != 0){
        const s_items = document.querySelectorAll(".sort_item");
        if(s_items.length != fav_setting.order.length) return;
        const new_items = fav_setting.order.map(oldIndex => s_items[oldIndex]);
        new_items.forEach(item => $lists[LIST_TYPES.SORT].appendChild(item));
    }
}


//=============================================
// フィルター作成関数
//---------------------------------------------
// 引数: set -> フィルタ情報
// 戻り値: -
//---------------------------------------------
// 説明：
//   フィルターの入力欄を作成する
//=============================================
function create_filter_item(set={col_no:-1, type:-1, content:""}){
    // キーを取得
    const keys = table_data.keys;

    // フィルタアイテムを生成
    const f_div = document.createElement("div");
    f_div.classList.add("filter_item");    

    // 列選択リストを生成
    const f_d_list_c = document.createElement("design-list");
    f_d_list_c.classList.add("filter_col");
    keys.forEach((th, i) => {
        const c_op = document.createElement("option");
        c_op.value = i;
        c_op.innerHTML = th;
        if(set.col_no == i){
            c_op.selected = true;
        }
        f_d_list_c.appendChild(c_op);
    })

    // 演算子選択リストを生成
    const f_d_list_t = document.createElement("design-list");
    f_d_list_t.classList.add("filter_type");
    FILTER_TYPES.forEach((t, i) => {
        const t_op = document.createElement("option");
        t_op.value = i;
        t_op.innerHTML = t;
        if(set.type == i){
            t_op.selected = true;
        }
        f_d_list_t.appendChild(t_op);
    })

    // 比較内容入力欄を生成
    const f_input = document.createElement("input");
    f_input.type = "text";
    f_input.classList.add("filter_content");
    if(set.content){
        f_input.value = set.content;
    }

    // フィルタアイテム削除ボタンを生成
    const f_button = document.createElement("button");
    f_button.classList.add("del_filter");
    const f_button_div = document.createElement("div");
    f_button_div.classList.add("icon");
    
    // DOMツリー作成
    f_button.appendChild(f_button_div);
    f_div.appendChild(f_d_list_c);
    f_div.appendChild(f_d_list_t);
    f_div.appendChild(f_input);
    f_div.appendChild(f_button);

    /* --- イベント設定 --- */
    // フィルタアイテム削除ボタン
    f_button.addEventListener("click", () => {
        f_div.remove();
        filter_table();
    })
    // 列選択リスト
    f_d_list_c.addEventListener("change", () => {
        filter_table();
    })
    // 演算子選択リスト
    f_d_list_t.addEventListener("change", () => {
        filter_table();
    })
    // 比較内容入力欄
    f_input.addEventListener("change", () => {
        filter_table();
    })

    // アイテム追加
    $lists[LIST_TYPES.FILTER].appendChild(f_div);
}


//=============================================
// 列表示切替関数
//---------------------------------------------
// 引数: e -> イベント変数
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルの列の表示を切り替える
//=============================================
function switch_col_view(e){
    // ターゲット取得
    const target = e.currentTarget;
    const value = target.checked;
    const no = Number(target.dataset.no);

    // テーブルの行リストを取得
    const trs = $view_table.querySelectorAll("tr");
    trs.forEach((tr, i) => {
        // 各セルを取得
        const cells = init_table[i];

        // 対象の列の表示切り替え
        if(!value){
            cells[no].classList.add("hidden");
            col_views[no] = false;
        } else {
            cells[no].classList.remove("hidden");
            col_views[no] = true;
        }
    })
}


//=============================================
// テーブル並び替え関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルを並び替える
//=============================================
function sort_table(){
    if(set_timing_flg == SET_TIMINGS.IMD){
        $select_page.value = 1;
        $select_page.dispatchEvent(new Event("change"));
    } else {
        change_setting_flg = true;
    }
}


//=============================================
// テーブルフィルター関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルをフィルターする
//=============================================
function filter_table(){
    if(set_timing_flg == SET_TIMINGS.IMD){
        $select_page.value = 1;
        $select_page.dispatchEvent(new Event("change"));
    } else {
        change_setting_flg = true;
    }
}


//=============================================
// テーブル列並び替え関数
//---------------------------------------------
// 引数: e -> イベント変数
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルの列を並び替える
//=============================================
function sort_table_col(){
    if(sort_order.length == 0) return;
    const trs = $view_table.querySelectorAll("tr");
    trs.forEach((tr, i) => {
        // 各セルを取得
        const cells = init_table[i];

        // 対象の列を並び替え
        const newCells = sort_order.map(oldIndex => cells[oldIndex]);
        newCells.forEach(cell => tr.appendChild(cell));
    })
}


//=============================================
// テーブル列並び替えイベント関数
//---------------------------------------------
// 引数: e -> イベント変数
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルの列並び替えイベント
//=============================================
function col_sort_table_event(e){
    // ターゲット取得
    const target = e.currentTarget;
    if((e.target.tagName == "DESIGN-LIST")){
        return;
    }

    // 既存処理の無効化
    e.preventDefault();
    // タッチムーブイベントの一時無効化
    document.addEventListener("touchmove", stop_scroll, {passive: false});

    // 配置エリアを取得
    const area = target.closest(".list");

    // アイテムリストを取得
    const sort_items = area.getElementsByClassName("sort_item");

    // クリック位置を取得
    const clientY = e.clientY;
    const clientX = e.clientX;
    const offsetY = clientY - target.getBoundingClientRect().top;
    const offsetX = clientX - target.getBoundingClientRect().left;
    const target_width = target.getBoundingClientRect().width;
    
    // クローン生成
    const clone = target.cloneNode(true);
    clone.classList.add("sort_item_moving");
    clone.style.width = `${target_width}px`;
    const d_lists = clone.querySelectorAll("design-list");
    d_lists.forEach(d => {
        clone.removeChild(d);
    })
    document.body.appendChild(clone);
    clone.style.left = `${clientX - offsetX}px`;
    clone.style.top  = `${clientY - offsetY}px`;

    // ターゲットを透明に設定
    target.style.opacity = 0;


    //------------------------------------
    // 移動イベント関数
    //------------------------------------
    function move(e){
        // 位置情報を取得
        const t_clientY = e.clientY;
        const t_clientX = e.clientX;
        
        // クローンの位置を移動
        clone.style.left = `${t_clientX - offsetX}px`;
        clone.style.top  = `${t_clientY - offsetY}px`;
        
        // 判定
        clone.classList.add("hidden");
        const elemBelow = document.elementFromPoint(t_clientX, t_clientY);
        clone.classList.remove("hidden");
        
        if(elemBelow.closest(".sort_item")){
            // 移動元と移動先のindexを取得
            const index_target = Array.prototype.indexOf.call(sort_items, target);
            const index_change_target = Array.prototype.indexOf.call(sort_items, elemBelow.closest(".sort_item"));

            // indexが同じ場合、何もしない
            if(index_target == index_change_target){
                return;
            }

            // 入れ替え
            if(index_target > index_change_target){
                area.insertBefore(target, sort_items[index_change_target]);
            } else {
                if(index_change_target >= sort_items.length - 1){
                    area.appendChild(target);
                } else {
                    area.insertBefore(target, sort_items[index_change_target + 1]);
                }
            }
        }
    }

    //------------------------------------
    // 終了イベント関数
    //------------------------------------
    function end(){
        // クローンを削除する
        clone.remove();

        // ターゲットの透明度を元に戻す
        target.style.opacity = 1;

        // 並び順を更新
        sort_order = [];
        for(let s = 0; s < sort_items.length; s++){
            const no = Number(sort_items[s].dataset.no);
            sort_order.push(no);
        }
        sort_table_col();

        // 設定したイベントを削除
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", end);
        document.removeEventListener("pointercancel", end);
        document.removeEventListener("pointerup", end);
        document.removeEventListener("touchmove", stop_scroll, {passive: true});
    }

    // イベント設定
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", end);
    document.addEventListener("pointercancel", end);
    document.addEventListener("pointerup", end);
}


//=============================================
// テーブル設定更新関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブル設定情報を更新する
//=============================================
function update_table_setting(){
    // 列表示
    $lists[LIST_TYPES.VIEW].innerHTML = "";
    create_col_view_item();

    // 並び順
    $lists[LIST_TYPES.SORT].innerHTML = "";
    create_sort_item();

    // フィルタ
    $lists[LIST_TYPES.FILTER].innerHTML = "";
    if(fav_setting.filters.length <= 0){
        create_filter_item();    
    } else {
        fav_setting.filters.forEach(f => {
            create_filter_item(f);
        })
    }
    
    

    // フィルタ追加ボタンのイベント設定
    $filter_add_btn.addEventListener("click", create_filter_item);
}


//=============================================
// DB切り替え関数
//---------------------------------------------
// 引数: e -> イベント変数
// 戻り値: -
//---------------------------------------------
// 説明：
//   DB切り替えイベントを設定する
//=============================================
async function change_db(e){
    // ターゲット取得
    const target = e.currentTarget;
    const db_name = target.value;

    // 対象テーブル取得
    const table_names = await DB.get_tables(db_name);

    // テーブル選択リスト更新
    $select_table.innerHTML = "";
    $select_table.value = -1;
    table_names.forEach(t_name => {
        const table_name = t_name;
        const option = document.createElement("option");
        option.value = table_name;
        option.innerHTML = table_name;
        $select_table.appendChild(option);
    })
    

    // テーブル変更
    change_table();
}


//=============================================
// テーブル更新関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルを更新
//=============================================
function table_update(){
    // テーブル作成
    create_table();

    // テーブルの初期状態を保持
    init_table = state_init_table($view_table);

    // 総行数更新
    const row_num = table_data.num;
    $total_row_no.innerHTML = row_num;

    // 総ページ数更新
    const count = $select_count.value ?? 1;
    // const page_num_new = Math.ceil(row_num / count);
    const page_num_new = Math.ceil(row_num / count);
    if(page_num_new != page_num){
        page_num = page_num_new;
        $total_page_no.innerHTML = page_num;

        // ページリスト更新
        $select_page.innerHTML = "";
        $select_page.value = -1;
        for(let i = 0; i < page_num; i++){
            const page_no = i + 1;
            const option = document.createElement("option");
            option.value = page_no;
            option.innerHTML = page_no;
            if(page_no == 1){
                option.selected = true;
            }
            $select_page.appendChild(option);
        }
    }

    // ページボタン有効/無効
    setTimeout(() => {
        if(Number($select_page.value) == 1){
            $btn_rtn_all.disabled = true;
            $btn_rtn_one.disabled = true;
        } else {
            $btn_rtn_all.disabled = false;
            $btn_rtn_one.disabled = false;
        }
        if(Number($select_page.value) == page_num){
            $btn_nxt_all.disabled = true;
            $btn_nxt_one.disabled = true;
        } else {
            $btn_nxt_all.disabled = false;
            $btn_nxt_one.disabled = false;
        }
    }, 10);
    

    // 列表示切替
    const vs_col_labels = document.querySelectorAll(".vs_col_label");
    vs_col_labels.forEach(v => {
        const v_input = v.querySelector("input");
        v_input.dispatchEvent(new Event("change"));
    })

    // 列並び替え
    sort_table_col();
}


//=============================================
// テーブル切り替え関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブル切り替えイベントを設定する
//=============================================
async function change_table(){
    // テーブル変更フラグをON
    change_table_flg = true;

    // ページ初期化
    $select_page.value = 1;

    // 各条件削除
    const filter_items = document.querySelectorAll(".filter_item");
    filter_items.forEach(f => {
        f.remove();
    })
    const sort_items = document.querySelectorAll(".sort_item");
    sort_items.forEach(s => {
        s.remove();
    })
    const vs_col_labels = document.querySelectorAll(".vs_col_label");
    vs_col_labels.forEach(v => {
        v.remove();
    })

    // テーブルデータ取得
    await get_table_data();

    // テーブル更新
    table_update();

    // テーブル設定更新
    update_table_setting();

    // テーブル情報更新
    $view_table_explain.innerHTML = table_data.name;
}


//=============================================
// 改行切替関数
//---------------------------------------------
// 引数: e -> イベント変数
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルの改行を切り替える
//=============================================
function switch_break(e){
    const target = e.currentTarget;
    if(target.checked){
        $view_table.classList.add("no_enter_table");
    } else {
        $view_table.classList.remove("no_enter_table");
    }
}


//=============================================
// 表表示切替関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルの表示方法を切り替える
//=============================================
function switch_width_style(e){
    const target = e.currentTarget;
    if(target.checked){
        $view_table.classList.add("min_table");
    } else {
        $view_table.classList.remove("min_table");
    }
}


//=============================================
// テーブル表示切替イベント設定関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルの表示切替イベントを設定する
//=============================================
function set_switch_type_event(){
    $chk_switch_type.addEventListener("change", () => {
        // テーブル変更
        change_table();
    })
}


//=============================================
// テーブルデータコピー関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルデータをクリップボードにコピーする
//=============================================
function copy_table_content(){
    // const text = $view_table.outerHTML;
    let list = [];
    const trs = $view_table.querySelectorAll("tr");
    trs.forEach(tr => {
        let cells = tr.querySelectorAll("td,th");

        let in_list = [];
        cells.forEach(cell => {
            if(cell.classList.contains("hidden")) return;
            in_list.push(cell.textContent);
        })
        list.push(in_list.join("\t"));
    })

    const text = list.join("\n");

    $view_message.style.display = "none";
    $view_message.classList.remove("anime");
    void $view_message.offsetWidth;

    navigator.clipboard.writeText(text)
    .then(() => {
        $view_message.textContent = "コピーしました";
    })
    .catch(err => {
        $view_message.textContent = "コピーに失敗しました"
    });

    $view_message.classList.add("anime");
    $view_message.style.display = "block";
}


//=============================================
// ページ切替イベント設定関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   ページ切替イベントを設定する
//=============================================
function set_switch_page_event(){
    // 最初に戻るボタン
    $btn_rtn_all.addEventListener("click", () => {
        if(page_num <= 0) return;
        let page_no = Number($select_page.value);
        if(page_no == 1) return;
        $select_page.value = 1;
        $select_page.dispatchEvent(new Event("change"));
    })
    // 前へ戻るボタン
    $btn_rtn_one.addEventListener("click", () => {
        if(page_num <= 0) return;
        let page_no = Number($select_page.value) - 1;
        if(page_no < 1) return;
        $select_page.value = page_no;
        $select_page.dispatchEvent(new Event("change"));
    })
    // 次へ進むボタン
    $btn_nxt_one.addEventListener("click", () => {
        if(page_num <= 0) return;
        let page_no = Number($select_page.value) + 1;
        if(page_no > page_num) return;
        $select_page.value = page_no;
        $select_page.dispatchEvent(new Event("change"));
    })
    // 最後に進むボタン
    $btn_nxt_all.addEventListener("click", () => {
        if(page_num <= 0) return;
        let page_no = Number($select_page.value);
        if(page_no == page_num) return;
        $select_page.value = page_num;
        $select_page.dispatchEvent(new Event("change"));
    })
    // ページ選択リスト
    $select_page.addEventListener("change", async () =>{
        await get_table_data();
        table_update();
    })
    // 表示件数
    $select_count.addEventListener("change", () => {
        $select_page.value = 1;
        $select_page.dispatchEvent(new Event("change"));
    })
}


//=============================================
// 入力イベント設定関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   ボタン/チェックボックスのイベントを設定する
//=============================================
function set_input_event(){
    // 改行切替チェックボックス
    $chk_switch_enter.addEventListener("change", switch_break);
    $chk_switch_enter.dispatchEvent(new Event("change"));
    
    // 表表示切替チェックボックス
    $chk_switch_view.addEventListener("change", switch_width_style);
    $chk_switch_view.dispatchEvent(new Event("change"));

    // コピーボタン
    $btn_copy_table.addEventListener("click", copy_table_content);
}


//=============================================
// リストイベント設定関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   リストの選択イベントを設定する
//=============================================
function set_select_event(){
    // DB選択リスト
    $select_db.addEventListener("change", change_db);

    // テーブル選択リスト
    $select_table.addEventListener("change", () => {
        // 列並び替え情報リセット
        sort_order = [];
        // 列表示情報リセット
        col_views = [];
        // テーブル変更
        change_table();
    });

}


//=============================================
// 設定画面開閉トグルイベント設定関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   設定画面開閉トグルのイベントを設定する
//=============================================
function set_set_tgl_event(){
    set_tgl.addEventListener("change", (e) => {
        const target = e.currentTarget;
        const flg = target.checked;

        switch(set_timing_flg){
            case SET_TIMINGS.IMD:
                break;
            case SET_TIMINGS.CLOSE:
                if(change_setting_flg && !flg){
                    change_setting_flg = false;
                    $select_page.value = 1;
                    $select_page.dispatchEvent(new Event("change"));
                }
                break;
            case SET_TIMINGS.OPEN:
                if(change_setting_flg && flg){
                    change_setting_flg = false;
                    $select_page.value = 1;
                    $select_page.dispatchEvent(new Event("change"));
                }
                break;
            default:
                break;
        }
    })

}


//=============================================
// 初期設定
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   初期設定
//=============================================
async function init(){
    // データベース一覧生成処理
    if(DB.server_flg){
        const dbs = await DB.get_db();
        $select_db.innerHTML = "";
        $select_db.value = -1;
        dbs.forEach(d_name => {
            const db_name = d_name;
            const option = document.createElement("option");
            option.value = db_name;
            option.innerHTML = db_name;
            $select_db.appendChild(option);
        })
    }


    set_select_event();
    set_input_event();
    set_switch_page_event();
    set_set_tgl_event();
    create_fav_list();
    set_fav_add_event();
    set_switch_type_event();
}



//=============================================================================
// 実行
//=============================================================================
// DOMツリー構築後
// document.addEventListener('DOMContentLoaded', init);

// 全体読み込み完了後
window.addEventListener("load", init);
