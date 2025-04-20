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

    // 選択中のセル番号
    const [cell_no, setCell_no] = useState(0);

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
        // セル番号を一つ進める
        let next_no = cell_no + 1;

        // 上限処理
        if(next_no >= cells.current.length){
            next_no = next_no - cells.current.length;
        }
        
        // スクロール
        scroll_cell_block(next_no);
    }


    //------------------------------------------------
    // 前のセルへ戻る関数
    //------------------------------------------------
    function to_back_cell(){
        // セル番号を一つ戻す
        let back_no = cell_no - 1;

        // 下限処理
        if(back_no < 0){
            back_no = cells.current.length + back_no;
        }
        
        // スクロール
        scroll_cell_block(back_no);
    }


    //------------------------------------------------
    // スクロール関数
    //------------------------------------------------
    function scroll_cell_block(no){
        // 指定のセルがない場合、何もしない
        if(!cells.current[no]){
            return;
        }

        // セルの中心座標(X軸)を取得
        let left = cells.current[no].offsetLeft + cells.current[no].getBoundingClientRect().width/2 - cell_block.current.getBoundingClientRect().width/2;

        // 指定のセルまでスクロール
        cell_block.current.scrollTo({
            top: 0,
            left: left,
            behavior : 'smooth'
        })
    }


    const timeout = useRef(null);

    //------------------------------------------------
    // スクロール終了イベント
    //------------------------------------------------
    function scrollend_event(){

        // スクロール終了検知用
        clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            // セルブロックの中心座標(X軸)を取得
            let center_point = cell_block.current.getBoundingClientRect().width / 2;

            // セル番号を更新
            for(let i = 0; i < cells.current.length; i++){
                let left_loc = cells.current[i].getBoundingClientRect().left - cell_block.current.getBoundingClientRect().left;
                let right_loc = left_loc + cells.current[i].getBoundingClientRect().width;
                
                if((left_loc <= center_point) && (right_loc >= center_point)){
                    if(cell_no != i){
                        setCell_no(i);
                    }
                    break;
                }
            }
        }, 300)
    }


    // セル番号が更新された時のみ実行
    useEffect(() => {
        // セル番号の真ん中を取得
        let center_no = Math.floor(cells.current.length/2);

        // 選択中のセル番号が真ん中に配置されるように要素を並び替え
        for(let i = 0; i < cells.current.length; i++){
            let tmp = i - cell_no + center_no;
            if(tmp < 0){
                tmp = cells.current.length + tmp;
            } else if(tmp > cells.current.length - 1){
                tmp = tmp - cells.current.length;
            }

            cells.current[i].style.order = tmp;
        }

        // 念のため選択中のセルまでスクロール
        let left = cells.current[cell_no].offsetLeft + cells.current[cell_no].getBoundingClientRect().width/2 - cell_block.current.getBoundingClientRect().width/2;

        cell_block.current.scrollTo({
            top: 0,
            left: left,
            behavior : 'instant'
        })
    }, [cell_no])


    
    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='infinity_cell_block'>
            <div className='infinity_cell' ref={cell_block}
                onScroll={scrollend_event}>
                {cell_list}
            </div>
            <button className='back_button'
                onClick={to_back_cell} ref={back_button}></button>
            <button className='next_button'
                onClick={to_next_cell} ref={next_button}></button>
        </div>
    )
}

export default Infinity_cell