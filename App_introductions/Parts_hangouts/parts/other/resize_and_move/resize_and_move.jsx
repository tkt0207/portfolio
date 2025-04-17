import { useRef } from 'react'
import './resize_and_move.css'

// 最小サイズ
const LOWER_SIZE = 40;

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
//    none
// 
//========================================================================
function Resize_and_move(props) {
    // エリアへの参照
    const area = useRef();

    // リサイズブロックへの参照
    const resize_block = useRef();

    
    //------------------------------------------------
    // リサイズブロック移動関数
    //------------------------------------------------
    function move_block_func(e){
        // 標準処理を無効化
        e.preventDefault();
        // タッチムーブイベントを無効化
        document.addEventListener( 'touchmove', stop_scroll, { passive: false } );
        
        // ターゲットを取得
        const target = resize_block.current;

        // クリック位置を取得
        let clientY = e.clientY;
        let clientX = e.clientX;

        // ターゲットの位置とサイズ情報を取得
        const top_base = target.offsetTop;
        const left_base = target.offsetLeft;
        const block_width = target.getBoundingClientRect().width;
        const block_height = target.getBoundingClientRect().height;

        // エリアのサイズを取得
        const area_width = area.current.getBoundingClientRect().width;
        const area_height = area.current.getBoundingClientRect().height;
        

        //------------------------------------------
        // 移動関数
        //------------------------------------------
        function move(e){
            // 移動量を取得
            let amountY = e.clientY - clientY + top_base;
            let amountX = e.clientX - clientX + left_base;

            // 上下限処理(Y軸)
            if(amountY < 0){
                amountY = 0;
            } else if(amountY > area_height - block_height){
                amountY = area_height - block_height;
            }

            // 上下限処理(X軸)
            if(amountX < 0){
                amountX = 0;
            } else if(amountX > area_width - block_width){
                amountX = area_width - block_width;
            }

            // ターゲットの位置情報を更新
            target.style.top = amountY + "px";
            target.style.left = amountX + "px";
        }


        //------------------------------------------
        // 終了関数
        //------------------------------------------
        function deside(){
            // タッチムーブイベントの無効化を解除
            document.removeEventListener( 'touchmove', stop_scroll, { passive: false } );

            // ドキュメントのイベントを削除
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', deside);
            document.removeEventListener('pointerleave', deside);
        }

        // ドキュメントにイベントを設定
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', deside);
        document.addEventListener('pointerleave', deside);
    }


    //------------------------------------------------
    // リサイズ関数
    //------------------------------------------------
    function resize_block_func(e) {
        // 標準処理を無効化
        e.preventDefault();

        // バブリングを無効化
        e.stopPropagation();

        // タッチムーブイベントを無効化
        document.addEventListener( 'touchmove', stop_scroll, { passive: false } );
    
        // ターゲットを取得
        let target = e.currentTarget;

        // ターゲットの変形可能方向を取得
        let direction = target.getAttribute('direction');
    
        // クリック位置を取得
        let clientX = e.clientX;
        let clientY = e.clientY;
    
        // リサイズブロックの位置とサイズ情報を取得
        const top_base = resize_block.current.offsetTop;
        const left_base = resize_block.current.offsetLeft;
        const block_width = resize_block.current.getBoundingClientRect().width;
        const block_height = resize_block.current.getBoundingClientRect().height;
    
        // エリアのサイズを取得
        const area_width = area.current.getBoundingClientRect().width;
        const area_height = area.current.getBoundingClientRect().height;
    

        //------------------------------------------
        // 移動関数
        //------------------------------------------
        function move(e){
            // 横軸に関連する要素の場合処理を実施
            if((direction.indexOf('l') != -1) || (direction.indexOf('r') != -1)){
                // 移動量を更新
                let amountX = e.clientX - clientX;
    
                // 設定する横幅を計算
                let set_width = 0;
                if(direction.indexOf('l') != -1){
                    set_width = block_width - amountX;
                } else {
                    set_width = block_width + amountX;
                }
                
                // 横幅の上下限処理
                if(set_width <= LOWER_SIZE){
                    set_width = LOWER_SIZE;
                } else {
                    if(direction.indexOf('l') != -1){
                        if(set_width > left_base + block_width){
                            set_width = left_base + block_width;
                        }
                    } else {
                        if(set_width > area_width - left_base){
                            set_width = area_width - left_base;
                        }
                    }
                }

                // 横位置と横幅を更新
                if(direction.indexOf('l') != -1){
                    resize_block.current.style.left = left_base - (set_width - block_width) + 'px'; 
                }

                resize_block.current.style.width = set_width + 'px';
            }

            // 縦軸に関連する要素の場合処理を実施
            if((direction.indexOf('t') != -1) || (direction.indexOf('b') != -1)){
                // 移動量を更新
                let amountY = e.clientY - clientY;
    
                // 設定する高さを計算
                let set_height = 0;
                if(direction.indexOf('t') != -1){
                    set_height = block_height - amountY;
                } else {
                    set_height = block_height + amountY;
                }
                
                // 高さの上下限処理
                if(set_height <= LOWER_SIZE){
                    set_height = LOWER_SIZE;
                } else {
                    if(direction.indexOf('t') != -1){
                        if(set_height > top_base + block_height){
                            set_height = top_base + block_height;
                        }
                    } else {
                        if(set_height > area_height - top_base){
                            set_height = area_height - top_base;
                        }
                    }
                }

                // 縦位置と高さを更新
                if(direction.indexOf('t') != -1){
                    resize_block.current.style.top = top_base - (set_height - block_height) + 'px'; 
                }

                resize_block.current.style.height = set_height + 'px';
            }
        }
    

        //------------------------------------------
        // 終了関数
        //------------------------------------------
        function decide(){
            // タッチムーブイベントの無効化を解除
            document.removeEventListener( 'touchmove', stop_scroll, { passive: false } );

            // ドキュメントのイベントを削除
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerleave", decide);
            document.removeEventListener("pointerup", decide);
        }
    
        // ドキュメントにイベントを設定
        document.addEventListener("pointermove", move);
        document.addEventListener("pointerleave", decide);
        document.addEventListener("pointerup", decide);
    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='resize_and_move_area' ref={area}>
            <div className='resize_and_move' ref={resize_block}
                onPointerDown={move_block_func}>
                <div direction='l' className='resize_left resize_line'
                    onPointerDown={resize_block_func}></div>
                <div direction='r' className='resize_right resize_line'
                    onPointerDown={resize_block_func}></div>
                <div direction='t' className='resize_top resize_line'
                    onPointerDown={resize_block_func}></div>
                <div direction='b' className='resize_bottom resize_line'
                    onPointerDown={resize_block_func}></div>
                <div direction='tl' className='resize_top_left resize_point'
                    onPointerDown={resize_block_func}></div>
                <div direction='bl' className='resize_bottom_left resize_point'
                    onPointerDown={resize_block_func}></div>
                <div direction='tr' className='resize_top_right resize_point'
                    onPointerDown={resize_block_func}></div>
                <div direction='br' className='resize_bottom_right resize_point'
                    onPointerDown={resize_block_func}></div>
            </div>
        </div>
    )
}

export default Resize_and_move