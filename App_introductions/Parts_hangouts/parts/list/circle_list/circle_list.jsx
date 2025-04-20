import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid';
import './circle_list.css'

// 隠しスタイル名
const STYLE_NAME_LIST_HIDDEN = 'circle_list_picker_hidden';

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
function Circle_list(props) {
    // リストの名前
    const list_name = props.name ? props.name : nanoid();

    // リストのID
    const list_id = props.id ? props.id : nanoid();

    // リストの始めの選択番号
    const default_no = props.default_no ? props.default_no : 0;

    // リストへの参照
    const select_list = useRef();

    // リストの選択肢への参照
    const options = useRef([]);

    // リスト開閉ボタンへの参照
    const list_button = useRef();

    // フォーカス中のリスト番号
    const list_no = useRef(-1);

    // 選択中のリスト番号
    const selected_list_no = useRef(default_no);

    // リストのクラスリスト
    const [list_class, setList_class] = useState([STYLE_NAME_LIST_HIDDEN]);

    // 選択肢の数
    const option_num = props.list ? props.list.length : NORMAL_LIST.length;

    // リストの選択肢
    const list = props.list ? 
        props.list.map((li, index) => {
            const list_label = li.label ? li.label : 'Item' + String(index);

            return(
                <button key={nanoid()} ref={(el) => (options.current[index] = el)}
                    style={{'--no': index, '--option-num':option_num}}
                    onClick={() => {
                        select_option(index);
                    }}
                    onFocus={option_focus}
                    onBlur={option_blur}
                    >{list_label}</button>
            )
        })
        :
        NORMAL_LIST.map((li, index) => (
            <button key={nanoid()} ref={(el) => (options.current[index] = el)}
            style={{'--no': index, '--option-num':option_num}}
                onClick={() => {
                    select_option(index);
                }}
                onFocus={option_focus}
                onBlur={option_blur}
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
        setList_class(pre => [...pre, STYLE_NAME_LIST_HIDDEN]);

        // ドキュメントのクリックイベントを削除
        document.removeEventListener('click', list_disappear);
    }

    //------------------------------------------------
    // リスト表示切り替え関数
    //------------------------------------------------
    function list_display_switch(e){
        // 標準処理を無効化
        e.preventDefault();
        // バブリングを無効化
        e.stopPropagation();

        // リストの開閉状況を切り替え
        if(list_class.includes(STYLE_NAME_LIST_HIDDEN)){
            list_no.current = selected_list_no.current;
            setList_class(pre => pre.filter((cl) => cl != STYLE_NAME_LIST_HIDDEN));
            document.addEventListener('click', list_disappear);
        } else {
            list_disappear();
        }
    }


    //------------------------------------------------
    // オプション選択イベント
    //------------------------------------------------
    function select_option(i){
        // 選択中のリスト番号と異なる場合のみ処理を実施
        if(i != selected_list_no.current){
            // ラベルを取得
            let label = options.current[i].textContent;

            // ラベルを適用
            list_button.current.textContent = label;

            // リストに反映
            select_list.current.selectedIndex = i;

            // 選択中のリスト番号を更新
            selected_list_no.current = i;

            // フォーカス中のリスト番号を更新
            list_no.current = i;
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
                // ↓が押されたときは、フォーカスを次のオプションに移動させる
                case 'ArrowDown':
                    e.preventDefault();
                    next_no = list_no.current + 1;
                    if(next_no <= options.current.length - 1){
                        options.current[next_no].focus();
                        list_no.current = next_no;
                    } else {
                        options.current[0].focus();
                        list_no.current = 0;
                    }
                    break;
                
                // ↓が押されたときは、フォーカスを前のオプションに移動させる    
                case 'ArrowUp':
                    e.preventDefault();
                    next_no = list_no.current - 1;
                    if(next_no >= 0){
                        options.current[next_no].focus();
                        list_no.current = next_no;
                    } else {
                        options.current[options.current.length - 1].focus();
                        list_no.current = options.current.length - 1;
                    }
                    break;

                // EscapeもしくはTabが押されたときは、ピッカーを非表示にする
                case 'Escape':
                case 'Tab':
                    e.preventDefault();
                    list_disappear();
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

        // ピッカーが非表示の場合、リスト開閉ボタンにフォーカス
        if(list_class.includes(STYLE_NAME_LIST_HIDDEN)){
            list_button.current.focus();
        } 
        
        // ピッカーが表示されている場合、選択中のリスト番号のオプションにフォーカス
        else {
            options.current[selected_list_no.current].focus();
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
        <div className='circle_list_block'>
            <select name={list_name} id={list_id} ref={select_list} className='circle_list'
                onChange={change_event}>
                {dummy_list}
            </select>

            <button className='circle_list_button' ref={list_button}
                onClick={list_display_switch}></button>
            <div className={`circle_list_picker ${list_class.join(' ')}`}>
                {list}
            </div>
        </div>
        
    )
}

export default Circle_list