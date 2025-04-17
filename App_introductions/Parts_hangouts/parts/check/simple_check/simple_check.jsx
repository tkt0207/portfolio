import './simple_check.css'
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
function Simple_check(props) {
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
        <div className='simple_check_block'>
            <input type='checkbox' id={check_id} className='simple_check_icon' defaultChecked={props.checked ? props.checked : false}
                onChange={change_event} />
            <label htmlFor={check_id} className='simple_check_label' >
                {props.label ? props.label : 'Check Box'}
            </label>
        </div>
    )
}

export default Simple_check