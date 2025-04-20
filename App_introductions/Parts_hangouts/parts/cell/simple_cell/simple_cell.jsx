import { useRef, useEffect } from 'react'
import './simple_cell.css'

// ボタン隠しスタイル名
const STYLE_NAME_HIDDEN = 'simple_cell_button_hidden';

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
    )
];


//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.cells : セルの配列
// 
//========================================================================
function Simple_cell(props) {
    // 進むボタンへの参照
    const next_button = useRef();

    // 戻るボタンへの参照
    const back_button = useRef();

    // セルブロックへの参照
    const cell_block = useRef();

    // セルへの参照
    const cells = useRef([]);

    // 表示中のセル番号
    const cell_no = useRef(0);


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
    // 次のセルへ進む関数
    //------------------------------------------------
    function to_next_cell(){
        // 次のセルがある場合、セルを1つ進める
        if(cell_no.current + 1 <= cells.current.length - 1){
            scroll_cell_block(cell_no.current + 1);
        }
    }


    //------------------------------------------------
    // 前のセルへ戻る関数
    //------------------------------------------------
    function to_back_cell(){
        // 前のセルがある場合、セルを1つ戻す
        if(cell_no.current - 1 >= 0){
            scroll_cell_block(cell_no.current - 1);
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

        // スクロール位置を取得
        let left = cells.current[no].offsetLeft + cells.current[no].getBoundingClientRect().width/2 - cell_block.current.getBoundingClientRect().width/2;

        // セルブロックをスクロール
        cell_block.current.scrollTo({
            top: 0,
            left: left,
            behavior : 'smooth'
        })
    }


    //------------------------------------------------
    // セル番号更新時のイベント関数
    //------------------------------------------------
    function cell_no_update_event(){
        // 表示されているセルが最後の場合
        if(cell_no.current == cells.current.length - 1){
            // 進むボタンを非表示
            next_button.current.classList.add(STYLE_NAME_HIDDEN);
        } 
        
        // 表示されているセルが最後でない場合
        else {
            // 進むボタンを表示
            next_button.current.classList.remove(STYLE_NAME_HIDDEN);
        }

        // 表示されているセルが初めの場合
        if(cell_no.current == 0){
            // 戻るボタンを非表示
            back_button.current.classList.add(STYLE_NAME_HIDDEN);
        } 
        
        // 表示されているセルが初めでない場合
        else {
            // 戻るボタンを表示
            back_button.current.classList.remove(STYLE_NAME_HIDDEN);
        }
    }


    //------------------------------------------------
    // スクロールイベント
    //------------------------------------------------
    function scroll_event(){
        // セルブロックの中心を取得
        let center_point = cell_block.current.getBoundingClientRect().width / 2;

        // 中心に来たセルのセル番号に更新
        for(let i = 0; i < cells.current.length; i++){
            let left_loc = cells.current[i].getBoundingClientRect().left - cell_block.current.getBoundingClientRect().left;
            let right_loc = left_loc + cells.current[i].getBoundingClientRect().width;
            
            if((left_loc <= center_point) && (right_loc >= center_point)){
                if(cell_no.current != i){
                    cell_no.current = i;
                    cell_no_update_event();
                }
                break;
            }
        }
    }

    // 初回処理
    useEffect(() => {
        cell_no_update_event();
    }, [])


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='simple_cell_block'>
            <div className='simple_cell' ref={cell_block}
                onScroll={scroll_event}>
                {cell_list}
            </div>
            <button className='back_button'
                onClick={to_back_cell} ref={back_button}></button>
            <button className='next_button'
                onClick={to_next_cell} ref={next_button}></button>
        </div>
    )
}

export default Simple_cell