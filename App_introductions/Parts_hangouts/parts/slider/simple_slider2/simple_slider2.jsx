import { useRef } from 'react'
import { nanoid } from "nanoid";
import './simple_slider2.css'

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
function Simple_slider2(props) {
    // スライダーへの参照
    const slider = useRef();

    // スライダーのID
    const slider_id = props.id ? props.id : nanoid();

    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(e){
        // スライダーのスライド部分を更新
        let percent = calc_percent_from_value(slider.current.value, slider.current.min, slider.current.max);
        slider.current.style.setProperty('--value-percent', percent + '%');

        // 好きな処理を記載
        
    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <input type="range" id={slider_id} className='simple_slider2' ref={slider}
            min={props.min ? props.min : 0}
            max={props.max ? props.max : 100}
            step={props.step ? props.step : 1}
            onChange={change_event}/>
    )
}

export default Simple_slider2