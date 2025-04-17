import { useRef, useState, useEffect } from 'react';
import { nanoid } from "nanoid";
import './stack_message.css'


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.title : メッセージボックスのタイトル
//    prpps.icon : メッセージボックスのアイコン
//    props.message : メッセージ
// 
//========================================================================
function In_message(props) {
    // メッセージボックスのタイトル
    const title = props.title ? props.title : 'タイトル';

    // メッセージボックスのアイコン
    const icon = props.icon ? props.icon : (<div className='normal_icon'></div>);
    
    // メッセージボックスのメッセージ
    const message = props.message ? props.message : 'ここに好きなメッセージを入れる';

    // メッセージボックスへの参照
    const message_box = useRef();


    //------------------------------------------------
    // クリックイベント
    //------------------------------------------------
    function click_event(e){
        // バブリングを無効化
        e.stopPropagation();
        
        // 好きな処理を記載

    }


    return(
        <div className='stack_message_box' ref={message_box}
            onAnimationEnd={() => props.del_func(props.key_code)}
            onClick={click_event}>
            <div className='message_icon'>{icon}</div>
            <div className='message_block'>
                <div className='message_title'>{title}</div>
                <div className='message'>{message}</div>
            </div>
        </div>
    )
}



//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    none
// 
//========================================================================
function Stack_message() {
    // メッセージブロックへの参照
    const message_block = useRef();

    // メッセージへの参照
    const [messages, setMessages] = useState([]);

    // メッセージリスト
    const message_list = messages.map((m) => (
        <In_message title={m.title} icon={m.icon} message={m.message} key={m.key} key_code={m.key} del_func={message_box_delete} />
    ))


    //------------------------------------------------
    // メッセージボックス追加関数
    //------------------------------------------------
    function message_box_add(title, icon, message){
        // メッセージを追加
        let key = nanoid();
        setMessages(prev => [...prev, {title:title, icon:icon, message:message, key:key}])
    }


    //------------------------------------------------
    // メッセージボックス消失関数
    //------------------------------------------------
    function message_box_delete(dom){
        // メッセージを削除
        setMessages(prev => prev.filter((d) => d.key != dom));
    }


    // メッセージボックスを表示する処理(自由に設定すること)
    useEffect(() => {
        let target = message_block.current;
        target.style.cursor = 'pointer';
        target.onclick = (e) => {
            if(e.target != target){
                return;
            }
            message_box_add('タイトル', <div className='normal_icon'></div>, 'メッセージ');
        }
    }, [])


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='stack_message_block' ref={message_block}>
            {message_list}
        </div>
    )
}

export default Stack_message