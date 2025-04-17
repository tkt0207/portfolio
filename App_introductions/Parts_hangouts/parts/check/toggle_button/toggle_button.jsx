import './toggle_button.css'
import { nanoid } from "nanoid";


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : チェックボックスのid
//    props.checked : チェックの初期状態
// 
//========================================================================
function Toggle_button(props) {
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
        <input type='checkbox' id={check_id} className='toggle_button' defaultChecked={props.checked ? props.checked : false}
            onChange={change_event}/>
    )
}

export default Toggle_button