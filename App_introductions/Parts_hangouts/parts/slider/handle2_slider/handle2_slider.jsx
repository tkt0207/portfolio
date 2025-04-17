import { useRef } from 'react'
import { nanoid } from "nanoid";
import './handle2_slider.css'

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
//    props.id1 : スライダ1ーのid
//    props.id2 : スライダ2ーのid
//    props.min : スライダーの最小値
//    props.max : スライダーの最大値
//    props.step : スライダーのステップ値
// 
//========================================================================
function Handle2_slider(props) {
    // スライダー全体への参照
    const slider_bar = useRef();

    // スライダー1への参照
    const slider1 = useRef();

    // スライダー2への参照
    const slider2 = useRef();

    // スライダー1のID
    const slider_id1 = props.id1 ? props.id1 : nanoid();
    
    // スライダー2のID
    const slider_id2 = props.id2 ? props.id2 : nanoid();


    //------------------------------------------------
    // 変更イベント1
    //------------------------------------------------
    function change_event1(){
        // スライダー1の値がスライダー2の値以上の場合
        if(parseFloat(slider1.current.value) >= parseFloat(slider2.current.value)){
            // スライダー1の値をスライダー2の値にする
            slider1.current.value = slider2.current.value;
            // 内部の円の色を混ぜる
            slider_bar.current.style.setProperty('--crash-percent', '50%');
        } 
        
        // スライダー1の値がスライダー2の値未満の場合
        else {
            // 内部の円の色を戻す
            slider_bar.current.style.setProperty('--crash-percent', '100%');
        }

        // スライダー1のスライド部分の横幅を更新
        let percent1 = calc_percent_from_value(slider1.current.value, slider1.current.min, slider1.current.max);
        slider_bar.current.style.setProperty('--value-percent1', percent1 + '%');

        // 好きな処理を記載
        
    }

    //------------------------------------------------
    // 変更イベント2
    //------------------------------------------------
    function change_event2(){
        // スライダー2の値がスライダー1の値以下の場合
        if(parseFloat(slider2.current.value) <= parseFloat(slider1.current.value)){
            // スライダー2の値をスライダー1の値にする
            slider2.current.value = slider1.current.value;
            // 内部の円の色を混ぜる
            slider_bar.current.style.setProperty('--crash-percent', '50%');
        } 
        
        // スライダー2の値がスライダー1の値より上の場合
        else {
            // 内部の円の色を戻す
            slider_bar.current.style.setProperty('--crash-percent', '100%');
        }

        // スライダー1のスライド部分の横幅を更新
        let percent2 = calc_percent_from_value(slider2.current.value, slider2.current.min, slider2.current.max);
        slider_bar.current.style.setProperty('--value-percent2', percent2 + '%');

        // 好きな処理を記載
        
    }


    //------------------------------------------------
    // 押し込みイベント1
    //------------------------------------------------
    function pointerdown_func1(e){
        // 標準処理を無効化
        e.preventDefault();
        // タッチムーブイベントを無効化
        document.addEventListener( 'touchmove', stop_scroll, { passive: false } );

        // 変数を定義
        let target = slider1.current;
        let baseX = e.clientX;
        let slider_width = target.getBoundingClientRect().width;
        let percent_base = calc_percent_from_value(target.value, target.min, target.max)

        //------------------------------------------
        // 移動関数
        //------------------------------------------
        function moving(e){
            // 移動量を計算
            let move_amount = e.clientX - baseX;
            let move_percent = percent_base + calc_percent_from_value(move_amount, 0, slider_width);

            // 値を更新
            target.value = calc_value_from_percent(move_percent, target.min, target.max, target.step);
            change_event1();
        }


        //------------------------------------------
        // 終了関数
        //------------------------------------------
        function decide(){
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
    // 押し込みイベント2
    //------------------------------------------------
    function pointerdown_func2(e){
        // 標準処理を無効化
        e.preventDefault();
        // タッチムーブイベントを無効化
        document.addEventListener( 'touchmove', stop_scroll, { passive: false } );
        
        // 変数を定義
        let target = slider2.current;
        let baseX = e.clientX;
        let slider_width = target.getBoundingClientRect().width;
        let percent_base = calc_percent_from_value(target.value, target.min, target.max)

        //------------------------------------------
        // 移動関数
        //------------------------------------------
        function moving(e){
            // 移動量を計算
            let move_amount = e.clientX - baseX;
            let move_percent = percent_base + calc_percent_from_value(move_amount, 0, slider_width);

            // 値を更新
            target.value = calc_value_from_percent(move_percent, target.min, target.max, target.step);
            change_event2();
        }


        //------------------------------------------
        // 終了関数
        //------------------------------------------
        function decide(){
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
        <div className='handle2_slider_block' ref={slider_bar}>
            <input type="range" id={slider_id1} className='handle2_slider_first' ref={slider1}
                        min={props.min ? props.min : 0}
                        max={props.max ? props.max : 100}
                        step={props.step ? props.step : 1}
                        onChange={change_event1}/>
            <input type="range" id={slider_id2} className='handle2_slider_end' ref={slider2}
                        min={props.min ? props.min : 0}
                        max={props.max ? props.max : 100}
                        step={props.step ? props.step : 1}
                        onChange={change_event2}/>
                                    
            <div className='start_block'
                onPointerDown={pointerdown_func1}>
                <div className='start_handle'></div>
            </div>
            <div className='end_block'
                onPointerDown={pointerdown_func2}>
                <div className='end_handle'></div>
            </div>
        </div>
        
    )
}

export default Handle2_slider