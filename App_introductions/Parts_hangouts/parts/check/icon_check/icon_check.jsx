import './icon_check.css'
import { nanoid } from "nanoid";


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : チェックボックスのid
//    props.checked : チェックの初期状態
// 
//========================================================================
function Icon_check(props) {
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
        <label className='icon_check_label'
            style={{'--back-color': props.back_color ? props.back_color : 'white', '--font-color': props.font_color ? props.font_color : 'rgb(127, 127, 127)'}}>
            <input type='checkbox' id={check_id} className='icon_checkbox' defaultChecked={props.checked ? props.checked : false} 
                onChange={change_event}/>
            <div className='icon_check_icon'></div>
        </label>
    )
}

export default Icon_check