import { useState } from 'react'
import './push_button2.css'

// 押し込み時のスタイル名
const STYLE_NAME_PRESS = 'push_button2_pressing';


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.label : ボタンに表示される文字
// 
//========================================================================
function Push_button2(props) {
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
        <button className={`push_button2 ${class_list.join(' ')}`}
            onClick={click_event}
            onPointerDown={() => !class_list.includes(STYLE_NAME_PRESS) && setClass_list([...class_list, STYLE_NAME_PRESS])}
            onPointerUp={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}
            onPointerLeave={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}
            onPointerCancel={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}>
            <div>
                {props.label ? props.label : 'Button'}
            </div>
                
        </button>
    )
}

export default Push_button2