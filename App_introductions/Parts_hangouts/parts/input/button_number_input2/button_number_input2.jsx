import { useRef, useState } from "react";
import { nanoid } from "nanoid";
import './button_number_input2.css'

// オフセット最大値
const OFFSET_MAX = 127;

// オフセット最小値
const OFFSET_MIN = 50;

// 値上昇中のスタイル名
const STYLE_NAME_UP_NOW = 'circle_button_up_now';

// 値下降中のスタイル名
const STYLE_NAME_DOWN_NOW = 'circle_button_down_now';


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
function number_input_value_up(dom, multi=1){
    let target = dom;
    let max = parseFloat(target.max);
    let min = parseFloat(target.min);
    let step = parseFloat(target.step);

    if(!target.value){
        target.value = min;
        return;
    }

    let value = parseFloat(target.value) + step*multi;
    

    if(value >= max){
        value = max;
    }

    target.value = value;
}

//----------------------------------------------------------
// 数値降下関数
//----------------------------------------------------------
function number_input_value_down(dom, multi=1){
    let target = dom;
    let min = parseFloat(target.min);
    let step = parseFloat(target.step);

    if(!target.value){
        target.value = min;
        return;
    }
    
    let value = parseFloat(target.value) - step*multi;

    if(value <= min){
        value = min;
    }

    target.value = value;
}

//----------------------------------------------------------
// スクロール禁止関数
//----------------------------------------------------------
function stop_scroll(e){
    if(e.cancelable){
        e.preventDefault();
    }
}


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : インプットのid
//    props.min : スライダーの最小値
//    props.max : スライダーの最大値
//    props.step : スライダーのステップ値
//    props.unit : 単位
// 
//========================================================================
function Button_number_input2(props) {
    // ボタンのクラスリスト
    const [button_class_list, setButton_class_list] = useState([]);

    // ボタンの角度
    const [button_angle, setButton_angle] = useState(0);
    
    // インプットへの参照
    const input = useRef();

    // オフセットへの参照
    const offset = useRef();

    // ボタンへの参照
    const button = useRef();

    // インプットのID
    const input_id = props.id ? props.id : nanoid();


    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(){
        // オフセットの値を更新
        let target = input.current;
        let percent = (parseFloat(target.value) - parseFloat(target.min)) / (parseFloat(target.max) - parseFloat(target.min));
        offset.current.style.offsetDistance = (OFFSET_MAX - OFFSET_MIN) * percent + OFFSET_MIN + '%';

        // 好きな処理を記載
        
    }


    //------------------------------------------------
    // フォーカス解除イベント
    //------------------------------------------------
    function blur_event(){
        // 正規化
        normalize(input.current)
        change_event();
    }

    //------------------------------------------------
    // アップボタンクリックイベント
    //------------------------------------------------
    function button_top_click_event(){
        // 値を上昇
        number_input_value_up(input.current);
        change_event();
    }

    //------------------------------------------------
    // ダウンボタンクリックイベント
    //------------------------------------------------
    function button_down_click_event(){
        // 値を下降
        number_input_value_down(input.current);
        change_event();
    }

    
    //------------------------------------------------
    // ボタンフォーカスイベント
    //------------------------------------------------
    function button_focus(){
        // ターゲットを取得
        let target = button.current;

        // 角度を取得
        let angle_tmp = button_angle;

        // ターゲットにキー押し込みイベントを設定
        target.onkeydown = (e) => {
            // →もしくは↑キーが押されたとき
            if((e.key == 'ArrowRight') || (e.key == 'ArrowUp')){
                // 標準処理を無効化
                e.preventDefault();

                // 数値を上昇
                number_input_value_up(input.current);

                // ボタンに上昇中のスタイルを適用
                setButton_class_list([...button_class_list.filter((cl) => cl != STYLE_NAME_DOWN_NOW), STYLE_NAME_UP_NOW]);
                
                // 値が最大になるまで角度を上げる
                if(parseFloat(input.current.value) < parseFloat(input.current.max)){
                    angle_tmp += 5;
                }

                // 角度を設定
                setButton_angle(angle_tmp);
                
                // 変更イベントを実施
                change_event();
            } 
            
            // ←もしくは↓キーが押されたとき
            else if((e.key == 'ArrowLeft') || (e.key == 'ArrowDown')){
                // 標準処理を無効化
                e.preventDefault();

                // 数値を下降
                number_input_value_down(input.current);

                // ボタンに下降中のスタイルを適用
                setButton_class_list([...button_class_list.filter((cl) => cl != STYLE_NAME_UP_NOW), STYLE_NAME_DOWN_NOW]);

                // 値が最小になるまで角度を下げる
                if(parseFloat(input.current.value) > parseFloat(input.current.min)){
                    angle_tmp -= 5;
                }

                // 角度を設定
                setButton_angle(angle_tmp);

                // 変更イベントを実施
                change_event();
            }
        }

        // ターゲットにキー押し込み終了時のイベントを設定
        target.onkeyup = (e) => {
            // 標準処理を無効化
            e.preventDefault();

            // ボタンのクラスリストから上昇中と下降中のスタイルを削除
            setButton_class_list(button_class_list.filter((cl) => {
                ((cl != STYLE_NAME_UP_NOW) && (cl != STYLE_NAME_DOWN_NOW))
            }));

            // 角度を初期化
            angle_tmp = 0;
            setButton_angle(angle_tmp);
        }

        // ターゲットにフォーカス解除時のイベントを設定
        target.onblur = () => {
            // ボタンのクラスリストから上昇中と下降中のスタイルを削除
            setButton_class_list(button_class_list.filter((cl) => {
                ((cl != STYLE_NAME_UP_NOW) && (cl != STYLE_NAME_DOWN_NOW))
            }));

            // 角度を初期化
            angle_tmp = 0;
            setButton_angle(angle_tmp);

            // ターゲットに設定しているイベントを削除
            target.onkeydown = null;
            target.onkeyup = null;
            target.onblur = null;
        }
    }


    //------------------------------------------------
    // ボタンマウスダウンイベント
    //------------------------------------------------
    function button_pointerdown_event(e){
        // 標準処理を無効化
        e.preventDefault();
        // タッチムーブイベントを無効化
        document.addEventListener( 'touchmove', stop_scroll, { passive: false } );

        // ボタンの変形時間を0秒に設定
        button.current.style.transitionDuration = '0s';

        // 位置情報を取得
        let clientX_tmp = e.clientX;
        let clientY_tmp = e.clientY;

        // 角度変数を定義
        let now_angle = 0;


        //------------------------------------------
        // 回転関数
        //------------------------------------------
        function rotate_number_change(e){
            // 位置情報を取得
            let clientY = e.clientY;
            let clientX = e.clientX;

            // 移動量を取得
            let tmp = clientX - clientX_tmp + clientY_tmp - clientY;
            
            // 移動量が0未満の場合
            if(tmp < 0){
                // 値を下降
                number_input_value_down(input.current);
                // ボタンから上昇中のスタイルを削除し、下降中のスタイルを適用
                setButton_class_list([...button_class_list.filter((cl) => cl != STYLE_NAME_UP_NOW), STYLE_NAME_DOWN_NOW]);
                // 変更イベントを実施
                change_event();
            } else if(tmp > 0){
                // 値を上昇
                number_input_value_up(input.current);
                // ボタンから下降中のスタイルを削除し、上昇中のスタイルを適用
                setButton_class_list([...button_class_list.filter((cl) => cl != STYLE_NAME_DOWN_NOW), STYLE_NAME_UP_NOW]);
                // 変更イベントを実施
                change_event();
            }

            // 追加角度の上下限処理
            if(tmp > 5){
                now_angle += 5;
            } else if(tmp < -5){
                now_angle -= 5;
            } else {
                now_angle += tmp;
            }

            // 角度を設定
            setButton_angle(now_angle);
        }


        //------------------------------------------
        // 終了関数
        //------------------------------------------
        function decide(){
            // タッチムーブイベントの無効化を解除
            document.removeEventListener( 'touchmove', stop_scroll, { passive: false } );

            // ボタンの変形時間を0.5秒に設定
            button.current.style.transitionDuration = '0.5s';

            // ボタンから上昇中と下降中のスタイルを削除
            setButton_class_list(button_class_list.filter((cl) => {
                ((cl != STYLE_NAME_UP_NOW) && (cl != STYLE_NAME_DOWN_NOW))
            }));

            // 角度を初期化
            setButton_angle(0);

            // ドキュメントのイベントを削除
            document.removeEventListener("pointermove", rotate_number_change);
            document.removeEventListener("pointerleave", decide);
            document.removeEventListener("pointerup", decide);
        }

        // ドキュメントにイベントを設定
        document.addEventListener("pointermove", rotate_number_change);
        document.addEventListener("pointerleave", decide);
        document.addEventListener("pointerup", decide);
    }

    
    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='button_number_input2_block'>
            <input type='number' className='button_number_input2' id={input_id} ref={input}
                min={props.min ? props.min : 0}
                max={props.max ? props.max : 100}
                step={props.step ? props.step : 1}
                onChange={change_event} 
                onBlur={blur_event}
                />
                <button className={`circle_button ${button_class_list.join(' ')}`} data-descr={props.unit ? props.unit : '%'} ref={button}
                    style={{'--rotate-angle': button_angle}}
                    onFocus={button_focus}
                    onPointerDown={button_pointerdown_event}>
                    <div className="circle_detection_top"
                        onClick={button_top_click_event}></div>
                    <div className="circle_detection_bottom"
                        onClick={button_down_click_event}></div>
                </button>
                <span className="circle_offset" ref={offset}></span>
        </div>
    )
}

export default Button_number_input2