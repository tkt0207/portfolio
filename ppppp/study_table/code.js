
// import table_datas from './json/tables.json' with { type: 'json' };
import table1 from './json/table_data/boki_kamoku.json' with { type: 'json' };
import table2 from './json/table_data/boki_bu.json' with { type: 'json' };
import table3 from './json/table_data/canvas_symbol.json' with { type: 'json' };
import table4 from './json/table_data/canvas_clip.json' with { type: 'json' };
import table5 from './json/table_data/css_class.json' with { type: 'json' };

//=============================================================================
// ドキュメント要素
//=============================================================================
const setting_view = document.querySelector("#setting_view");
const lists = setting_view.querySelectorAll(".list");
const filter_add_btn = document.querySelector("#filter_add_btn");
const tag_area = document.querySelector("#tag_area");
const body = document.querySelector("#body");

//=============================================================================
// 定数定義
//=============================================================================
const FILTER_TYPES = ["=", ">=", "<=", ">", "<", "!=", "in"];
const TABLE_CLASS = "d_table";
const TAG_CLASS = "tag";
const TAG_NAME = "tags";
const TAG_ID = "t";
const AREA_CLASS = "area";
const AREA_ID = "a";

//=============================================================================
// グローバル変数
//=============================================================================
let settings = {};
let now_id = "";
let tables = [];

tables.push({name:"簿記-科目", data:table1});
tables.push({name:"簿記-部", data:table2});
tables.push({name:"CSS-疑似クラス", data:table5});
tables.push({name:"canvas-symbol", data:table3});
tables.push({name:"canvas-clip", data:table4});


//=============================================================================
// 関数定義
//=============================================================================
//=============================================
// テーブル作成関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルを作成する
//=============================================
function create_table(data){
    const table = document.createElement("table");
    table.classList.add(TABLE_CLASS);

    const thead = document.createElement("thead");
    const keys = Object.keys(data[0]);
    const thead_tr = document.createElement("tr");
    keys.forEach(key => {
        const th = document.createElement("th");
        const div = document.createElement("div");
        div.innerHTML = key;
        th.dataset.type = data[0][key];
        th.appendChild(div);
        thead_tr.appendChild(th);
    })
    thead.appendChild(thead_tr);


    const tbody = document.createElement("tbody");
    data.slice(1).forEach(row => {
        const tbody_tr = document.createElement("tr");
        keys.forEach(key => {
            const td = document.createElement("td");
            td.innerHTML = row[key];
            tbody_tr.appendChild(td);
        })
        tbody.appendChild(tbody_tr);
    })

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}


//=============================================
// タグ作成関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   タグを作成する
//=============================================
function create_tags(tdatas){
    tdatas.forEach((table_data, index) => {
        const target_id = `${AREA_ID}${index}`;
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = TAG_NAME;
        input.dataset.target = target_id;
        input.id = `${TAG_ID}${index}`;
        label.for = `${TAG_ID}${index}`;
        label.classList.add(TAG_CLASS);
        label.innerHTML = table_data.name;
        label.appendChild(input);
        tag_area.appendChild(label);

        const area = document.createElement("div");
        area.classList.add(AREA_CLASS);
        area.id = target_id;
        const ta = create_table(table_data.data);
        area.appendChild(ta);
        body.appendChild(area);
    })
}


//=============================================
// フィルター作成関数
//---------------------------------------------
// 引数: table -> 対象のテーブル
// 戻り値: -
//---------------------------------------------
// 説明：
//   フィルターの枠を作成する
//=============================================
function create_filter(table, set={col:-1, type:-1, content:""}){
    const col_heads = table.querySelector("thead").querySelector("tr").querySelectorAll("th");
    const ths = [];
    col_heads.forEach(ch => {
        ths.push(ch.textContent);
    })

    const f_div = document.createElement("div");
    const f_d_list_c = document.createElement("design-list");
    const f_d_list_t = document.createElement("design-list");
    const f_input = document.createElement("input");
    const f_button = document.createElement("button");
    const f_button_div = document.createElement("div");

    f_div.classList.add("filter_item");
    f_d_list_c.classList.add("filter_col");
    ths.forEach((th, i) => {
        const c_op = document.createElement("option");
        c_op.value = i;
        c_op.innerHTML = th;
        if(set["col"] == i){
            c_op.selected = true;
        }
        f_d_list_c.appendChild(c_op);
    })

    f_d_list_t.classList.add("filter_type");
    FILTER_TYPES.forEach((t, i) => {
        const t_op = document.createElement("option");
        t_op.value = i;
        t_op.innerHTML = t;
        if(set["type"] == i){
            t_op.selected = true;
        }
        f_d_list_t.appendChild(t_op);
    })

    f_input.type = "text";
    f_input.classList.add("filter_content");
    f_input.value = set["content"];

    f_button_div.classList.add("icon");
    f_button.classList.add("del_filter");
    f_button.appendChild(f_button_div);

    f_div.appendChild(f_d_list_c);
    f_div.appendChild(f_d_list_t);
    f_div.appendChild(f_input);
    f_div.appendChild(f_button);

    f_button.addEventListener("click", () => {
        f_div.remove();
        filter_table(table);
    })
    f_d_list_c.addEventListener("change", () => {
        filter_table(table);
    })
    f_d_list_t.addEventListener("change", () => {
        filter_table(table);
    })
    f_input.addEventListener("change", () => {
        filter_table(table);
    })


    lists[2].appendChild(f_div);
}


//=============================================
// テーブル並び替え関数
//---------------------------------------------
// 引数: table -> 対象のテーブル
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルを並び替える
//=============================================
function sort_table(table){
    const prims = document.querySelectorAll(".sort_prim");
    const types = document.querySelectorAll(".sort_type");
    const ths = table.querySelectorAll("th");

    const items = [];
    for(let i = 0; i < types.length; i++){
        const ps = prims[i].value || 0;
        const ts = types[i].value || 0;
        const cs = ths[i].dataset.type || "string";
        items.push({col_no: i, pri: ps, type: ts, ctype: cs});
    }

    items.sort((a,b) => {
        const pa = Number(a.pri);
        const pb = Number(b.pri);

        return pa - pb;
    })
    
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a,b) => {
        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            let ta = a.querySelectorAll("td")[item.col_no].textContent;
            let tb = b.querySelectorAll("td")[item.col_no].textContent;
            let tc = 0;
            
            if(item.ctype == "string"){
                ta = ta.trim();
                tb = tb.trim();
                tc = item.type == 0 ? 0 : item.type == 2 ? ta.localeCompare(tb, 'ja') : tb.localeCompare(ta, 'ja');
            } else if(item.ctype == "number"){
                ta = Number(ta);
                tb = Number(tb);
                tc = item.type == 0 ? 0 : item.type == 2 ? ta-tb : tb-ta;
            }

            if(tc !== 0){
                return tc;
            }
            if(items.length - 1 == i){
                return 0;
            }
        }
    });
    
    rows.forEach(row => {
        tbody.appendChild(row);
    })
}


//=============================================
// テーブルフィルター関数
//---------------------------------------------
// 引数: table -> 対象のテーブル
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブルをフィルターする
//=============================================
function filter_table(table){
    const filters = document.querySelectorAll(".filter_item");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    

    rows.forEach(row => {
        const tds = row.querySelectorAll("td");
        let view_sw = true;
        for(let i = 0; i < filters.length; i++){
            const fil = filters[i];
            const target_col_no = Number(fil.querySelector(".filter_col").value);
            const target_type = Number(fil.querySelector(".filter_type").value);
            const target_content = fil.querySelector(".filter_content").value;
            
            if(target_col_no == -1) continue;
            if(target_type == -1) continue;
            const target_text = tds[target_col_no].textContent;

            switch(target_type){
                case 0:
                    if(!(target_text == target_content)){
                        view_sw = false;
                        break;
                    }
                    break;
                case 1:
                    if(!(target_text >= target_content)){
                        view_sw = false;
                        break;
                    }
                    break;
                case 2:
                    if(!(target_text <= target_content)){
                        view_sw = false;
                        break;
                    }
                    break;
                case 3:
                    if(!(target_text > target_content)){
                        view_sw = false;
                        break;
                    }
                    break;
                case 4:
                    if(!(target_text < target_content)){
                        view_sw = false;
                        break;
                    }
                    break;
                case 5:
                    if(!(target_text != target_content)){
                        view_sw = false;
                        break;
                    }
                    break;
                case 6:
                    if(!(target_text.indexOf(target_content) != -1)){
                        view_sw = false;
                        break;
                    }
                    break;
                default:
                    break
            }
        }

        if(view_sw){
            row.classList.remove("hidden");
        } else {
            row.classList.add("hidden");
        }
    })
}


//=============================================
// 対象テーブル変更関数
//---------------------------------------------
// 引数: table -> 対象のテーブル
// 戻り値: -
//---------------------------------------------
// 説明：
//   対象のテーブルを変更する
//=============================================
function change_table_layout(table){
    const col_heads = table.querySelector("thead").querySelector("tr").querySelectorAll("th");
    const ths = [];
    col_heads.forEach(ch => {
        ths.push(ch.textContent);
    })

    // 列表示
    lists[0].innerHTML = "";
    ths.forEach((th, i) => {
        const v_label = document.createElement("label");
        const v_div = document.createElement("div");
        const v_span = document.createElement("span");
        const v_input = document.createElement("input");
        v_label.classList.add("vs_col_label");
        v_label.for = `vs_col${i}`;
        v_div.classList.add("check_mark");
        v_span.classList.add("col_name");
        v_span.innerHTML = th;
        v_input.type = "checkbox";
        v_input.id = `vs_col${i}`;
        if(Object.hasOwn(settings, now_id)){
            v_input.checked = settings[now_id]["view"][i];
        } else {
            v_input.checked = true;
        }
        v_label.appendChild(v_div);
        v_label.appendChild(v_span);
        v_label.appendChild(v_input);
        lists[0].appendChild(v_label);

        v_input.addEventListener("change", () => {
            const trs = table.querySelectorAll("tr");
            trs.forEach(tr => {
                let tds = tr.querySelectorAll("td");
                if(tds.length == 0){
                    tds = tr.querySelectorAll("th");
                }
                if(!v_input.checked){
                    tds[i].classList.add("hidden");
                } else {
                    tds[i].classList.remove("hidden");
                }
            })
        })
    })

    // 並び順
    lists[1].innerHTML = "";
    const th_num = ths.length;
    const sort_types = ["－", "▲", "▼"]; 
    ths.forEach((th, i) => {
        const s_div = document.createElement("div");
        const s_span = document.createElement("span");
        const s_d_list_p = document.createElement("design-list");
        const s_d_list_t = document.createElement("design-list");
        s_div.classList.add("sort_item");
        s_span.classList.add("sort_col_name");
        s_span.innerHTML = th;
        s_d_list_p.classList.add("sort_prim");

        let p_sel_index = 1;
        let t_sel_index = 0;
        if(Object.hasOwn(settings, now_id)){
            p_sel_index = settings[now_id]["sort"][i]["prim"];
            t_sel_index = settings[now_id]["sort"][i]["type"];
        }

        for(let k = 0; k < th_num; k++){
            const p_op = document.createElement("option");
            p_op.value = k+1;
            p_op.innerHTML = k+1;
            if((k+1)==p_sel_index){
                p_op.selected = true;
            }
            s_d_list_p.appendChild(p_op);
        }

        s_d_list_t.classList.add("sort_type");
        sort_types.forEach((t, ti) => {
            const t_op = document.createElement("option");
            t_op.value = ti;
            t_op.innerHTML = t;
            if(ti==t_sel_index){
                t_op.selected = true;
            }
            s_d_list_t.appendChild(t_op);
        })

        s_d_list_p.addEventListener("change", () => {
            sort_table(table);
        })

        s_d_list_t.addEventListener("change", () => {
            sort_table(table);
        })

        s_div.appendChild(s_span);
        s_div.appendChild(s_d_list_p);
        s_div.appendChild(s_d_list_t);
        lists[1].appendChild(s_div);
    })

    // フィルタ
    lists[2].innerHTML = "";
    if(Object.hasOwn(settings, now_id)){
        settings[now_id]["filter"].forEach(fi => {
            create_filter(table, fi);
        });
    } else {
        create_filter(table);
    }

    filter_add_btn.onclick = () => {
        create_filter(table);
    }
}

//=============================================
// 設定保存関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   テーブル毎の設定を保存する
//=============================================
function save_setting(id){
    if(!Object.hasOwn(settings, id)){
        settings[id] = {view:[], sort:[], filter:[]};
    }

    // 列表示
    const vs = lists[0].querySelectorAll(`input[type="checkbox"]`);
    vs.forEach((v, i) => {
        settings[id]["view"][i] = v.checked;
    })

    // ソート
    const sis = lists[1].querySelectorAll('.sort_item');
    sis.forEach((si, i) => {
        const pri = si.querySelector(".sort_prim");
        const typ = si.querySelector(".sort_type");
        settings[id]["sort"][i] = {prim: pri.value, type: typ.value};
    })

    // フィルタ
    settings[id]["filter"] = [];
    const fis = lists[2].querySelectorAll('.filter_item');
    fis.forEach((fi, i) => {
        const co = fi.querySelector(".filter_col");
        const typ = fi.querySelector(".filter_type");
        const con = fi.querySelector('.filter_content');
        settings[id]["filter"][i] = {col: co.value, type: typ.value, content:con.value};
    })    
}

//=============================================
// タグ切り替え関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   タグの切り替えイベントを設定する
//=============================================
function tags_set(){
    const tags = document.querySelectorAll('input[name="tags"]');
    const areas = document.querySelectorAll(".area");
    let init_flg = false;

    tags.forEach(tag => {
        const target_id = tag.dataset.target;
        const target = document.querySelector(`#${target_id}`)
        tag.addEventListener("change", () => {
            if(tag.checked){
                areas.forEach(area => {
                    area.classList.add("hidden");
                })
                target.classList.remove("hidden");
                save_setting(now_id);
                now_id = target_id;

                const table = target.querySelector(".d_table");
                change_table_layout(table);
            }
        })

        if(tag.checked){
            init_flg = true;
            tag.dispatchEvent(new Event("change"));
        }
    })

    if(!init_flg){
        tags[0].checked = true;
        tags[0].dispatchEvent(new Event("change"));
    }
}

//=============================================
// ヘッダスクロール関数
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   ヘッダのスクロールを横に変える
//=============================================
function scroll_head(){
    const head = document.querySelector("#head");
    head.addEventListener("wheel", (e) => {
        e.preventDefault();
        head.scrollBy({
            left: e.deltaY/2,
            behavior: 'auto'
        });
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
function init(){
    create_tags(tables);
    tags_set();
    scroll_head();
}



//=============================================================================
// 実行
//=============================================================================
// DOMツリー構築後
// document.addEventListener('DOMContentLoaded', init);

// 全体読み込み完了後
window.addEventListener("load", init);

