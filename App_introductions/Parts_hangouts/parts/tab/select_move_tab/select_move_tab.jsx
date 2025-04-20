import { useRef } from 'react'
import { nanoid } from 'nanoid';
import './select_move_tab.css'

// 標準リスト
const NORMAL_TAB_LIST = [
    {
        label: 'Tab0',
        id: 'select_move_tab0',
        main : <div className='normal_tab_main'>Tab0</div>
    },
    {
        label: 'Tab1',
        id: 'select_move_tab1',
        main : <div className='normal_tab_main'>Tab1</div>
    },
    {
        label: 'Tab2',
        id: 'select_move_tab2',
        main : <div className='normal_tab_main'>Tab2</div>
    },
    {
        label: 'Tab3',
        id: 'select_move_tab3',
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
function Select_move_tab(props) {
    // ベースID
    const id_base = useRef(nanoid());
    
    // 選択中のタブのアウトラインへの参照
    const selected_outlie = useRef();

    // タブメインブロックへの参照
    const tab_main_block = useRef();


    //------------------------------------------------
    // タブスイッチ関数
    //------------------------------------------------
    function tab_switch(e){
        // 標準処理を無効化
        e.preventDefault();

        // ターゲットのIDを取得
        let target = e.currentTarget;
        let target_id = target.href.slice(target.href.indexOf('#')+1, target.href.length);

        // ターゲットを取得
        let view_target = document.getElementById(target_id);

        if(view_target){
            // ターゲットまでスクロール
            tab_main_block.current.scrollTo({
                top: 0,
                left: view_target.offsetLeft,
                behavior : 'smooth'
            })
        }

        // 選択中のタブのアウトラインを移動
        selected_outlie.current.style.top = target.offsetTop + 'px';
    }


    // タブリスト
    const tab_list = props.tab_list ? 
        props.tab_list.map((tab, index) => {
            const tab_id = tab.id ? tab.id : id_base.current + String(index);
            const tab_label = tab.label ? tab.label : 'Tab' + String(index);            
            
            return (
                <a href={`#${tab_id}`} className='select_move_tab' key={tab_id}
                    onClick={tab_switch}>{tab_label}</a>
            )
        })
        :
        NORMAL_TAB_LIST.map((tab) => (
            <a href={`#${tab.id}`} className='select_move_tab' key={tab.id}
                onClick={tab_switch}>{tab.label}</a>
        ));


    // タブメインリスト
    const tab_main_list = props.tab_list ?
        props.tab_list.map((tab, index) => {
            const tab_id = tab.id ? tab.id : id_base.current + String(index);
            const tab_main = tab.main ? tab.main : <div>Tab{String(index)}</div>;

            return (
                <div className='select_move_tab_main' id={tab_id}  key={tab_id}>
                    {tab_main}
                </div>
            )
        })
        :
        NORMAL_TAB_LIST.map((tab) => (
            <div className='select_move_tab_main' id={tab.id}  key={tab.id}>
                {tab.main}
            </div>
        ));

        
    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='select_move_tab_block'>
            <div className='select_move_tab_bar'>
                {tab_list}
                <div className='selected_outline' ref={selected_outlie}></div>
            </div>
            <div className='select_move_tab_main_block' ref={tab_main_block}>
                {tab_main_list}
            </div>
        </div>
    )
}

export default Select_move_tab