import {useRef} from 'react'
import './location_change.css'


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
//    props.name : ボタンに表示される文字
// 
//========================================================================
function Location_change(props) {
    // 位置変更エリアへの参照
    const area = useRef();


    //------------------------------------------------
    // アイコン移動処理
    //------------------------------------------------
    function move_icon(e){
        // 標準処理を無効化
        e.preventDefault();
        // タッチムーブイベントを無効化
        document.addEventListener( 'touchmove', stop_scroll, { passive: false } );

        // ターゲットを取得
        let target = e.currentTarget;

        // アイコン共を取得
        const moving_cells = area.current.getElementsByClassName('moving_cell');
        
        // アイコンの位置とサイズを取得し、保持
        let location_map = [];
        for(const mc of moving_cells){
            location_map.push([mc.offsetLeft, mc.offsetTop, mc.getBoundingClientRect().width, mc.getBoundingClientRect().height]);
        }

        // アイコンのポジションをabsoluteにし、取得した位置とサイズを設定
        // 移動用判定ブロックをアイコンと同じ場所に設置
        for(let i = 0; i < moving_cells.length; i++){
            moving_cells[i].style.position = 'absolute';
            moving_cells[i].style.left = location_map[i][0] + 'px';
            moving_cells[i].style.top = location_map[i][1] + 'px';
            moving_cells[i].style.width = location_map[i][2] + 'px';
            moving_cells[i].style.height = location_map[i][3] + 'px';
            moving_cells[i].style.transitionDuration = "0.5s";

            const collision = document.createElement('div');
            collision.style.left = location_map[i][0] + 'px';
            collision.style.top = location_map[i][1] + 'px';
            collision.style.width = location_map[i][2] + 'px';
            collision.style.height = location_map[i][3] + 'px';
            collision.classList.add('moving_cell_collision');
            area.current.appendChild(collision);
        }

        // 移動判定ブロックを取得
        const moving_cell_collisions = area.current.getElementsByClassName('moving_cell_collision');

        // クリック位置を取得
        let clientY = e.clientY;
        let clientX = e.clientX;
        let offsetY = clientY - target.getBoundingClientRect().top;
        let offsetX = clientX - target.getBoundingClientRect().left;

        // クリックされたアイコンのコピーを作成
        let clone = target.cloneNode(true);
        clone.style.position = "fixed";
        clone.style.width = target.getBoundingClientRect().width + 'px';
        clone.style.zIndex = 100;
        clone.style.transitionDuration = "0s";
        document.body.appendChild(clone);
        clone.style.left = clientX - offsetX + 'px';
        clone.style.top = clientY - offsetY + 'px';

        // クリックされたアイコンは透明にする
        target.style.opacity = 0;
        

        //------------------------------------------
        // 移動関数
        //------------------------------------------
        function move(e){
            // 位置情報を取得
            let in_clientY = e.clientY;
            let in_clientX = e.clientX;

            // アイコンのコピーの位置を移動
            clone.style.left = in_clientX - offsetX + 'px';
            clone.style.top = in_clientY - offsetY + 'px';

            // 移動判定ブロックの上にカーソルがあるかを確認
            clone.style.display = "none";
            let elemBelow = document.elementFromPoint(in_clientX, in_clientY);
            clone.style.display = "flex";

            // 移動判定ブロックの上にカーソルがある場合
            if(elemBelow.classList.contains('moving_cell_collision')){
                // クリックされたアイコンと、移動判定ブロックのそれぞれの番号を取得
                const index_target = Array.prototype.indexOf.call(moving_cells, target);
                const index_change_target = Array.prototype.indexOf.call(moving_cell_collisions, elemBelow);

                // クリックされたアイコンと移動判定ブロックの番号が同じ場合、何もしない
                if(index_target == index_change_target){
                    return;
                }

                // クリックされたアイコンと移動判定ブロックの位置にあるアイコンの位置を変更する
                if(index_target > index_change_target){
                    area.current.insertBefore(target, moving_cells[index_change_target]);
                } else {
                    if(index_change_target >= moving_cells.length - 1){
                        area.current.appendChild(target);
                    } else {
                        area.current.insertBefore(target, moving_cells[index_change_target + 1]);
                    }
                }

                // アイコン共に新しい位置情報をあげる
                for(let i = 0; i < moving_cells.length; i++){
                    moving_cells[i].style.left = location_map[i][0] + 'px';
                    moving_cells[i].style.top = location_map[i][1] + 'px';
                }
            }
        }


        //------------------------------------------
        // 終了関数
        //------------------------------------------
        function decide(){
            // クリックされたアイコンの透明度を元に戻す
            target.style.opacity = 1;

            // クローンを削除する
            clone.remove();

            // アイコン共を元の状態に戻す
            for(const mc of moving_cells){
                mc.style.position = 'relative';
                mc.style.left = 'unset';
                mc.style.top = 'unset';
                mc.style.width = 'unset';
                mc.style.height = 'unset';
                mc.style.transitionDuration = "0s";
            }

            // 移動判定ブロックを削除
            while(moving_cell_collisions[0]){
                moving_cell_collisions[0].remove();
            }

            // ドキュメントのイベントを削除
            document.removeEventListener( 'touchmove', stop_scroll, { passive: false } );
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', decide);
            document.removeEventListener('pointerleave', decide);
        }

        // ドキュメントにイベントを設定
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', decide);
        document.addEventListener('pointerleave', decide);
    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='location_change_area' ref={area}>
            <div className='moving_cell'
                onPointerDown={move_icon}>0</div>
            <div className='moving_cell'
                onPointerDown={move_icon}>1</div>
            <div className='moving_cell'
                onPointerDown={move_icon}>2</div>            
            <div className='moving_cell'
                onPointerDown={move_icon}>3</div>
            <div className='moving_cell'
                onPointerDown={move_icon}>4</div>
            <div className='moving_cell'
                onPointerDown={move_icon}>5</div>
            <div className='moving_cell'
                onPointerDown={move_icon}>6</div>
        </div>
    )
}

export default Location_change