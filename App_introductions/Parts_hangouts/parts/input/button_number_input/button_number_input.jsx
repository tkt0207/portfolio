import { useRef, useState } from "react";
import { nanoid } from "nanoid";
import './button_number_input.css'

// マイナスボタン押し込み時のスタイル名
const STYLE_NAME_PRESS_MINUS = 'button_for_input_pressing';

// プラスボタン押し込み時のスタイル名
const STYLE_NAME_PRESS_PLUS = 'button_for_input_pressing';


//----------------------------------------------------------
// 正規化関数
//----------------------------------------------------------
function normalize(dom){
    const target = dom;
    const min = parseFloat(target.min);
    const max = parseFloat(target.max);
    const step = parseFloat(target.step);

    if(!target.value){
        target.value = min;
        return;
    }

    let value = parseFloat(target.value);

    let check_value = value * (1/step);
    let check_step = step * (1/step);

    if(value > max){
        value = max;
    } else if(value < min){
        value = min;
    } else if(check_value % check_step != 0){
        value -= value % step;
        value = Math.floor(value * (1/step)) / (1/step);
    }

    target.value = value;
}

//----------------------------------------------------------
// 数値上昇関数
//----------------------------------------------------------
function number_input_value_up(dom){
    let target = dom;
    let max = parseFloat(target.max);
    let min = parseFloat(target.min);
    let step = parseFloat(target.step);

    if(!target.value){
        target.value = min;
        return;
    }

    let value = parseFloat(target.value) + step;
    

    if(value >= max){
        value = max;
    }

    target.value = value;
}

//----------------------------------------------------------
// 数値降下関数
//----------------------------------------------------------
function number_input_value_down(dom){
    let target = dom;
    let min = parseFloat(target.min);
    let step = parseFloat(target.step);

    if(!target.value){
        target.value = min;
        return;
    }
    
    let value = parseFloat(target.value) - step;

    if(value <= min){
        value = min;
    }

    target.value = value;
}


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : インプットのid
//    props.min : スライダーの最小値
//    props.max : スライダーの最大値
//    props.step : スライダーのステップ値
// 
//========================================================================
function Button_number_input(props) {
    // プラスボタンのクラスリスト
    const [class_list_plus, setClass_list_plus] = useState([]);

    // マイナスボタンのクラスリスト
    const [class_list_minus, setClass_list_minus] = useState([]);

    // インプットへの参照
    const input = useRef();

    // プラスボタンへの参照
    const plus_button = useRef();

    // マイナスボタンへの参照
    const minus_button = useRef();

    // インプットのID
    const input_id = props.id ? props.id : nanoid();

    // タイムアウト処理への参照
    const long_tap_timeout = useRef(null);

    // ロングタップフラグ
    const long_tap_flg = useRef(false);

    // インターバル処理への参照
    const long_tap_interval = useRef(null);
    

    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(){
        // 好きな処理を記載
        
    }

    //------------------------------------------------
    // フォーカス解除イベント
    //------------------------------------------------
    function blur_event(){
        // 正規化
        normalize(input.current);
    }


    //------------------------------------------------
    // ボタンクリックイベント
    //------------------------------------------------
    function button_click_event(e){
        // ターゲットを取得
        let target = e.currentTarget;

        // マイナスボタンの場合
        if(target === minus_button.current){
            // 長押しフラグがOFFの場合、数値を下げる
            if(!long_tap_flg.current){
                number_input_value_down(input.current)
            }
        } 
        
        // プラスボタンの場合
        else if(target === plus_button.current){
            // 長押しフラグがOFFの場合、数値を上げる
            if(!long_tap_flg.current){
                number_input_value_up(input.current)
            }
        }
    }


    //------------------------------------------------
    // ボタン押し込みイベント
    //------------------------------------------------
    function button_pointerdown_event(e){
        // 標準処理を無効化
        e.preventDefault();
        
        // ターゲットを取得
        let target = e.currentTarget;

        // マイナスボタンの場合
        if(target === minus_button.current){
            // マイナスボタンに押し込み時のスタイルを追加
            setClass_list_minus([...class_list_minus, STYLE_NAME_PRESS_MINUS]);

            // 0.5秒間押し込みが持続している場合、0.1秒ごとに値を下げる
            long_tap_timeout.current = setTimeout(() => {
                long_tap_interval.current = setInterval(() => number_input_value_down(input.current), 100);
                long_tap_flg.current = true;
            }, 500)

        } 
        
        // プラスボタンの場合
        else if(target === plus_button.current){
            // プラスボタンに押し込み時のスタイルを追加
            setClass_list_plus([...class_list_plus, STYLE_NAME_PRESS_PLUS]);

            // 0.5秒間押し込みが持続している場合、0.1秒ごとに値を上げる
            long_tap_timeout.current = setTimeout(() => {
                long_tap_interval.current = setInterval(() => number_input_value_up(input.current), 100);
                long_tap_flg.current = true;
            }, 500)
        }
    }


    //------------------------------------------------
    // ボタン押し込み解除イベント
    //------------------------------------------------
    function button_pointerup_event(e){
        // ターゲットを取得
        let target = e.currentTarget;

        // マイナスボタンの場合
        if(target === minus_button.current){
            // マイナスボタンから押し込み時のスタイルを削除
            if(class_list_minus.includes(STYLE_NAME_PRESS_MINUS)){
                setClass_list_minus(class_list_minus.filter((cl) => cl != STYLE_NAME_PRESS_MINUS));
            }
        }
        
        // プラスボタンの場合
        else if(target === plus_button.current){
            // プラスボタンから押し込み時のスタイルを削除
            if(class_list_plus.includes(STYLE_NAME_PRESS_PLUS)){
                setClass_list_plus(class_list_plus.filter((cl) => cl != STYLE_NAME_PRESS_PLUS));
            }
        }

        // 長押し関連変数を初期化
        long_tap_flg.current = false;
        clearTimeout(long_tap_timeout.current);
        clearInterval(long_tap_interval.current);
    }

    
    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='button_number_input_block'>
            <button className={`minus_button_for_input ${class_list_minus.join(' ')}`} ref={minus_button}
                onClick={button_click_event}
                onPointerDown={button_pointerdown_event}
                onPointerUp={button_pointerup_event}
                onPointerLeave={button_pointerup_event}
                onPointerCancel={button_pointerup_event}></button>
            <input type='number' className='button_number_input' id={input_id} ref={input}
                min={props.min ? props.min : 0}
                max={props.max ? props.max : 100}
                step={props.step ? props.step : 1}
                onChange={change_event} 
                onBlur={blur_event}
                />
            <button className={`plus_button_for_input ${class_list_plus.join(' ')}`} ref={plus_button}
                onClick={button_click_event}
                onPointerDown={button_pointerdown_event}
                onPointerUp={button_pointerup_event}
                onPointerLeave={button_pointerup_event}
                onPointerCancel={button_pointerup_event}></button>
        </div>
    )
}

export default Button_number_input