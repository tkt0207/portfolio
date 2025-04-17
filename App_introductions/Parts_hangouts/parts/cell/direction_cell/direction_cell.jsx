import { useRef, useState, useEffect } from 'react'
import './direction_cell.css'

// ボタン隠しスタイル名
const STYLE_NAME_HIDDEN = 'direction_cell_button_hidden';

// 選択中のスタイル
const STYLE_NAME_SELECTED = 'direction_cell_selected';

// 標準リスト
const NORMAL_LIST = [
    (
        <div className='cell_simple' style={{'--no': 0}}></div>
    ),
    (
        <div className='cell_simple' style={{'--no': 1}}></div>
    ),
    (
        <div className='cell_simple' style={{'--no': 2}}></div>
    ),
    (
        <div className='cell_simple' style={{'--no': 3}}></div>
    ),
    (
        <div className='cell_simple' style={{'--no': 4}}></div>
    ),
    (
        <div className='cell_simple' style={{'--no': 5}}></div>
    ),
    (
        <div className='cell_simple' style={{'--no': 6}}></div>
    ),
    (
        <div className='cell_simple' style={{'--no': 7}}></div>
    ),
    (
        <div className='cell_simple' style={{'--no': 8}}></div>
    )
];

//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.cells : セルの配列
//    props.col_num : 列数
// 
//========================================================================
function Direction_cell(props) {
    // 右ボタン
    const next_button = useRef();

    // 左ボタン
    const back_button = useRef();

    // 上ボタン
    const to_top_button = useRef();

    // 下ボタン
    const to_bottom_button = useRef();

    // セルブロックへの参照
    const cell_block = useRef();

    // セルへの参照
    const cells = useRef([]);

    // 選択中のセル番号
    const [cell_no, setCell_no] = useState(0);

    // 列数
    const col_num = props.col_num ? props.col_num : 3;

    // セルのリスト
    const cell_list = props.cell_list ? 
        props.cell_list.map((cell, index) => (
            <div className='cell' key={index} ref={(el) => (cells.current[index] = el)}>
                {cell}
            </div>
        ))
        :
        NORMAL_LIST.map((cell, index) => (
            <div className='cell' key={index} ref={(el) => (cells.current[index] = el)}>
                {cell}
            </div>
        ));

    

    //------------------------------------------------
    // 右のセルへ移動関数
    //------------------------------------------------
    function to_next_cell(){
        // 選択中のセルが一番右でない場合
        if(Math.floor(cell_no / col_num) == Math.floor((cell_no + 1) / col_num)){
            if(cell_no + 1 <= cells.current.length - 1){
                // セルを右へ移動
                scroll_cell_block(cell_no + 1);
            }
        }
    }


    //------------------------------------------------
    // 左のセルへ移動関数
    //------------------------------------------------
    function to_back_cell(){
        // 選択中のセルが一番左でない場合
        if(Math.floor(cell_no / col_num) == Math.floor((cell_no - 1) / col_num)){
            if(cell_no - 1 >= 0){
                // セルを左へ移動
                scroll_cell_block(cell_no - 1);
            }
        }
    }


    //------------------------------------------------
    // 下のセルへ移動関数
    //------------------------------------------------
    function to_bottom_cell(){
        // 選択中のセルが一番下でない場合
        if(cell_no + col_num <= cells.current.length - 1){
            // セルを下へ移動
            scroll_cell_block(cell_no + col_num);
        }
    }


    //------------------------------------------------
    // 上のセルへ移動関数
    //------------------------------------------------
    function to_top_cell(){
        // 選択中のセルが一番上でない場合
        if(cell_no - col_num >= 0){
            // セルを上へ移動
            scroll_cell_block(cell_no - col_num);
        }
    }


    //------------------------------------------------
    // スクロール関数
    //------------------------------------------------
    function scroll_cell_block(no){
        // 指定のセルがない場合、何もしない
        if(!cells.current[no]){
            return;
        }

        // セルの中心座標を取得
        let left = cells.current[no].offsetLeft + cells.current[no].getBoundingClientRect().width/2 - cell_block.current.getBoundingClientRect().width/2;
        let top = cells.current[no].offsetTop + cells.current[no].getBoundingClientRect().height/2 - cell_block.current.getBoundingClientRect().height/2;

        // 指定のセルまでスクロール
        cell_block.current.scrollTo({
            top: top,
            left: left,
            behavior : 'smooth'
        })
    }


    //------------------------------------------------
    // スクロールイベント
    //------------------------------------------------
    function scroll_event(){
        // セルブロックの中心座標を取得
        let center_pointX = cell_block.current.getBoundingClientRect().width / 2;
        let center_pointY = cell_block.current.getBoundingClientRect().height / 2;

        // 中心に来たセルのセル番号に更新
        for(let i = 0; i < cells.current.length; i++){
            let left_loc = cells.current[i].getBoundingClientRect().left - cell_block.current.getBoundingClientRect().left;
            let right_loc = left_loc + cells.current[i].getBoundingClientRect().width;
            let top_loc = cells.current[i].getBoundingClientRect().top - cell_block.current.getBoundingClientRect().top;
            let bottom_loc = top_loc + cells.current[i].getBoundingClientRect().height;
            
            if((left_loc <= center_pointX) && (right_loc >= center_pointX)){
                if((top_loc <= center_pointY) && (bottom_loc >= center_pointY)){
                    if(cell_no != i){
                        setCell_no(i);
                    }
                    break;
                }
            }
        }
    }


    // セル番号が更新された時のみ実行
    useEffect(() => {
        // セルが一番右の場合、右ボタンを非表示
        if((cell_no == cells.current.length - 1) || (cell_no % col_num == col_num-1)){
            next_button.current.classList.add(STYLE_NAME_HIDDEN);
        } else {
            next_button.current.classList.remove(STYLE_NAME_HIDDEN);
        }

        // セルが一番左の場合、左ボタンを非表示
        if((cell_no == 0) || (cell_no % col_num == 0)){
            back_button.current.classList.add(STYLE_NAME_HIDDEN);
        } else {
            back_button.current.classList.remove(STYLE_NAME_HIDDEN);
        }

        // セルが一番下の場合、下ボタンを非表示
        if(cell_no + col_num > cells.current.length - 1){
            to_bottom_button.current.classList.add(STYLE_NAME_HIDDEN);
        } else {
            to_bottom_button.current.classList.remove(STYLE_NAME_HIDDEN);
        }

        // セルが一番上の場合、上ボタンを非表示
        if(cell_no - col_num < 0){
            to_top_button.current.classList.add(STYLE_NAME_HIDDEN);
        } else {
            to_top_button.current.classList.remove(STYLE_NAME_HIDDEN);
        }

        // 選択中のセルにスタイルを適用
        for(let i = 0; i < cells.current.length; i++){
            if(i == cell_no){
                cells.current[i].classList.add(STYLE_NAME_SELECTED);
            } else {
                cells.current[i].classList.remove(STYLE_NAME_SELECTED);
            }
        }

    }, [cell_no])


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='direction_cell_block'>
            <div className='direction_cell' ref={cell_block}
            style={{'--col-num': col_num}}
                onScroll={scroll_event}>
                {cell_list}
            </div>
            <button className='back_button'
                onClick={to_back_cell} ref={back_button}></button>
            <button className='next_button'
                onClick={to_next_cell} ref={next_button}></button>
            <button className='to_top_button'
                onClick={to_top_cell} ref={to_top_button}></button>
            <button className='to_bottom_button'
                onClick={to_bottom_cell} ref={to_bottom_button}></button>
        </div>
    )
}

export default Direction_cell