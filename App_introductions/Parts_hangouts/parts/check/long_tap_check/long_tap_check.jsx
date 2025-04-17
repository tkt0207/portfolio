import { useState, useRef } from 'react'
import { nanoid } from "nanoid";
import './long_tap_check.css'

// 押し込み時のスタイル名
const STYLE_NAME_PRESS = 'long_tap_check_pressing';

// 押し込み終了時のスタイル名
const STYLE_NAME_PRESS_END = 'long_tap_press_end';


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : チェックボックスのid
//    props.checked : チェックの初期状態
//    props.press_time : 長押し時間
// 
//========================================================================
function Long_tap_check(props) {
    // チェックボックスのクラスリスト
    const [class_list, setClass_list] = useState([]);

    // チェックボックスへの参照
    const checkbox = useRef();

    // チェックボックスのID
    const check_id = props.id ? props.id : nanoid();


    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(e){
        // 好きな処理を記載
        
    }


    //------------------------------------------------
    // 押し込みイベント
    //------------------------------------------------
    function press_event(e){
        // 標準処理を無効化
        e.preventDefault();
        
        // チェックボックスのクラスリストから、押し込み終了時のスタイルを削除
        // チェックボックスのクラスリストに、押し込み時のスタイルを追加
        setClass_list((pre) => {
            if(!pre.includes(STYLE_NAME_PRESS)){
                return [...pre.filter((cl) => cl != STYLE_NAME_PRESS_END), STYLE_NAME_PRESS];
            } else {
                return pre.filter((cl) => cl != STYLE_NAME_PRESS_END);
            }
        });
        

        // ターゲットを取得
        let target = e.currentTarget;


        // ターゲットに変形終了時のイベントを設定
        target.ontransitionend = () => {
            // チェックボックスをトグル
            checkbox.current.checked = !checkbox.current.checked;

            // チェックボックスのクラスリストから、押し込み時のスタイルを削除
            // チェックボックスのクラスリストに、押し込み終了時のスタイルを追加
            setClass_list((pre) => {
                if(!pre.includes(STYLE_NAME_PRESS_END)){
                    return [...pre.filter((cl) => cl != STYLE_NAME_PRESS), STYLE_NAME_PRESS_END];
                } else {
                    return pre.filter((cl) => cl != STYLE_NAME_PRESS);
                }
            });
            
            // 変更イベントを明示的に呼び出し
            change_event();

            // ターゲットの変形終了イベントを削除
            target.ontransitionend = null;
        }
    }


    //------------------------------------------------
    // 押し込みキャンセルイベント
    //------------------------------------------------
    function press_cansel_event(e){
        // クラスリストから押し込み時のスタイルを削除
        setClass_list((pre) => {
            if(pre.includes(STYLE_NAME_PRESS)){
                return pre.filter((cl) => cl != STYLE_NAME_PRESS);
            } else {
                return pre;
            }
        });

        // ターゲットを取得
        let target = e.currentTarget;

        // ターゲットの変形終了イベントを削除
        target.ontransitionend = null;
    }


    //------------------------------------------------
    // フォーカスイベント
    //------------------------------------------------
    function focus_event(e){
        // ターゲットを取得
        let target = e.currentTarget;

        // ターゲットにキー押し込みイベントを設定
        target.onkeydown = (e) => {
            // 押されたキーがスペースキーのとき
            if(e.key == ' '){
                // 押し込みイベントを実行
                press_event(e);

                // 連続動作しないようにキー押し込みイベントを削除
                target.onkeydown = null;
            }
        }

        // ターゲットにキー押し込み終了イベントを設定
        target.onkeyup = (e) => {
            // 押し込み終了したキーがスペースキーのとき
            if(e.key == ' '){
                // 押し込みキャンセルイベントを実施
                press_cansel_event(e);
                
                // ターゲットにキー押し込みイベントを設定
                target.onkeydown = (e) => {
                    if(e.key == ' '){
                        press_event(e);
                        target.onkeydown = null;
                    }
                }
            }
        }
    }


    //------------------------------------------------
    // フォーカス解除イベント
    //------------------------------------------------
    function blur_event(e){
        // ターゲットを取得
        let target = e.currentTarget;

        // ターゲットのキー押し込みイベントとキー押し込み終了イベントを削除
        target.onkeydown = null;
        target.onkeyup = null;
    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <label className={`long_tap_check_label ${class_list.join(' ')}`}
            style={{'--back-color': props.back_color ? props.back_color : 'rgb(127, 127, 127)', '--font-color': props.font_color ? props.font_color : 'white', '--press-time' : props.press_time ? props.press_time : 1000}}
            onClick={(e) => e.preventDefault()}
            onPointerDown={press_event}
            onPointerUp={press_cansel_event}
            onPointerLeave={press_cansel_event}
            onPointerCancel={press_cansel_event}
            onFocus={focus_event}
            onBlur={blur_event}>

            <input type='checkbox' id={check_id} className='long_tap_checkbox' defaultChecked={props.checked ? props.checked : false} ref={checkbox} />
            <div className='long_tap_check_icon'></div>
        </label>
    )
}

export default Long_tap_check