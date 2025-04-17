import { nanoid } from "nanoid";
import './color_radio.css'

// 標準リスト
const NORMAL_RADIO_LIST = [
    {
        value: 0,
        checked: true,
        color: 'rgb(127, 127, 255)'
    },
    {
        value: 1,
        checked: false,
        color: 'rgb(127, 255, 127)'
    },
    {
        value: 2,
        checked: false,
        color: 'rgb(255, 127, 255)'
    },
    {
        value: 3,
        checked: false,
        color: 'rgb(255, 127, 127)'
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
//      -> checked : 初期のチェック状態
//      -> color : チェックボックスの色
// 
//========================================================================
function Color_radio(props) {
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
            const radio_checked = radio.checked ? radio.checked : (index == 0 ? true : false);
            const radio_color = radio.color ? radio.color : 'rgb(127, 127, 255)';

            return (
                <input type='radio' name={radio_name} value={radio_value} id={radio_id} defaultChecked={radio_checked} key={radio_id}
                    style={{'--radio-color': radio_color}}
                    onChange={change_event} />
            )
        })
        :
        NORMAL_RADIO_LIST.map((radio, index) => (
            <input type='radio' name={radio_name} value={radio.value} id={radio_name + String(index)} defaultChecked={radio.checked} key={radio_name + String(index)}
                style={{'--radio-color': radio.color}}
                onChange={change_event} />
        ))


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='color_radio_block'>
            {radio_list}
        </div>
    )
}

export default Color_radio