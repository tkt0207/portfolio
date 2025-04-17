import { useRef, useState } from 'react'
import { nanoid } from "nanoid";
import './circle_slider2.css'

// 開始角度
const START_ANGLE = 0;

// 終了角度
const END_ANGLE = 360;

//------------------------------------------------
// 値からパーセントへの変換関数
//------------------------------------------------
function calc_percent_from_value(val, min_val, max_val){
    let val_tmp = parseFloat(val);
    let min_val_tmp = parseFloat(min_val);
    let max_val_tmp = parseFloat(max_val);

    let percent = (val_tmp - min_val_tmp) / (max_val_tmp - min_val_tmp) * 100;
    return percent;
}


//------------------------------------------------
// 角度から値への変換関数
//------------------------------------------------
function calc_value_from_angle(angle, min_angle, max_angle, min_val, max_val, step){
    let angle_tmp = parseFloat(angle);
    let min_angle_tmp = parseFloat(min_angle);
    let max_angle_tmp = parseFloat(max_angle);
    let min_val_tmp = parseFloat(min_val);
    let max_val_tmp = parseFloat(max_val);
    let step_tmp = parseFloat(step)

    let angle_fix = (angle_tmp - min_angle_tmp) / (max_angle_tmp - min_angle_tmp) * 360;
    let percent = angle_fix / 360 * 100;
    let value = (max_val_tmp - min_val_tmp) / 100 * percent + min_val_tmp;
    value = Math.round(value * (1/step_tmp)) / (1/step_tmp);

    return value;
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
//    props.id : スライダーのid
//    props.min : スライダーの最小値
//    props.max : スライダーの最大値
//    props.step : スライダーのステップ値
// 
//========================================================================
function Circle_slider2(props) {
    // スライダーへの参照
    const slider = useRef();

    // スライダーバーブロックへの参照
    const slider_block = useRef();

    // スライダーのID
    const slider_id = props.id ? props.id : nanoid();


    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(){
        // スライダーのスライド部分を更新
        let percent = calc_percent_from_value(slider.current.value, slider.current.min, slider.current.max);
        slider_block.current.style.setProperty('--value-percent', percent + '%');

        if(percent == 0){
            slider_block.current.style.setProperty('--bar-color', 'rgb(0,0,0,0)');
        } else if(percent < 10){
            slider_block.current.style.setProperty('--bar-color', 'red');
        } else if(percent < 20){
            slider_block.current.style.setProperty('--bar-color', 'orange');
        } else {
            slider_block.current.style.setProperty('--bar-color', 'rgb(6, 248, 176)');
        }

        // 好きな処理を記載
        
    }


    //------------------------------------------------
    // 押し込みイベント
    //------------------------------------------------
    function pointerdown_event(e){
        // 標準処理を無効化
        e.preventDefault();
        // タッチムーブイベントを無効化
        document.addEventListener( 'touchmove', stop_scroll, { passive: false } );

        // 変数を定義
        let target = slider.current;
        let min_val = target.min;
        let max_val = target.max;
        let radius = target.getBoundingClientRect().width / 2;
        let angle_old = -1;

        // 角度を設定
        set_angle(e);

        //------------------------------------------
        // 角度設定関数
        //------------------------------------------
        function set_angle(e){
            // スライダー内のクリック位置を取得
            let x = e.pageX - target.getBoundingClientRect().left - scrollX;
            let y = e.pageY - target.getBoundingClientRect().top - scrollY;

            // クリック位置から角度を取得
            let rad = Math.atan(Math.abs((x-radius)/(y-radius)));
            let deg = rad * 180 / Math.PI;

            if(x > radius){
                if(y > radius){
                    //第4象限
                    deg = 180 - deg;
                } else {
                    //第1象限
                    deg = deg;
                }
            } else {
                if(y > radius){
                    //第3象限
                    deg = deg + 180;
                } else {
                    //第2象限
                    deg = 360 - deg;
                }
            }

            // 上下限処理
            if(deg < START_ANGLE){
                deg = START_ANGLE;
            } else if(deg > END_ANGLE){
                deg = END_ANGLE
            }


            // 上下限ストップ処理
            if(angle_old == -1){
                angle_old = deg;
            } else {
                if(Math.abs(angle_old - deg) >= (END_ANGLE - START_ANGLE)/2){
                    return;
                }
                angle_old = deg;
            }

            // 値を更新
            target.value = calc_value_from_angle(deg, START_ANGLE, END_ANGLE, min_val, max_val, target.step);
            change_event();
        }


        //------------------------------------------
        // 終了関数
        //------------------------------------------
        function decide(){
            // タッチムーブイベントを無効化を解除
            document.removeEventListener( 'touchmove', stop_scroll, { passive: false } );

            // ドキュメントのイベントを削除
            document.removeEventListener("pointermove", set_angle);
            document.removeEventListener("pointerleave", decide);
            document.removeEventListener("pointerup", decide);
        }

        // ドキュメントにイベントを設定
        document.addEventListener("pointermove", set_angle);
        document.addEventListener("pointerleave", decide);
        document.addEventListener("pointerup", decide);
    }

    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='circle_slider2_block' ref={slider_block}>
            <input type="range" id={slider_id} className='circle_slider2' ref={slider}
                min={props.min ? props.min : 0}
                max={props.max ? props.max : 100}
                step={props.step ? props.step : 1}
                onChange={change_event}
                onPointerDown={pointerdown_event}/>
            <div className='slider_in_circle'></div>
            <div className='slider_in_content'></div>
        </div>
    )
}

export default Circle_slider2