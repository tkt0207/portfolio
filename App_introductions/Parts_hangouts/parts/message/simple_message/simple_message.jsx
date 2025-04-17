import { useRef, useState, useEffect } from 'react';
import './simple_message.css'

// 隠しスタイル名
const STYLE_NAME_HIDDDEN = 'simple_message_box_hidden';


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.title : メッセージボックスのタイトル
//    prpps.icon : メッセージボックスのアイコン
//    props.message : メッセージ
// 
//========================================================================
function Simple_message(props) {
    // メッセージボックスのタイトル
    const title = props.title ? props.title : 'タイトル';

    // メッセージボックスのアイコン
    const icon = props.icon ? props.icon : (<div className='normal_icon'></div>);

    // メッセージボックスのメッセージ
    const message = props.message ? props.message : 'ここに好きなメッセージを入れる';

    // OKボタンへの参照
    const ok_button = useRef();

    // キャンセルボタンへの参照
    const cnancel_button = useRef();

    // メッセージボックスへの参照
    const message_box = useRef();

    // メッセージボックスのクラスリスト
    const [message_box_class, setMessage_box_class] = useState();


    //------------------------------------------------
    // メッセージボックス表示関数
    //------------------------------------------------
    function message_box_appear(){
        // メッセージボックスから隠しスタイルを削除
        setMessage_box_class('');
    }


    //------------------------------------------------
    // メッセージボックス消失関数
    //------------------------------------------------
    function message_box_disappear(){
        // メッセージボックスに隠しスタイルを適用
        setMessage_box_class(STYLE_NAME_HIDDDEN);
    }

    //------------------------------------------------
    // OKボタンクリックイベント
    //------------------------------------------------
    function ok_button_click_event(){
        // メッセージボックスを非表示
        message_box_disappear();
        
        // 好きな処理を記載
    }


    //------------------------------------------------
    // キャンセルボタンクリックイベント
    //------------------------------------------------
    function cancel_button_click_event(){
        // メッセージボックスを非表示
        message_box_disappear();
        
        // 好きな処理を記載
    }


    // メッセージボックスを表示する処理(自由に設定すること)
    useEffect(() => {
        let target = message_box.current.closest('.content');
        target.style.cursor = 'pointer';
        target.onclick = (e) => {
            if(e.target != target){
                return;
            }
            message_box_appear();
        }
    }, [])


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className={`simple_message_box ${message_box_class}`} ref={message_box}>
            <div className='message_title_block'>
                <div className='message_icon'>{icon}</div>
                <div className='message_title'>{title}</div>
            </div>
            
            <div className='message'>{message}</div>

            <div className='message_button_block'>
                <button className='message_cancel' ref={cnancel_button}
                    onClick={cancel_button_click_event}>Cancel</button>
                <button className='message_ok' ref={ok_button}
                    onClick={ok_button_click_event}>OK</button>
            </div>

        </div>
    )
}

export default Simple_message