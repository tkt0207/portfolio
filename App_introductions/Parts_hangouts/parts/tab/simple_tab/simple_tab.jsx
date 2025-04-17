import { useState, useRef } from 'react'
import { nanoid } from 'nanoid';
import './simple_tab.css'

// 選択中のタグのスタイル名
const STYLE_NAME_SELECTED = 'simple_tab_selected';

// 標準リスト
const NORMAL_TAB_LIST = [
    {
        label: 'Tab0',
        id: 'simple_tab0',
        main : <div className='normal_tab_main'>Tab0</div>
    },
    {
        label: 'Tab1',
        id: 'simple_tab1',
        main : <div className='normal_tab_main'>Tab1</div>
    },
    {
        label: 'Tab2',
        id: 'simple_tab2',
        main : <div className='normal_tab_main'>Tab2</div>
    },
    {
        label: 'Tab3',
        id: 'simple_tab3',
        main : <div className='normal_tab_main'>Tab3</div>
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
//========================================================================
function Simple_tab(props) {
    // ベースID
    const id_base = useRef(nanoid());

    // 初めのID
    const first_id = props.tab_list ? props.tab_list[0].id ? props.tab_list[0].id : id_base.current + '0' : NORMAL_TAB_LIST[0].id;
    
    // 選択中のタブID
    const [display_tab_id, SetDisplay_tab_id] = useState(first_id);


    //------------------------------------------------
    // タブスイッチ関数
    //------------------------------------------------
    function tab_switch(e){
        // 標準処理を無効化
        e.preventDefault();

        // ターゲットのIDを取得
        let target = e.currentTarget;
        let target_id = target.href.slice(target.href.indexOf('#')+1, target.href.length);

        // 選択中のタブIDを更新
        SetDisplay_tab_id(target_id);
    }


    // タブリスト
    const tab_list = props.tab_list ? 
        props.tab_list.map((tab, index) => {
            const tab_id = tab.id ? tab.id : id_base.current + String(index);
            const tab_label = tab.label ? tab.label : 'Tab' + String(index);
            console.log(tab_id);           
            
            return (
                <a href={`#${tab_id}`} className={`simple_tab ${display_tab_id === tab_id && STYLE_NAME_SELECTED}`} key={tab_id}
                    onClick={tab_switch}>{tab_label}</a>
            )
        })
        :
        NORMAL_TAB_LIST.map((tab) => (
            <a href={`#${tab.id}`} className={`simple_tab ${display_tab_id === tab.id && STYLE_NAME_SELECTED}`} key={tab.id}
                onClick={tab_switch}>{tab.label}</a>
        ));


    // タブメインリスト
    const tab_main_list = props.tab_list ?
        props.tab_list.map((tab, index) => {
            const tab_id = tab.id ? tab.id : id_base.current + String(index);
            const tab_main = tab.main ? tab.main : <div>Tab{String(index)}</div>;
            console.log(tab_id);

            return (
                display_tab_id === tab_id &&
                    <div className='simple_tab_main' id={tab_id}  key={tab_id}>
                        {tab_main}
                    </div>
            )
        })
        :
        NORMAL_TAB_LIST.map((tab) => (
            display_tab_id === tab.id &&
                <div className='simple_tab_main' id={tab.id}  key={tab.id}>
                        {tab.main}
                </div>
        ));

    
    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='simple_tab_block'>
            <div className='simple_tab_bar'>
                {tab_list}
            </div>
            <div className='simple_tab_main_block'>
                {tab_main_list}
            </div>
        </div>
    )
}

export default Simple_tab