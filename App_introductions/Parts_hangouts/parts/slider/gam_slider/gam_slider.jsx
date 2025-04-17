import { useRef } from 'react'
import { nanoid } from "nanoid";
import './gam_slider.css'

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
// パーセントから値への変換関数
//------------------------------------------------
function calc_value_from_percent(percent, min_val, max_val, step=1){
    let percent_tmp = parseFloat(percent);
    let min_val_tmp = parseFloat(min_val);
    let max_val_tmp = parseFloat(max_val);
    let step_tmp = parseFloat(step);

    let val = percent_tmp * (max_val_tmp - min_val_tmp) / 100 + min_val_tmp;
    val = Math.floor(val * (1/step_tmp)) / (1/step_tmp);
    return val;
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
function Gam_slider(props) {
    // スライダーへの参照
    const slider = useRef();

    // スライダーのID
    const slider_id = props.id ? props.id : nanoid();

    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(){
        // 好きな処理を記載
        
    }


    //------------------------------------------------
    // 変更イベント(設定関数)
    //------------------------------------------------
    function onchange_func(){
        // スライダーのスライド部分を更新
        let percent = calc_percent_from_value(slider.current.value, slider.current.min, slider.current.max);
        slider.current.style.setProperty('--value-percent', percent + '%');

        // 変更イベントを実行
        change_event();
    }


    //------------------------------------------------
    // 押し込みイベント
    //------------------------------------------------
    function pinterdown_event(e){
        // 標準処理を無効化
        e.preventDefault();
        // タッチムーブイベントを無効化
        document.addEventListener( 'touchmove', stop_scroll, { passive: false } );

        // 変数定義
        let target = slider.current;
        let baseX = e.clientX;
        let slider_width = target.getBoundingClientRect().width;
        let percent_base = calc_percent_from_value(target.value, target.min, target.max)
        let max_percent = 100;
        let min_percent = 0;

        //------------------------------------------
        // 移動関数
        //------------------------------------------
        function moving(e){
            // 移動量を計算
            let move_amount = e.clientX - baseX;
            let move_percent = percent_base + calc_percent_from_value(move_amount, 0, slider_width);
            
            // 上下限処理
            if(move_percent < min_percent){
                let sy = min_percent - move_percent;
                if(sy > 6){
                    sy = 6;
                }
                let sx = 1 - (sy / 6 / 10);
                let ssy = ( 2 - sx ) - (2 - sx - 1)/2;

                target.style.transform = "translateX(" + -sy + "px)";
                target.style.scale = ssy + " " + sx;
                move_percent = min_percent;
            } else if(move_percent > max_percent){
                let sy = max_percent - move_percent;
                if(sy < -6){
                    sy = -6;
                }
                let sx = 1 + (sy / 6 / 10);
                let ssy = ( 2 - sx ) - (2 - sx - 1)/2;

                target.style.transform = "translateX(" + -sy + "px)";
                target.style.scale = ssy + " " + sx;
                move_percent = max_percent;
            } else {
                target.style.transform = "none";
                target.style.scale = 1;
            }

            // スライダーに値を設定
            target.style.setProperty("--value-percent",  move_percent + "%");
            target.value = calc_value_from_percent(move_percent, target.min, target.max, target.step);
            change_event();
        }

        
        //------------------------------------------
        // 終了関数
        //------------------------------------------
        function decide(){
            // スライダーのスタイルを基に戻す
            target.style.transform = "none";
            target.style.scale = "none";

            // タッチムーブイベントを無効化を解除
            document.removeEventListener( 'touchmove', stop_scroll, { passive: false } );

            // ドキュメントのイベントを削除
            document.removeEventListener("pointermove", moving);
            document.removeEventListener("pointerleave", decide);
            document.removeEventListener("pointerup", decide);
        }

        // ドキュメントにイベントを設定
        document.addEventListener("pointermove", moving);
        document.addEventListener("pointerleave", decide);
        document.addEventListener("pointerup", decide);
    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <input type="range" id={slider_id} className='gam_slider' ref={slider}
            min={props.min ? props.min : 0}
            max={props.max ? props.max : 100}
            step={props.step ? props.step : 1}
            onChange={onchange_func}
            onPointerDown={pinterdown_event}
            />
    )
}

export default Gam_slider