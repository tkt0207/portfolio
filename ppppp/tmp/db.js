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

import fav_list from './assets/json/favorite/favorite_list.json' with { type: 'json' };

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

export function get_fav_list(){
    return fav_list.map(f => {return {id:f.id, name:f.name};});
}

export function get_fav_setting(id){
    return fav_list.find(f => f.id == id);
}

export function get_tables(t_name){
    return Object.keys(DB[t_name]);
}


export function get_table_data(d_name, t_name, type, count, page, filters, sorts){
    if(t_name == -1) return {name:"", num:0, keys:[], data:[]};
    let data = DB[d_name][t_name];
    const keys = data[0] ? Object.keys(data[0]) : [];

    data = filter_table(data, filters);
    data = sort_table(data, sorts);

    const data_num = data.length;
    let s_index = (page - 1) * count;
    let e_index = page * count;
    if(e_index > data_num){
        e_index = data_num;
    }
    data = data.slice(s_index, e_index);
    
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