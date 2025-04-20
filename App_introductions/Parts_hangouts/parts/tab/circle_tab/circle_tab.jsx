import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid';
import './circle_tab.css'

// 選択中のタブのスタイル名
const STYLE_NAME_SELECTED = 'circle_tab_selected';

const STYLE_NAME_BAR_VIEW = 'circle_tab_bar_view';

// スクロール基準位置
const SCROLL_LOC_BASE = 10000;

// 標準リスト
const NORMAL_TAB_LIST = [
    {
        label: 'Tab0',
        id: 'circle_tab0',
        main : <div className='normal_tab_main'>Tab0</div>
    },
    {
        label: 'Tab1',
        id: 'circle_tab1',
        main : <div className='normal_tab_main'>Tab1</div>
    },
    {
        label: 'Tab2',
        id: 'circle_tab2',
        main : <div className='normal_tab_main'>Tab2</div>
    },
    {
        label: 'Tab3',
        id: 'circle_tab3',
        main : <div className='normal_tab_main'>Tab3</div>
    },
    {
        label: 'Tab4',
        id: 'circle_tab4',
        main : <div className='normal_tab_main'>Tab4</div>
    },
    {
        label: 'Tab5',
        id: 'circle_tab5',
        main : <div className='normal_tab_main'>Tab5</div>
    },
    {
        label: 'Tab6',
        id: 'circle_tab6',
        main : <div className='normal_tab_main'>Tab6</div>
    },
    {
        label: 'Tab7',
        id: 'circle_tab7',
        main : <div className='normal_tab_main'>Tab7</div>
    }
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
function Circle_tab(props) {
    // ベースID
    const id_base = useRef(nanoid());

    // 初めのID
    const first_id = props.tab_list ? props.tab_list[0].id ? props.tab_list[0].id : id_base.current + '0' : NORMAL_TAB_LIST[0].id;
    
    // 選択中のタブID
    const [display_tab_id, SetDisplay_tab_id] = useState(first_id);

    // タブの数
    const tab_num = props.tab_list ? props.tab_list.length : NORMAL_TAB_LIST.length;

    // タブバーへの参照
    const tab_bar = useRef();

    // 回転角度
    const angle = useRef(0);

    // タブバーのクラスリスト
    const [bar_class_list, setBar_class_list] = useState([]);
    
    // タイムアウト関数への参照
    const timeout = useRef(null);

    // スクロール量(X軸)の前回値
    const scroll_oldX = useRef(SCROLL_LOC_BASE);

    // スクロール量(Y軸)の前回値
    const scroll_oldY = useRef(SCROLL_LOC_BASE);

    // スクロール終了フラグ
    const scroll_end_flg_read = useRef(false);


    // タブリスト
    const tab_list = props.tab_list ? 
        props.tab_list.map((tab, index) => {
            const tab_id = tab.id ? tab.id : id_base.current + String(index);
            const tab_label = tab.label ? tab.label : 'Tab' + String(index);            
            
            return (
                <div className={`circle_tab ${display_tab_id === tab_id && STYLE_NAME_SELECTED}`} key={tab_id}
                    style={{'--num':index}}
                    onClick={ (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        SetDisplay_tab_id(tab_id);
                        tab_bar_rotate(index);
                    }
                    }>{tab_label}</div>
            )
        })
        :
        NORMAL_TAB_LIST.map((tab, index) => (
            <div className={`circle_tab ${display_tab_id === tab.id && STYLE_NAME_SELECTED}`} key={tab.id}
                style={{'--num':index}}
                onClick={ (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    SetDisplay_tab_id(tab.id);
                    tab_bar_rotate(index);
                }}>{tab.label}</div>
        ));


    // タブメインリスト
    const tab_main_list = props.tab_list ?
        props.tab_list.map((tab, index) => {
            const tab_id = tab.id ? tab.id : id_base.current + String(index);
            const tab_main = tab.main ? tab.main : <div>Tab{String(index)}</div>;

            return (
                display_tab_id === tab_id &&
                    <div className='circle_tab_main' id={tab_id}  key={tab_id}>
                        {tab_main}
                    </div>
            )
        })
        :
        NORMAL_TAB_LIST.map((tab) => (
            display_tab_id === tab.id &&
                <div className='circle_tab_main' id={tab.id}  key={tab.id}>
                    {tab.main}
                </div>
        ));


    //------------------------------------------------
    // タブバー表示関数
    //------------------------------------------------
    function tab_bar_click_event(e){
        e.stopPropagation();

        if(!bar_class_list.includes(STYLE_NAME_BAR_VIEW)){
            setBar_class_list(pre => [...pre, STYLE_NAME_BAR_VIEW]);
        } else {
            setBar_class_list(pre => pre.filter((cl) => cl != STYLE_NAME_BAR_VIEW));
        }
    }


    //------------------------------------------------
    // タブバー回転関数
    //------------------------------------------------
    function tab_bar_rotate(i){
        // 現在の角度を取得
        let angle_tmp = angle.current;

        // 角度オフセットを取得
        let angle_offset = (360/tab_num) * -i;

        // 現在の回転数を取得
        let k = parseInt(angle_tmp / 360);

        // 3つの移動先角度を定義
        let up_angle = (k+1)*360 + angle_offset - angle_tmp;
        let nor_angle = k*360 + angle_offset - angle_tmp;
        let down_angle = (k-1)*360 + angle_offset - angle_tmp; 

        // 3つの移動先角度から一番距離が短いものを選択
        if(Math.abs(up_angle) < Math.abs(nor_angle)){
            if(Math.abs(up_angle) < Math.abs(down_angle)){
                angle_tmp = up_angle + angle_tmp;
            } else if(Math.abs(nor_angle) < Math.abs(down_angle)){
                angle_tmp = nor_angle + angle_tmp;
            }
        } else {
            if(Math.abs(nor_angle) < Math.abs(down_angle)){
                angle_tmp = nor_angle + angle_tmp;
            } else {
                angle_tmp = down_angle + angle_tmp;
            }
        }

        // 変形時間と角度を更新
        tab_bar.current.style.setProperty('--td', 0.5);
        angle.current = angle_tmp;
        tab_bar.current.style.setProperty('--rotate-angle', angle_tmp + 'deg');
    }


    //------------------------------------------------
    // スクロールを回転に変える関数
    //------------------------------------------------
    function no_scroll_rotate(e){
        // スクロール終了検知用
        clearTimeout(timeout.current);

        // スクロール終了直後のスクロールは無効化
        if(scroll_end_flg_read.current){
            scroll_end_flg_read.current = false;
            return;
        };

        // スクロール終了イベント
        timeout.current = setTimeout(() => {
            scroll_oldX.current = SCROLL_LOC_BASE;
            scroll_oldY.current = SCROLL_LOC_BASE;
            scroll_end_flg_read.current = true;
            tab_bar.current.scrollTop = SCROLL_LOC_BASE;
            tab_bar.current.scrollLeft = SCROLL_LOC_BASE;
        }, 200)

        // スクロール量を取得
        const scrollTop = e.currentTarget.scrollTop;
        const scrollLeft = e.currentTarget.scrollLeft;

        // スクロール量から角度を計算
        let angle_tmp = angle.current - (scrollTop - scroll_oldY.current)/2 - (scrollLeft - scroll_oldX.current)/2;

        // スクロールの前回値を更新
        scroll_oldX.current = scrollLeft;
        scroll_oldY.current = scrollTop;

        // 変形時間と角度を更新
        tab_bar.current.style.setProperty('--td', 0);
        angle.current = angle_tmp;
        tab_bar.current.style.setProperty('--rotate-angle', angle_tmp + 'deg');
    }


    // 初回処理
    useEffect(() => {
        // タブバーのスクロール位置を基準に設定
        tab_bar.current.scrollTop = SCROLL_LOC_BASE;
        tab_bar.current.scrollLeft = SCROLL_LOC_BASE;
    }, [])

    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='circle_tab_block'>
            <div className={`circle_tab_bar ${bar_class_list.join(' ')}`} ref={tab_bar} tabIndex='-1'
                style={{'--tab-num': tab_num}}
                onClick={tab_bar_click_event}
                onScroll={no_scroll_rotate}>
                    <div className='circle_scroll'>
                        {tab_list}
                    </div>
                
                <div className='scroll_dummy'></div>
            </div>
            <div className='circle_tab_main_block'
                onClick={(e) => {
                    e.stopPropagation();
                    if(bar_class_list.includes(STYLE_NAME_BAR_VIEW)){
                        setBar_class_list(pre => pre.filter((cl) => cl != STYLE_NAME_BAR_VIEW));
                    }
                }}>
                {tab_main_list}
            </div>
        </div>
    )
}

export default Circle_tab