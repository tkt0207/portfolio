import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid';
import './dimention3_list.css'

// 隠しスタイル名
const STYLE_NAME_LIST_HIDDEN = 'dimention3_list_picker_hidden';

// リストの高さ
const LIST_HEIGHT = 150;

// オプションを1つ進めるスクロール量
const ONE_SCROLL_AMOUNT = 70;

// オプションの数の最大値
const MAX_OPTION_NUM = 20;


// 標準リスト
const NORMAL_LIST = [
    {
        value: 0,
        label: 'Item0',
    },
    {
        value: 1,
        label: 'Item1',
    },
    {
        value: 2,
        label: 'Item2',
    },
    {
        value: 3,
        label: 'Item3',
    },
    {
        value: 4,
        label: 'Item4',
    },
    {
        value: 5,
        label: 'Item5',
    },
    {
        value: 6,
        label: 'Item6',
    },
    {
        value: 7,
        label: 'Item7',
    },
    {
        value: 8,
        label: 'Item8',
    },
    {
        value: 9,
        label: 'Item9',
    }
]


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.name : リストの名前
//    props.id : リストのid
//    props.default_no : リストの初めの選択番号
//    props.list : リストの選択肢
//      -> value : 選択肢の値
//      -> label : 選択肢のラベル
// 
//========================================================================
function Dimention3_list(props) {
    // リストの名前
    const list_name = props.name ? props.name : nanoid();

    // リストのID
    const list_id = props.id ? props.id : nanoid();

    // リストの始めの選択番号
    const default_no = props.default_no ? props.default_no : 0;

    // リストへの参照
    const select_list = useRef();

    // 選択肢への参照
    const options = useRef([]);

    // リスト開閉ボタンへの参照
    const list_button = useRef();

    // フォーカス中のリスト番号
    const [list_no, setList_no] = useState(-1);

    // 選択中のリスト番号
    const [selected_list_no, setSelected_list_no] = useState(default_no);

    // リストのクラスリスト
    const [list_class, setList_class] = useState([STYLE_NAME_LIST_HIDDEN]);

    // リストブロックへの参照
    const list_block = useRef();

    // リスト共への参照
    const lists = useRef();

    // タイムアウト処理への参照
    const timeout = useRef(null);

    // 確定ボタンへの参照
    const ok_button = useRef();

    // キャンセルボタンへの参照
    const cancel_button = useRef();


    // リストの選択肢
    const list = props.list ? 
        props.list.map((li, index) => {
            const list_label = li.label ? li.label : 'Item' + String(index);

            return(
                <button key={nanoid()} ref={(el) => (options.current[index] = el)}
                    style={{'--num': index}}
                    onClick={() => {
                        select_option(index);
                    }}
                    >{list_label}</button>
            )
        })
        :
        NORMAL_LIST.map((li, index) => (
            <button key={nanoid()} ref={(el) => (options.current[index] = el)}
                style={{'--num': index}}
                onClick={() => {
                    select_option(index);
                }}
                >{li.label}</button>
        ));

    // リストの選択肢(ダミー)
    const dummy_list = props.list ? 
        props.list.map((li, index) => {
            const list_value = li.value ? li.value : index;

            return(
                <option value={list_value} key={nanoid()}></option>
            )
        })
        :
        NORMAL_LIST.map((li) => (
            <option value={li.value} key={nanoid()}></option>
        ));
    
    
    //------------------------------------------------
    // 変更イベント
    //------------------------------------------------
    function change_event(){
        // 好きな処理を記載
        
    }


    //------------------------------------------------
    // リスト非表示関数
    //------------------------------------------------
    function list_disappear(){
        // リストに隠しスタイルを適用
        if(!list_class.includes(STYLE_NAME_LIST_HIDDEN)){
            setList_class(pre => [...pre, STYLE_NAME_LIST_HIDDEN]);
        }
    }


    //------------------------------------------------
    // リスト表示関数
    //------------------------------------------------
    function list_appear(){
        // リストから隠しスタイルを削除
        if(list_class.includes(STYLE_NAME_LIST_HIDDEN)){
            setList_no(selected_list_no);
            setList_class(pre => pre.filter((cl) => cl != STYLE_NAME_LIST_HIDDEN));
        }
    }


    //------------------------------------------------
    // 指定のオプションまでスクロール関数
    //------------------------------------------------
    function scroll_options(no, behavior='smooth'){
        // 番号 * ダミーの高さ + リストの高さ + ダミーの高さ
        let scroll_loc = (no + 1) * ONE_SCROLL_AMOUNT + LIST_HEIGHT;

        // 指定のオプションまでスクロール
        list_block.current.scrollTo({
            top: scroll_loc,
            behavior: behavior
        });
    }


    //------------------------------------------------
    // オプション選択イベント
    //------------------------------------------------
    function select_option(i){
        // 選択されたオプションまでスクロール
        scroll_options(i, 'smooth');
    }


    //------------------------------------------------
    // リスト番号確定処理
    //------------------------------------------------
    function decide_list_no(){
        // 選択中のリスト番号を更新
        setSelected_list_no(list_no);

        // ラベルを取得
        let label = options.current[list_no].textContent;

        // ラベルを適用
        list_button.current.textContent = label;

        // リストに反映
        select_list.current.selectedIndex = list_no;

        // リストを非表示
        list_disappear();
    }


    //------------------------------------------------
    // スクロールイベント
    //------------------------------------------------
    function no_scroll_rotate(){
        // スクロール終了検知用
        clearTimeout(timeout.current);

        // スクロール終了イベント
        timeout.current = setTimeout(() => {
            scrollend_event();
        }, 200);

        // スクロール位置を取得
        let scrollY = list_block.current.scrollTop;

        // スクロール位置 - リストの高さ / ダミーの高さ - 1 * オプションが一つ進む角度
        let angle = ((scrollY - LIST_HEIGHT) / ONE_SCROLL_AMOUNT - 1) * 360 / MAX_OPTION_NUM;

        // リストを回転
        lists.current.style.transform = `rotateX(${angle}deg)`;
    }


    //------------------------------------------------
    // スクロール終了イベント
    //------------------------------------------------
    function scrollend_event(){
        let scrollY = list_block.current.scrollTop;

        let no = Math.round((scrollY - LIST_HEIGHT) / ONE_SCROLL_AMOUNT - 1);
        
        setList_no(no);
    }


    //------------------------------------------------
    // リストブロックフォーカスイベント
    //------------------------------------------------
    function list_block_focus(){
        // ターゲットを取得
        let target = list_block.current;

        // ターゲットにキー押し込みイベントを追加
        target.onkeydown = (e) => {
            switch (e.key){
                // ↓が押されたときは、下に移動させる
                case 'ArrowDown':
                    e.preventDefault();
                    target.scrollBy({
                        top: 70,
                        behavior: 'smooth'
                    })
                    break;
                    
                // ↑が押されたときは、上に移動させる
                case 'ArrowUp':
                    e.preventDefault();
                    target.scrollBy({
                        top: -70,
                        behavior: 'smooth'
                    })
                    break;

                // EscapeもしくはTabが押されたときは、キャンセルする
                case 'Escape':
                case 'Tab':
                    e.preventDefault();
                    cancel_button.current.click();
                    break;

                // EnterもしくはSpaceが押されたときは、確定させる
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    ok_button.current.click();
                    break;
            }
        }
    }


    //------------------------------------------------
    // リストブロックフォーカス解除イベント
    //------------------------------------------------
    function list_block_blur(){
        // ターゲットを取得
        let target = list_block.current;

        // ターゲットのキー押し込みイベントを削除
        target.onkeydown = null;
    }



    // リストの表示状態(開閉状態)変更時
    useEffect(() => {
        if(list_no == -1) return;

        // ピッカーが非表示の場合、リスト開閉ボタンにフォーカス
        if(list_class.includes(STYLE_NAME_LIST_HIDDEN)){
            list_button.current.focus();
        } 
        
        // ピッカーが表示されている場合、選択中のリスト番号のオプションにフォーカス
        else {
            list_block.current.focus();
            scroll_options(selected_list_no, 'instant');

        }
    }, [list_class]);


    // 初期設定
    useEffect(() => {
        // ラベルを取得
        let label = options.current[default_no].textContent;

        // ラベルを適用
        list_button.current.textContent = label;

        // リストに反映
        select_list.current.selectedIndex = default_no;
    }, [])

    
    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='dimention3_list_block'>
            <select name={list_name} id={list_id} ref={select_list} className='dimention3_list'
                onChange={change_event}>
                {dummy_list}
            </select>

            <button className='dimention3_list_button' ref={list_button}
                onClick={list_appear}></button>
            <div className={`dimention3_list_picker ${list_class.join(' ')}`}>
                <div className='dimentin3_list_selecter'>
                    <button className='select_cancel' ref={cancel_button}
                        onClick={list_disappear}>閉じる</button>
                    <button className='select_ok' ref={ok_button}
                        onClick={decide_list_no}>確定</button>
                </div>
                <div className='list_select_area'>
                    <div className='list_selecting_cover'></div>
                    <div className='list_select_block' ref={list_block}
                        style={{'--list-height': `${LIST_HEIGHT}px`}}
                        onScroll={no_scroll_rotate}
                        onFocus={list_block_focus}
                        onBlur={list_block_blur}>
                        <div className='lists' ref={lists}>
                            {list}
                        </div>
                        
                        {list.map((m, index) => (
                            <p className='scroll_dummy' key={index}
                                style={{'--dummy-height': `${ONE_SCROLL_AMOUNT}px`}}></p>
                        ))}
                        
                    </div>
                </div>
                
            </div>
        </div>
        
    )
}

export default Dimention3_list