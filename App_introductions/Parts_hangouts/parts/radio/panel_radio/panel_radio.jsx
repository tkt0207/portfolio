import { nanoid } from "nanoid";
import './panel_radio.css'

// 標準リスト
const NORMAL_RADIO_LIST = [
    {
        value: 0,
        label: 'Item0',
        checked: true
    },
    {
        value: 1,
        label: 'Item1',
        checked: false
    },
    {
        value: 2,
        label: 'Item2',
        checked: false
    },
    {
        value: 3,
        label: 'Item3',
        checked: false
    }
]


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.name : ラジオボタンの名前
//    props.radio_list : ラジオボタンのリスト
//      -> id : ラジオボタンのid
//      -> value : ラジオボタンの値
//      -> label : ラジオボタンのラベル
//      -> checked : 初期のチェック状態
// 
//========================================================================
function Panel_radio(props) {
    // ラジオボタンの名前
    const radio_name = props.name ? props.name : nanoid();


    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(e){
        // 好きな処理を記載
        
    }


    // リスト設定
    const radio_list = props.radio_list ? 
        props.radio_list.map((radio, index) => {
            const radio_id = radio.id ? radio.id : nanoid();
            const radio_value = radio.value ? radio.value : index;
            const radio_label = radio.label ? radio.label : 'Item' + String(index);
            const radio_checked = radio.checked ? radio.checked : (index == 0 ? true : false);

            return (
                <label htmlFor={radio_id} key={radio.id}>{radio_label}
                    <input type='radio' name={radio_name} value={radio_value} id={radio_id} defaultChecked={radio_checked}
                        onChange={change_event} />
                </label>
            )
        })
        :
        NORMAL_RADIO_LIST.map((radio, index) => (
            <label htmlFor={radio_name + String(index)} key={radio_name + String(index)}> {radio.label}
                <input type='radio' name={radio_name} value={radio.value} id={radio_name + String(index)} defaultChecked={radio.checked} 
                    onChange={change_event} />
            </label>
        ))


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='panel_radio_block'>
            {radio_list}
        </div>
    )
}

export default Panel_radio