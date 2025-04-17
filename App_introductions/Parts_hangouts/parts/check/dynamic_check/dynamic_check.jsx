import { useState } from 'react'
import { nanoid } from "nanoid";
import './dynamic_check.css'

// 押し込み時のスタイル名
const STYLE_NAME_PRESS = 'dynamic_check_pressing';


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : チェックボックスのid
//    props.checked : チェックの初期状態
//    props.back_color : 背景色
//    props.font_color : 文字色(アイコン色)
// 
//========================================================================
function Dynamic_check(props) {
    // チェックボックスのクラスリスト
    const [class_list, setClass_list] = useState([]);

    // チェックボックスのID
    const check_id = props.id ? props.id : nanoid();


    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(e){
        // 好きな処理を記載
        
    }

    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <label className={`dynamic_check_label ${class_list.join(' ')}`}
            style={{'--back-color': props.back_color ? props.back_color : 'rgb(127, 127, 127)', '--font-color': props.font_color ? props.font_color : 'white'}}
            onPointerDown={() => !class_list.includes(STYLE_NAME_PRESS) && setClass_list([...class_list, STYLE_NAME_PRESS])}
            onPointerUp={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}
            onPointerLeave={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}
            onPointerCancel={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}>
                
            <input type='checkbox' id={check_id} className='dynamic_checkbox' defaultChecked={props.checked ? props.checked : false} 
                onChange={change_event}/>
            <div className='dynamic_check_icon'></div>
        </label>
    )
}

export default Dynamic_check