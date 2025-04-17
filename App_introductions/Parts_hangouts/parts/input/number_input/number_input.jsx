import { nanoid } from "nanoid";
import './number_input.css'


//----------------------------------------------------------
// 正規化関数
//----------------------------------------------------------
function normalize(e){
    const target = e.currentTarget;
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
function Number_input(props) {
    // インプットのID
    const input_id = props.id ? props.id : nanoid();

    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(){
        // 好きな処理を記載
        
    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <input type='number' className='number_input' id={input_id}
            min={props.min ? props.min : 0}
            max={props.max ? props.max : 100}
            step={props.step ? props.step : 1}
            onChange={change_event} 
            onBlur={normalize}
            />
    )
}

export default Number_input