import { useRef } from 'react'
import { nanoid } from 'nanoid';
import './only_crome_list.css'

// 標準リスト
const NORMAL_LIST = [
    {
        value: 0,
        label: 'Item0',
    },
    {
        value: 1,
        label: 'Item1',
    },
    {
        value: 2,
        label: 'Item2',
    },
    {
        value: 3,
        label: 'Item3',
    }
]


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.name : リストの名前
//    props.id : リストのid
//    props.default_value : リストの初めの値
//    props.list : リストの選択肢
//      -> value : 選択肢の値
//      -> label : 選択肢のラベル
//      -> selected : 選択肢の選択状態
// 
//========================================================================
function Only_crome_list(props) {
    // リストの名前
    const list_name = props.name ? props.name : nanoid();

    // リストのID
    const list_id = props.id ? props.id : nanoid();

    // リストの始めの値
    const default_value = props.default_value ? props.default_value : (props.list ? props.list[0].value : 0);
    
    // リストへの参照
    const select_list = useRef(); 

    // リストのピッカー
    const list = props.list ? 
        props.list.map((li, index) => {
            const list_value = li.value ? li.value : index;
            const list_label = li.label ? li.label : 'Item' + String(index);

            return(
                <option value={list_value} key={nanoid()}>{list_label}</option>
            )
        })
        :
        NORMAL_LIST.map((li) => (
            <option value={li.value} key={nanoid()}>{li.label}</option>
        ));


    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(){
        // 好きな処理を記載

    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <select name={list_name} id={list_id} defaultValue={default_value} ref={select_list} className='only_crome_list'
            onChange={change_event}>
            {list}
        </select>
    )
}

export default Only_crome_list