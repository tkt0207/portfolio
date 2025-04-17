import { useRef, useState, useEffect } from 'react'
import './infinity_cell.css'

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
function Infinity_cell(props) {
    // 進むボタンへの参照
    const next_button = useRef();

    // 戻るボタンへの参照
    const back_button = useRef();

    // セルブロックへの参照
    const cell_block = useRef();

    // セルへの参照
    const cells = useRef([]);

    // セル数(複製前)
    const cell_num = props.cell_list ? props.cell_list.length : NORMAL_LIST.length;

    // 選択中のセル番号
    const [cell_no, setCell_no] = useState(cell_num);

    // タイムアウト処理への参照
    const timeout = useRef(null);

    // セルのリスト
    const cell_list = props.cell_list ? 
        props.cell_list.map((cell, index) => (
            <div className='cell' key={index} ref={(el) => (cells.current[index + cell_num] = el)}>
                {cell}
            </div>
        ))
        :
        NORMAL_LIST.map((cell, index) => (
            <div className='cell' key={index} ref={(el) => (cells.current[index + cell_num] = el)}>
                {cell}
            </div>
        ));
    
    const cell_list_before = props.cell_list  ? 
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

    const cell_list_after = props.cell_list ? 
        props.cell_list.map((cell, index) => (
            <div className='cell' key={index} ref={(el) => (cells.current[index + (cell_num*2)] = el)}>
                {cell}
            </div>
        ))
        :
        NORMAL_LIST.map((cell, index) => (
            <div className='cell' key={index} ref={(el) => (cells.current[index + (cell_num*2)] = el)}>
                {cell}
            </div>
        ));


    //------------------------------------------------
    // スクロール関数
    //------------------------------------------------
    function scroll_to(no=cell_no, behavior='smooth'){
        cell_block.current.scrollTo({
            left: cells.current[no].offsetLeft + cells.current[no].getBoundingClientRect().width/2 - cell_block.current.getBoundingClientRect().width/2,
            behavior: behavior
        })
    }


    //------------------------------------------------
    // 次のセルへ進む関数
    //------------------------------------------------
    function to_next_cell(){
        // セル番号を一つ進める
        let next_no = cell_no + 1;

        // 上限処理
        if(next_no > cells.current.length - 1){
            next_no = cells.current.length - 1;
        }

        // スクロール
        scroll_to(next_no);
    }


    //------------------------------------------------
    // 前のセルへ戻る関数
    //------------------------------------------------
    function to_back_cell(){
        // セル番号を一つ戻す
        let back_no = cell_no - 1;

        // 下限処理
        if(back_no < 0){
            back_no = 0;
        }

        // スクロール
        scroll_to(back_no);
    }


    //------------------------------------------------
    // スクロールイベント
    //------------------------------------------------
    function scroll_event(){

        // スクロール終了検知用
        clearTimeout(timeout.current);

        // スクロール終了イベント
        timeout.current = setTimeout(() => {
            scrollend_event();
        }, 200)

        // セルブロックの中心座標(X軸)を取得
        let center_point = cell_block.current.getBoundingClientRect().width / 2;

        // セル番号を更新
        for(let i = 0; i < cells.current.length; i++){
            let cell_width = cells.current[i].getBoundingClientRect().width;
            let cell_center = cells.current[i].getBoundingClientRect().left - cell_block.current.getBoundingClientRect().left + cell_width/2;
            
            if(Math.abs(cell_center - center_point) <= cell_width/2){
                if(cell_no != i){
                    setCell_no(i);
                }
                break;
            }
        }
    }


    //------------------------------------------------
    // スクロール終了イベント
    //------------------------------------------------
    function scrollend_event(){
        // スクロール位置を基準に戻す
        let fix_no = cell_no % cell_num + cell_num;
        setCell_no(fix_no);
        scroll_to(fix_no, 'instant');
    }


    // 初回処理
    useEffect(() => {
        scroll_to(cell_num, 'instant');
    }, [])

    
    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='infinity_cell_block'>
            <div className='infinity_cell' ref={cell_block}
                onScroll={scroll_event}>
                {cell_list_before}
                {cell_list}
                {cell_list_after}
            </div>
            <button className='back_button'
                onClick={to_back_cell} ref={back_button}></button>
            <button className='next_button'
                onClick={to_next_cell} ref={next_button}></button>
        </div>
    )
}

export default Infinity_cell