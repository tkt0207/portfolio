import { useState } from 'react'
import './color_invert_button.css'

// 押し込み時のスタイル名
const STYLE_NAME_PRESS = 'color_invert_button_pressing';


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.label : ボタンに表示される文字
//    props.back_color: 背景色
//    props.font_color: 文字色 
//
//========================================================================
function Color_invert_button(props) {
    // ボタンのクラスリスト
    const [class_list, setClass_list] = useState([]);

    //------------------------------------------------
    // クリックイベント
    //------------------------------------------------
    function click_event(){
        // 好きな処理を記載
        alert('ボタンが押されました。');
    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <button 
            className={`color_invert_button ${class_list.join(' ')}`} 
            style={{'--back-color': props.back_color ? props.back_color : 'white', '--font-color': props.font_color ? props.font_color : 'rgb(127, 127, 127)'}}
            onClick={click_event}
            onPointerDown={() => !class_list.includes(STYLE_NAME_PRESS) && setClass_list([...class_list, STYLE_NAME_PRESS])}
            onPointerUp={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}
            onPointerLeave={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}
            onPointerCancel={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}>
                {props.label ? props.label : 'Button'}
        </button>
    )
}

export default Color_invert_button