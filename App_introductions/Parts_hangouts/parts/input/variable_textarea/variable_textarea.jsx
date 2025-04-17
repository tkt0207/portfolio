import { useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import './variable_textarea.css'


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : インプットのid
// 
//========================================================================
function Variable_textarea(props) {
    // インプットへの参照
    const input = useRef();

    // インプットのID
    const input_id = props.id ? props.id : nanoid();

    // 高さの最大値
    let max_height = 100;


    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(){
        // 好きな処理を記載
        
    }

    //------------------------------------------------
    // インプットイベント
    //------------------------------------------------
    function input_event(){
        // ターゲットを取得
        let target = input.current;

        // インプットの高さと角丸サイズを変更
        target.style.height = 'auto';
        target.style.height = target.scrollHeight + 'px';
        target.style.borderRadius = Math.min(20 * (1 - (target.getBoundingClientRect().height / max_height)) + 5, 20) + 'px';
    }


    // 初期設定
    useEffect(() => {
        // インプットのmax-heightを高さの最大値に設定
        let style = window.getComputedStyle(input.current);
        max_height = style.getPropertyValue('max-height');
        max_height = parseFloat(max_height.replace('px', ''));
    }, []);

    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <textarea className='variable_textarea' id={input_id} ref={input}
            onInput={input_event}
            onChange={change_event}
            />
    )
}

export default Variable_textarea