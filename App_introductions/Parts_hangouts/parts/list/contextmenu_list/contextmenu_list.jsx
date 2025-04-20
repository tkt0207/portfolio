import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid';
import './contextmenu_list.css'

// 隠しスタイル名
const STYLE_NAME_LIST_HIDDEN = 'contextmenu_list_hidden';

// 区切り線識別名
const LINE_TOP = 'top';
const LINE_BOTTOM = 'bottom';
const LINE_NONE = "none";

// 標準リスト
const NORMAL_LIST = [
    {
        label: 'Item0',
        click_func : () => alert('Item0を押しました'),
        line: LINE_NONE
    },
    {
        label: 'Item1',
        click_func : () => alert('Item1を押しました'),
        line: LINE_NONE
    },
    {
        label: 'Item2',
        click_func : () => alert('Item2を押しました'),
        line: LINE_TOP
    },
    {
        label: 'Item3',
        click_func : () => alert('Item3を押しました'),
        line: LINE_NONE
    }
]


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : リストのid
//    props.list : リストの選択肢
//      -> label : 選択肢のラベル
//      -> click_func : クリック時のイベント
//      -> line : 区切り線
// 
//========================================================================
function Contextmenu_list(props) {
    // リストのID
    const list_id = props.id ? props.id : nanoid();
    
    // リストへの参照
    const select_list = useRef();
    
    // リストの選択肢への参照
    const options = useRef([]);

    // フォーカス中のリスト番号
    const list_no = useRef(-1);
    
    // リストのクラスリスト
    const [list_class, setList_class] = useState([]);

    // リストの横幅
    const list_width = useRef(0);

    // リストの高さ
    const list_height = useRef(0);

    // リストの選択肢
    const list = props.list ? 
        props.list.map((li, index) => {
            const list_label = li.label ? li.label : 'Item' + String(index);
            const list_click_func = li.click_func ? li.click_func : null;
            const list_line = li.line ? li.line : LINE_NONE;

            return(
                <button key={nanoid()} ref={(el) => (options.current[index] = el)}
                    className={list_line == LINE_TOP ? 'line_top' : list_line == LINE_BOTTOM ? 'line_bottom' : ''}
                    onClick={(e) => {
                        e.stopPropagation();
                        list_click_func();
                        list_disappear();
                    }}
                    onFocus={option_focus}
                    onBlur={option_blur}
                    >{list_label}</button>
            )
        })
        :
        NORMAL_LIST.map((li, index) => (
            <button key={nanoid()} ref={(el) => (options.current[index] = el)}
                className={li.line == LINE_TOP ? 'line_top' : li.line == LINE_BOTTOM ? 'line_bottom' : ''}
                onClick={(e) => {
                    e.stopPropagation();
                    li.click_func();
                    list_disappear();
                }}
                onFocus={option_focus}
                onBlur={option_blur}
                >{li.label}</button>
        ));

    

    //------------------------------------------------
    // リスト非表示関数
    //------------------------------------------------
    function list_disappear(){
        // リストに隠しスタイルを適用
        if(!select_list.current.classList.contains(STYLE_NAME_LIST_HIDDEN)){
            setList_class(pre => [...pre, STYLE_NAME_LIST_HIDDEN]);
        }
    }


    //------------------------------------------------
    // リスト表示関数
    //------------------------------------------------
    function list_appear(){
        // リストから隠しスタイルを削除
        if(select_list.current.classList.contains(STYLE_NAME_LIST_HIDDEN)){
            list_no.current = 0;
            setList_class(pre => pre.filter((cl) => cl != STYLE_NAME_LIST_HIDDEN));
        }
    }


    //------------------------------------------------
    // オプションフォーカスイベント
    //------------------------------------------------
    function option_focus(e){
        // ターゲットを取得
        let target = e.currentTarget;

        // 選択番号の変数を定義
        let next_no = list_no.current;

        // ターゲットにキー押し込みイベントを追加
        target.onkeydown = (e) => {
            switch (e.key){
                // ↓が押されたときは、フォーカスを下に移動させる
                case 'ArrowDown':
                    e.preventDefault();
                    next_no = list_no.current + 1;
                    if(next_no <= options.current.length - 1){
                        options.current[next_no].focus();
                        list_no.current = next_no;
                    }
                    break;
                    
                // ↑が押されたときは、フォーカスを上に移動させる
                case 'ArrowUp':
                    e.preventDefault();
                    next_no = list_no.current - 1;
                    if(next_no >= 0){
                        options.current[next_no].focus();
                        list_no.current = next_no;
                    }
                    break;

                // Escapebが押されたときは、ピッカーを非表示にする
                case 'Escape':
                    e.preventDefault();
                    list_disappear();
                    break;

                // Tabが押されたときは何もしない
                case 'Tab':
                    e.preventDefault();
                    break;
            }
        }
    }


    //------------------------------------------------
    // オプションフォーカス解除イベント
    //------------------------------------------------
    function option_blur(e){
        // ターゲットを取得
        let target = e.currentTarget;

        // ターゲットのキー押し込みイベントを削除
        target.onkeydown = null;
    }


    // リストの表示状態(開閉状態)変更時
    useEffect(() => {
        if(list_no.current == -1) return;
        
        // ピッカーが表示されている場合、初めのリスト番号のオプションにフォーカス
        if(list_class.includes(STYLE_NAME_LIST_HIDDEN)){
            // 何もしない
        } else {
            options.current[0].focus();
        }
    }, [list_class]);


    // 初期設定
    useEffect(() => {
        // 選択リストの高さと横幅を取得
        list_width.current = select_list.current.getBoundingClientRect().width;
        list_height.current = select_list.current.getBoundingClientRect().height;

        // コンテキストメニュー表示イベントの設定(状況に合わせて変更すること)
        let target = select_list.current.closest('.content');
        target.style.cursor = 'pointer';
        target.oncontextmenu = (e) => {
            if(e.target != target){
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            let set_top = e.offsetY;
            let set_left = e.offsetX + 4;

            let area_width = target.getBoundingClientRect().width;
            let area_height = target.getBoundingClientRect().height;

            if(set_top + list_height.current > area_height){
                set_top = area_height - list_height.current;
            }

            if(set_left + list_width.current > area_width){
                set_left = set_left - 4 - list_width.current;
            }

            select_list.current.style.top = set_top + 'px';
            select_list.current.style.left = set_left + 'px';
            
            list_appear();
        }

        target.onclick = (e) => {
            if(select_list.current.contains(e.target)){
                return;
            }
            list_disappear();
        }

        return () => {
            target.oncontextmenu = null;
            target.onclick = null;
        }

    }, [])

    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className={`contextmenu_list ${list_class.join(' ')}`} id={list_id} ref={select_list}>
            {list}
        </div>
        
    )
}

export default Contextmenu_list