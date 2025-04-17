import { useRef, useState, useEffect } from 'react';
import './pop_up_message.css'

// 表示スタイル名
const STYLE_NAME_DISPLAY = 'pop_up_message_display';

// 全表示スタイル名
const STYLE_NAME_VIEW_ALL = 'message_all_view_block';


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.title : メッセージボックスのタイトル
//    prpps.icon : メッセージボックスのアイコン
//    props.message : メッセージ
// 
//========================================================================
function Pop_up_message(props) {
    // メッセージボックスのタイトル
    const title = props.title ? props.title : 'タイトル';

    // メッセージボックスのアイコン
    const icon = props.icon ? props.icon : (<div className='normal_icon'></div>);

    // メッセージボックスのメッセージ
    const message = props.message ? props.message : 'ここに好きなメッセージを入れる';

    // メッセージボックスへの参照
    const message_box = useRef();

    // メッセージボックスのクラスリスト
    const [message_box_class, setMessage_box_class] = useState([STYLE_NAME_DISPLAY]);


    //------------------------------------------------
    // メッセージボックス表示関数
    //------------------------------------------------
    function message_box_appear(){
        // メッセージボックスに表示スタイルが適用されている場合
        if(message_box.current.classList.contains(STYLE_NAME_DISPLAY)){
            // メッセージボックスから表示スタイルを削除
            setMessage_box_class([]);

            // メッセージボックスに表示スタイルを追加
            setTimeout(() => {
                setMessage_box_class([...message_box_class, STYLE_NAME_DISPLAY]);
            }, 0)
            
        } 
        
        // メッセージボックスに表示スタイルが適用されていない場合
        else {
            // メッセージボックスに表示スタイルを追加
            setMessage_box_class([...message_box_class, STYLE_NAME_DISPLAY]);
        }
    }


    //------------------------------------------------
    // メッセージボックス消失関数
    //------------------------------------------------
    function message_box_disappear(){
        // メッセージボックスから表示スタイルを削除
        setMessage_box_class([]);
    }


    //------------------------------------------------
    // メッセージボックスクリック関数
    //------------------------------------------------
    function message_click_event(e){
        // バブリングを無効化
        e.stopPropagation();
        
        // メッセージボックスに全表示スタイルが適用されている場合
        if(message_box_class.includes(STYLE_NAME_VIEW_ALL)){
            // メッセージボックスから全表示スタイルを削除
            setMessage_box_class(message_box_class.filter((cl) => cl != STYLE_NAME_VIEW_ALL));
        } 
        
        // メッセージボックスに全表示スタイルが適用されていない場合
        else {
            // メッセージボックスに全表示スタイルを追加
            setMessage_box_class([...message_box_class, STYLE_NAME_VIEW_ALL]);
        }
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
        <div className={`pop_up_message_box ${message_box_class.join(' ')}`} ref={message_box}
            onAnimationEnd={message_box_disappear}
            onClick={message_click_event}
            >
            <div className='message_icon'>{icon}</div>
            <div className='message_block'>
                <div className='message_title'>{title}</div>
                <div className='message'>{message}</div>
            </div>
        </div>
    )
}

export default Pop_up_message