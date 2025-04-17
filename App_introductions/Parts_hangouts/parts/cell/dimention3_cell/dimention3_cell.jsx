import { useRef, useState, useEffect } from 'react'
import './dimention3_cell.css'

// スクロール基準位置
const SCROLL_LOC_BASE = 10000;

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
function Dimention3_cell(props) {
    // 進むボタンへの参照
    const next_button = useRef();

    // 戻るボタンへの参照
    const back_button = useRef();

    // セルブロックへの参照
    const cell_block = useRef();

    // セルへの参照
    const cells = useRef([]);

    // セルエリアへの参照
    const cell_area = useRef();

    // 選択中のセル番号
    const [cell_no, setCell_no] = useState(0);

    // 回転角度
    const [angle, setAngle] = useState(0);

    // スクロール量の前回値
    const [scroll_old, setScroll_old] = useState(SCROLL_LOC_BASE);

    // セルの数
    const cell_num = props.cell_list ? props.cell_list.length : NORMAL_LIST.length;

    // タイムアウト関数への参照(PCのみでの動作の場合は不要)
    const timeout = useRef(null);

    // タイムアウト関数への参照(PCのみでの動作の場合は不要)
    const scroll_end_flg = useRef(false);

    // セルのリスト
    const cell_list = props.cell_list ? 
        props.cell_list.map((cell, index) => (
            <div className='cell' key={index} ref={(el) => (cells.current[index] = el)}
                style={{'--val': index}}>
                {cell}
            </div>
        ))
        :
        NORMAL_LIST.map((cell, index) => (
            <div className='cell' key={index} ref={(el) => (cells.current[index] = el)}
                style={{'--val': index}}>
                {cell}
            </div>
        ));

    

    //------------------------------------------------
    // 次のセルへ進む関数
    //------------------------------------------------
    function to_next_cell(){
        // 角度を一つのセル分下げる
        let angle_tmp = angle - 360/cell_num;
        cell_block.current.style.transform = "rotateY("+angle_tmp+"deg)";
        setAngle(angle_tmp);
    }


    //------------------------------------------------
    // 前のセルへ戻る関数
    //------------------------------------------------
    function to_back_cell(){
        // 角度を一つのセル分上げる
        let angle_tmp = angle + 360/cell_num;
        cell_block.current.style.transform = "rotateY("+angle_tmp+"deg)";
        setAngle(angle_tmp);
    }


    //------------------------------------------------
    // スクロールを回転に変える関数
    //------------------------------------------------
    function no_scroll_rotate(e){
        // スクロール終了検知用(PCのみでの動作の場合は不要)
        clearTimeout(timeout.current);

        // スクロール終了イベント内でのスクロールで実行されないようにするための処理(PCのみでの動作の場合は不要)
        if(scroll_end_flg.current){
            scroll_end_flg.current = false;
            return;
        }

        // スクロール終了イベント(PCのみでの動作の場合は不要)
        timeout.current = setTimeout(() => {
            setScroll_old(SCROLL_LOC_BASE);
            scroll_end_flg.current = true;
            scroll_end_event();
        }, 200);

        // スクロール量を取得
        const scrollLeft = cell_area.current.scrollLeft;

        // スクロール量から角度を計算
        let angle_tmp = angle - (scrollLeft - scroll_old)/2;

        // スクロール量の前回値を更新
        setScroll_old(scrollLeft);
 
        // 角度を更新
        cell_block.current.style.transitionDuration = "0s";
        cell_block.current.style.transform = "rotateY("+angle_tmp+"deg)";
        setAngle(angle_tmp);
    }


    //------------------------------------------------
    // スクロール終了イベント
    //------------------------------------------------
    function scroll_end_event(){
        // 止まる角度を計算
        let angle_tmp = angle;
        let tmp = (360/cell_num);
        let k = parseInt(angle_tmp / tmp);
        let d = angle_tmp % tmp;

        if(tmp/2 < d){
            k += 1;
        } else if(-tmp/2 > d){
            k -= 1;
        }

        angle_tmp = tmp * k;

        // 角度を更新
        cell_block.current.style.transitionDuration = "1s";
        cell_block.current.style.transform = "rotateY("+angle_tmp+"deg)";
        setAngle(angle_tmp);

        // スクロール位置を基準に戻す
        cell_area.current.scrollLeft = SCROLL_LOC_BASE;
    }


    // 回転角度が更新された時のみ実行
    useEffect(() => {
        let cell_no_tmp = Math.round((angle%360) / (360/cell_num));
        setCell_no(Math.abs(cell_no_tmp));
    }, [angle])


    // 初回実行
    useEffect(() => {
        // スクロール位置を基準に設定
        cell_area.current.scrollLeft = SCROLL_LOC_BASE;
    }, [])


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='dimention3_cell_area' ref={cell_area}
            onScroll={no_scroll_rotate}
            // onScrollEnd={scroll_end_event}　//(PCのみでの動作の場合は必要)
            >
            <div className='scroll_dummy'></div>
            <div className='dimention3_cell_block'>
                <div className='dimention3_cell' ref={cell_block}
                    style={{'--cell-num': cell_num}}>
                    {cell_list}
                </div>
                <button className='back_button'
                    onClick={to_back_cell} ref={back_button}></button>
                <button className='next_button'
                    onClick={to_next_cell} ref={next_button}></button>
            </div>
        </div>
    )
}

export default Dimention3_cell