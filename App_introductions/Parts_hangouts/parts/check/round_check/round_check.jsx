import './round_check.css'
import { nanoid } from "nanoid";


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.label : ラベルに表示される文字
//    props.id : チェックボックスのid
//    props.checked : チェックの初期状態
// 
//========================================================================
function Round_check(props) {
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
        <label className='round_check_label'>
            <input type='checkbox' id={check_id} className='round_check_icon' defaultChecked={props.checked ? props.checked : false} 
                onChange={change_event}/>
            {props.label ? props.label : 'Check Box'}
        </label>
    )
}

export default Round_check