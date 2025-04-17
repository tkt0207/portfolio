import { useRef } from "react";
import { nanoid } from "nanoid";
import './password_input.css'


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : インプットのid
// 
//========================================================================
function Password_input(props) {
    // インプットのID
    const input_id = props.id ? props.id : nanoid();

    // チェックボックスのID
    const check_id = nanoid();

    // インプットへの参照
    const input = useRef();

    // インプット(可視状態)への参照
    const input_visible = useRef();

    // 可視切り替えボタンへの参照
    const checkbox = useRef();

    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(){
        input_visible.current.value = input.current.value;
        // 好きな処理を記載
        
    }


    //------------------------------------------------
    // 変更イベント(パスワード可視ブロック)
    //------------------------------------------------
    function change_event_for_visible(){
        input.current.value = input_visible.current.value;
    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='password_input_block'>
            <input type='password' className='password_input' id={input_id} placeholder="password" ref={input}
                onChange={change_event}/>
            <label htmlFor={check_id} className="password_checkbox_label">
                <input type="checkbox" className="password_checkbox" id={check_id} ref={checkbox}/>
            </label>
            
            <input type="text" className='pasword_visible' placeholder="password" ref={input_visible}
                onChange={change_event_for_visible}/>
        </div>
        
    )
}

export default Password_input