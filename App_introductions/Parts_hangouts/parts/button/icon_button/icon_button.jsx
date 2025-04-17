import { useState } from 'react'
import './icon_button.css'

// 押し込み時のスタイル名
const STYLE_NAME_PRESS = 'icon_button_pressing';


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    none
// 
//========================================================================
function Icon_button() {
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
        <button className={`icon_button ${class_list.join(' ')}`}
            onClick={click_event}
            onPointerDown={() => !class_list.includes(STYLE_NAME_PRESS) && setClass_list([...class_list, STYLE_NAME_PRESS])}
            onPointerUp={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}
            onPointerLeave={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}
            onPointerCancel={() => class_list.includes(STYLE_NAME_PRESS) && setClass_list(class_list.filter((cl) => cl != STYLE_NAME_PRESS))}>
            <div className='button_icon'>
                <div className='button_icon_parts1'></div>
                <div className='button_icon_parts2'></div>
            </div>
                
        </button>
    )
}

export default Icon_button