import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid';
import './bottom_sheet_list.css'

// 隠しスタイル名
const STYLE_NAME_LIST_HIDDEN = 'bottom_sheet_list_picker_hidden';

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
    }
]


//----------------------------------------------------------
// スクロール禁止関数
//----------------------------------------------------------
function stop_scroll(e){
    if(e.cancelable){
        e.preventDefault();
    }
}

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
function Bottom_sheet_list(props) {
    // リスト名前
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

    // リストピッカーへの参照
    const list_picker = useRef();

    // フォーカス中のリスト番号
    const [list_no, setList_no] = useState(-1);

    // 選択中のリスト番号
    const [selected_list_no, setSelected_list_no] = useState(default_no);

    // リストのクラスリスト
    const [list_class, setList_class] = useState([STYLE_NAME_LIST_HIDDEN]);

    // リストの選択肢
    const list = props.list ? 
        props.list.map((li, index) => {
            const list_label = li.label ? li.label : 'Item' + String(index);

            return(
                <button key={nanoid()} ref={(el) => (options.current[index] = el)}
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
    // リスト非表示判定関数
    //------------------------------------------------
    function list_disappear_judge(e){
        // クリックされたターゲットがリストピッカー外の場合、リストを非表示にする
        if(list_picker.current.contains(e.target)){
            // 何もしない
        } else {
            list_disappear();
        }
    }

    //------------------------------------------------
    // リスト非表示関数
    //------------------------------------------------
    function list_disappear(){
        // リストに隠しスタイルを適用
        setList_class(pre => [...pre, STYLE_NAME_LIST_HIDDEN]);

        // ドキュメントのクリックイベントを削除
        document.removeEventListener('click', list_disappear_judge);
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
            setList_no(selected_list_no);
            setList_class(pre => pre.filter((cl) => cl != STYLE_NAME_LIST_HIDDEN));
            document.addEventListener('click', list_disappear_judge);
        } else {
            list_disappear();
        }
    }


    //------------------------------------------------
    // オプション選択イベント
    //------------------------------------------------
    function select_option(i){
        // 選択中のリスト番号と異なる場合のみ処理を実施
        if(i != selected_list_no){
            // ラベルを取得
            let label = options.current[i].textContent;

            // ラベルを適用
            list_button.current.textContent = label;

            // リストに反映
            select_list.current.selectedIndex = i;

            // 選択中のリスト番号を更新
            setSelected_list_no(i);

            // フォーカス中のリスト番号を更新
            setList_no(i);
        }

        // リストを非表示
        list_disappear();
    }




    //------------------------------------------------
    // オプションフォーカスイベント
    //------------------------------------------------
    function option_focus(e){
        // ターゲットを取得
        let target = e.currentTarget;

        // ターゲットにキー押し込みイベントを追加
        target.onkeydown = (e) => {
            switch (e.key){
                // ↓が押されたときは、フォーカスを下に移動させる
                case 'ArrowDown':
                    e.preventDefault();
                    if(list_no + 1 <= options.current.length - 1){
                        options.current[list_no + 1].focus();
                        setList_no(pre => pre + 1);
                    }
                    break;
                
                // ↑が押されたときは、フォーカスを上に移動させる
                case 'ArrowUp':
                    e.preventDefault();
                    if(list_no - 1 >= 0){
                        options.current[list_no - 1].focus();
                        setList_no(pre => pre - 1);
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


    //------------------------------------------------
    // ポインターダウンイベント
    //------------------------------------------------
    function pointerdown_event(e){
        // 標準処理を無効化
        e.preventDefault();

        // タッチムーブイベントを無効化
        document.addEventListener( 'touchmove', stop_scroll, { passive: false } );

        // クリックのY位置を取得
        let clientY = e.clientY;

        // 移動量を初期化
        let amount = 0;

        // リストピッカーの移動時間を0秒に設定
        list_picker.current.style.transitionDuration = '0s';


        //------------------------------------------
        // 移動関数
        //------------------------------------------
        function move(e){
            // 標準処理を無効化
            e.preventDefault();

            // 移動量を更新
            amount = e.clientY - clientY;

            // 移動量が0より下(上へ移動)の場合は何もしない
            if(amount < 0){
                return;
            }

            // リストピッカーを下へ移動
            list_picker.current.style.transform = 'translateY(' + amount + 'px)';
        }


        //------------------------------------------
        // 終了関数
        //------------------------------------------
        function decide(){
            // タッチムーブイベントの無効化を解除
            document.removeEventListener( 'touchmove', stop_scroll, { passive: false } );
            
            // リストピッカーの移動時間を0.5秒に設定
            list_picker.current.style.transitionDuration = '0.5s';

            // 移動量がリストピッカーの高さの半分以上の場合、ピッカーを一番下まで移動させた後、非表示に設定
            if(amount >= list_picker.current.getBoundingClientRect().height/2){
                list_picker.current.style.transform = 'translateY(100%)';
                list_picker.current.ontransitionend = () => {
                    list_disappear();
                    list_picker.current.ontransitionend = null;
                    list_picker.current.ontransitioncancel = null;
                    list_picker.current.style.transform = 'translateY(0px)';
                }
                list_picker.current.ontransitioncancel = () => {
                    list_disappear();
                    list_picker.current.ontransitionend = null;
                    list_picker.current.ontransitioncancel = null;
                    list_picker.current.style.transform = 'translateY(0px)';
                }
                
            } 
            
            // 移動量がリストピッカーの高さの半分に満たない場合、元の位置に戻す
            else {
                list_picker.current.style.transform = 'translateY(0px)';
            }

            // ドキュメントに設定しているイベントを削除
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', decide);
            document.removeEventListener('pointerleave', decide);

        }

        // ドキュメントにイベントを設定
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', decide);
        document.addEventListener('pointerleave', decide);
    }



    // フォーカスされるリスト番号の変更時
    useEffect(() => {
        if(list_no == -1) return;

        // ピッカーが非表示の場合、リスト開閉ボタンにフォーカス
        if(list_class.includes(STYLE_NAME_LIST_HIDDEN)){
            list_button.current.focus();
        } 
        
        // ピッカーが表示されている場合、指定されたリスト番号のオプションにフォーカス
        else {
            options.current[list_no].focus();
        }
    }, [list_no]);


    // リストの表示状態(開閉状態)変更時
    useEffect(() => {
        if(list_no == -1) return;
        
        // ピッカーが非表示の場合、リスト開閉ボタンにフォーカス
        if(list_class.includes(STYLE_NAME_LIST_HIDDEN)){
            list_button.current.focus();
        } 
        
        // ピッカーが表示されている場合、選択中のリスト番号のオプションにフォーカス
        else {
            list_picker.current.style.transform = 'translateY(0px)';
            options.current[selected_list_no].focus();
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
        <div className='bottom_sheet_list_block'>
            <select name={list_name} id={list_id} ref={select_list} className='bottom_sheet_list'
                onChange={change_event}>
                {dummy_list}
            </select>

            <button className='bottom_sheet_list_button' ref={list_button}
                onClick={list_display_switch}></button>
            <div className={`bottom_sheet_list_picker ${list_class.join(' ')}`} ref={list_picker}
                onPointerDown={pointerdown_event}>
                <div>
                    {list}
                </div>
                
            </div>
        </div>
        
    )
}

export default Bottom_sheet_list