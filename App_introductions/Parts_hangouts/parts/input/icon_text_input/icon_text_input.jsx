import { nanoid } from "nanoid";
import './icon_text_input.css'


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : インプットのid
// 
//========================================================================
function Icon_text_input(props) {
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
        <div className='icon_text_input_block'>
            <div className='input_icon'></div>
            <input type='text' className='icon_text_input' id={input_id}
                onChange={change_event}/>
        </div>
        
    )
}

export default Icon_text_input