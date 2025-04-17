import { useState, useRef } from 'react'
import { nanoid } from 'nanoid';
import './color_tab.css'

// 選択中のタブのスタイル名
const STYLE_NAME_SELECTED = 'color_tab_selected';

// 標準リスト
const NORMAL_TAB_LIST = [
    {
        label: 'Tab0',
        id: 'color_tab0',
        main : <div className='normal_tab_main'>Tab0</div>,
        color: '#84B1ED'
    },
    {
        label: 'Tab1',
        id: 'color_tab1',
        main : <div className='normal_tab_main'>Tab1</div>,
        color: '#C89EC4'
    },
    {
        label: 'Tab2',
        id: 'color_tab2',
        main : <div className='normal_tab_main'>Tab2</div>,
        color: '#EE7785'
    },
    {
        label: 'Tab3',
        id: 'color_tab3',
        main : <div className='normal_tab_main'>Tab3</div>,
        color: '#67D5B5'
    },
]


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.tab_list : タブリスト
//      -> label : タブのラベル
//      -> id : タブのメインコンテンツのid
//      -> main : タブのメインコンテンツ
//      -> color : タブの色
//========================================================================
function Color_tab(props) {
    // ベースID
    const id_base = useRef(nanoid());

    // 初めのID
    const first_id = props.tab_list ? props.tab_list[0].id ? props.tab_list[0].id : id_base.current + '0' : NORMAL_TAB_LIST[0].id;
    
    // 選択中のタブID
    const [display_tab_id, SetDisplay_tab_id] = useState(first_id);

    // 初期色
    const first_color = props.tab_list ? props.tab_list[0].color ? props.tab_list[0].color : 'rgb(127, 127, 127)' : NORMAL_TAB_LIST[0].color;

    // タブブロックの色
    const [main_color, setMain_color] = useState(first_color);

    // インプット名
    const input_name = nanoid();


    // タブリスト
    const tab_list = props.tab_list ? 
        props.tab_list.map((tab, index) => {
            const tab_id = tab.id ? tab.id : id_base.current + String(index);
            const tab_label = tab.label ? tab.label : 'Tab' + String(index);   
            const tab_color = tab.color ? tab.color : 'rgb(127, 127, 127)';         
            
            return (
                <label key={tab_id} className={`color_tab ${display_tab_id === tab_id && STYLE_NAME_SELECTED}`}
                    style={{'--main-color': tab_color}}
                    onClick={() => {
                        SetDisplay_tab_id(tab_id);
                        setMain_color(tab_color);
                    }
                    }>
                    <input type='radio' name={input_name} />
                    {tab_label}
                </label>
            )
        })
        :
        NORMAL_TAB_LIST.map((tab) => (
            <label key={tab.id} className={`color_tab ${display_tab_id === tab.id && STYLE_NAME_SELECTED}`}
                style={{'--main-color': tab.color}}
                onClick={() => {
                    SetDisplay_tab_id(tab.id);
                    setMain_color(tab.color);
                }
                }>
                <input type='radio' name={input_name} />
                {tab.label}
            </label>
        ));


    // タブメインリスト
    const tab_main_list = props.tab_list ?
        props.tab_list.map((tab, index) => {
            const tab_id = tab.id ? tab.id : id_base.current + String(index);
            const tab_main = tab.main ? tab.main : <div>Tab{String(index)}</div>;

            return (
                display_tab_id === tab_id &&
                    <div className='color_tab_main' id={tab_id}  key={tab_id}>
                        {tab_main}
                    </div>
            )
        })
        :
        NORMAL_TAB_LIST.map((tab) => (
            display_tab_id === tab.id &&
                <div className='color_tab_main' id={tab.id}  key={tab.id}>
                    {tab.main}
                </div>
        ));


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='color_tab_block'>
            <div className='color_tab_bar'>
                {tab_list}
                <div className='color_bottom_foot'
                    style={{'--foot-color': main_color}}></div>
            </div>
            <div className='color_tab_main_block'
                style={{'--border-color': main_color}}>
                {tab_main_list}
            </div>
        </div>
    )
}

export default Color_tab