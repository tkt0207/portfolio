import cust_tohoku from './assets/json/table_data/cust_tohoku.json' with { type: 'json' };
import cust_kanto from './assets/json/table_data/cust_kanto.json' with { type: 'json' };
import cust_chubu from './assets/json/table_data/cust_chubu.json' with { type: 'json' };
import cust_kinki from './assets/json/table_data/cust_kinki.json' with { type: 'json' };
import cust_chugoku from './assets/json/table_data/cust_chugoku.json' with { type: 'json' };
import cust_shikoku from './assets/json/table_data/cust_shikoku.json' with { type: 'json' };
import cust_kyushu from './assets/json/table_data/cust_kyushu.json' with { type: 'json' };

import item_food from './assets/json/table_data/item_food.json' with { type: 'json' };
import item_fuku from './assets/json/table_data/item_fuku.json' with { type: 'json' };
import item_kagukaden from './assets/json/table_data/item_kagukaden.json' with { type: 'json' };
import item_zakka from './assets/json/table_data/item_zakka.json' with { type: 'json' };

import item_stock from './assets/json/table_data/itemstock.json' with { type: 'json' };

import order_food from './assets/json/table_data/order_food.json' with { type: 'json' };
import order_fuku from './assets/json/table_data/order_fuku.json' with { type: 'json' };
import order_kagukaden from './assets/json/table_data/order_kagukaden.json' with { type: 'json' };
import order_zakka from './assets/json/table_data/order_zakka.json' with { type: 'json' };

import fav_list_json from './assets/json/favorite/favorite_list.json' with { type: 'json' };

let fav_list = fav_list_json;

const DB = {
    CUST: {
        tohoku: cust_tohoku,
        kanto: cust_kanto,
        chubu: cust_chubu,
        kinki: cust_kinki,
        chugoku: cust_chugoku,
        shikoku: cust_shikoku,
        kyushu: cust_kyushu,
    },
    ITEM: {
        food: item_food,
        fuku: item_fuku,
        kagukaden: item_kagukaden,
        zakka: item_zakka,
    },
    ITEM_STOCK: {
        stock: item_stock,
    },
    ORDER: {
        food: order_food,
        fuku: order_fuku,
        kagukaden: order_kagukaden,
        zakka: order_zakka,
    },
}

let server_info = {
    type:"db_read",
    db_name:'',
    query:'',
    db_user:'root',
    db_pass:'',
    args: []
}

export const server_flg = true;


//=============================================
// お気に入りリスト取得関数
//=============================================
export function get_fav_list(){
    return fav_list.map(f => {return {id:f.id, name:f.name};});
}

//=============================================
// お気に入り情報取得関数
//=============================================
export function get_fav_setting(id){
    return fav_list.find(f => f.id == id);
}

//=============================================
// お気に入り追加関数
//=============================================
export async function add_fav_setting(data){
    const aryMax = function (a, b) {return Math.max(a, Number(b));}
    const tmp = fav_list.map(f => f.id);
	const new_id = tmp.reduce(aryMax, 0) + 1;

    fav_list.push({id: new_id, ...data});
    if(server_flg){
        server_info.type = "save";
        server_info.query = fav_list;
        await server_access(server_info);
    }
}

//=============================================
// お気に入り削除関数
//=============================================
export async function delete_fav_setting(id){
    fav_list = fav_list.filter(f => f.id != id);
    if(server_flg){
        server_info.type = "save";
        server_info.query = fav_list;
        await server_access(server_info);
    }
}


//=============================================
// テーブルリスト関数
//=============================================
export async function get_tables(d_name){
    if(server_flg){
        server_info.type = "db_read";
        server_info.db_name = d_name;
        server_info.query = "show tables";
        let data = await server_access(server_info);
        data = data.map(obj => Object.values(obj)[0]);
        return data;
    } else {
        return Object.keys(DB[d_name]);
    }
}

//=============================================
// データベースリスト取得関数
//=============================================
export async function get_db(){
    let data = [];
    if(server_flg){
        server_info.type = "db_read";
        server_info.db_name = "";
        server_info.query = "show databases";
        data = await server_access(server_info);
        data = data.map(obj => Object.values(obj)[0]);
    }
    return data;
}

//=============================================
// テーブルデータ取得関数
//=============================================
export async function get_table_data(d_name, t_name, type, count, page, filters, sorts){
    if(t_name == -1) return {name:"", num:0, keys:[], data:[]};
    let data = [];
    let keys = [];
    let data_num = 0;

    if(server_flg){
        server_info.type = "db_read";
        server_info.db_name = d_name;
        let q = "";

        // key取得
        q = `SHOW COLUMNS FROM ${t_name}`;
        server_info.query = q;
        keys = await server_access(server_info);
        
        if(type){
            data_num = keys.length;
            data = keys;
            keys = Object.keys(keys[0]);
            return {name:t_name, num:data_num, keys:keys, data:data};
        }

        keys = keys.map(obj => Object.values(obj)[0]);
        
        // 件数取得
        q = `SELECT COUNT(*) AS C FROM ${t_name} `;
        server_info.query = q;
        data_num = await server_access(server_info);
        data_num = data_num[0].C;

        // データ取得
        q = `SELECT * FROM ${t_name} `;

        // フィルタ
        let and = "";
        for(let i = 0; i < filters.length; i++){
            const fil = filters[i];
            const col_no = Number(fil.col_no);
            const type = Number(fil.type);
            const content = fil.content;
            const col_name = keys[col_no];
            
            if(col_no == -1) continue;
            if(type == -1) continue;

            if(!and){
                q += " WHERE ";
            }

            switch(type){
                case 0:
                    q += `${and} ${col_name} == ${content} `;
                    break;
                case 1:
                    q += `${and} ${col_name} >= ${content} `;
                    break;
                case 2:
                    q += `${and} ${col_name} <= ${content} `;
                    break;
                case 3:
                    q += `${and} ${col_name} > ${content} `;
                    break;
                case 4:
                    q += `${and} ${col_name} < ${content} `;
                    break;
                case 5:
                    q += `${and} ${col_name} <> ${content} `;
                    break;
                case 6:
                    q += `${and} ${col_name} LIKE '%${content}%' `;
                    break;
                default:
                    break
            }
            if(!and){
                and = "AND";
            }
        }
        
        // ソート
        let flg = false;
        for(let i = 0; i < sorts.length; i++){
            if(!flg){
                q += " ORDER BY ";
                flg = true;
            }
            const s = sorts[i];
            const col_no = Number(s.col_no);
            const col_name = keys[col_no];
            const type = Number(s.type);
            if(type == 1){
                q += ` ${col_name} ASC`;
            } else if(type == 2){
                q += ` ${col_name} DESC`;
            }

            if(i != sorts.length-1){
                q += ", ";
            }
        }

        // 件数
        const offset = (page - 1) * count;
        q += ` LIMIT ${count} OFFSET ${offset}`;
        server_info.query = q;
        data = await server_access(server_info);
    } else {
        data = DB[d_name][t_name];
        keys = data[0] ? Object.keys(data[0]) : [];

        data = filter_table(data, filters);
        data = sort_table(data, sorts);

        data_num = data.length;
        let s_index = (page - 1) * count;
        let e_index = page * count;
        if(e_index > data_num){
            e_index = data_num;
        }
        data = data.slice(s_index, e_index);
    }
    
    return {name:t_name, num:data_num, keys:keys, data:data};
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
function sort_table(data, sorts){
    const t_data = [...data];
    t_data.sort((a,b) => {
        for(let i = 0; i < sorts.length; i++) {
            const item = sorts[i];
            const va = Object.values(a);
            const vb = Object.values(b);
            let ta = va[Number(item.col_no)];
            let tb = vb[Number(item.col_no)];
            let tc = 0;
            
            if(typeof ta == "number"){
                ta = Number(ta);
                tb = Number(tb);
                tc = item.type == 0 ? 0 : item.type == 2 ? ta-tb : tb-ta;
            } else {
                ta = ta.trim();
                tb = tb.trim();
                tc = item.type == 0 ? 0 : item.type == 2 ? ta.localeCompare(tb, 'ja') : tb.localeCompare(ta, 'ja');
            }

            if(tc !== 0){
                return tc;
            }
            if(sorts.length - 1 == i){
                return 0;
            }
        }
    });

    return t_data;
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
function filter_table(data, filters){
    const t_data = [];
    
    data.forEach(d => {
        let view_sw = true;
        for(let i = 0; i < filters.length; i++){
            const fil = filters[i];
            const target_col_no = fil.col_no;
            const target_type = fil.type;
            const target_content = fil.content;
            
            if(target_col_no == -1) continue;
            if(target_type == -1) continue;
            const target_text = Object.values(d)[target_col_no];

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
            t_data.push(d);
        }
    })
    return t_data;
}


//=============================================
// サーバーアクセス関数
//---------------------------------------------
// 引数:
//   type    -> 接続タイプ( login / logout / db_read / db_write / python )
//   db_name -> 接続するDB名(typeがpythonの際は、実行するpythonのパス)
//   query   -> SQL文
//   db_user -> DB接続時のユーザ名
//   db_pass -> DB接続時のパスワード
//   args    -> Python実行時の引数リスト
//
// 戻り値:
//   サーバーから取得したデータ
//---------------------------------------------
// 説明:
//   サーバーに接続する
//=============================================
async function server_access({type, db_name='', query='', db_user='root', db_pass='', args=[]}) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // 接続タイプ
    const set_type = type;
    
    // データ
    const set_data = {
        db_name: db_name,
        db_user: db_user,
        db_pass: db_pass,
        query: query,
        args: args,
    };

    // リクエストの構築
    const request = new Request('./server.php', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            type: set_type,
            data: set_data,
        }),
    });

    // リクエスト送信 
    return fetch(request)
    .then(response => {
        // レスポンス変換
        return response.json();
    })
    .then(data => {
        if(data.success){
            return data.data;
        } else {
            console.log(data.message);
            return null;
        }
    }) 
    .catch(error => {
        // エラー処理
        console.log(error);
        return null;
    });
}