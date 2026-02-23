//=============================================================================
// IMPORT
//=============================================================================
import * as html_code from './assets/js/html_code.js';
import * as css_code from './assets/js/css_code.js';
import * as js_code from './assets/js/js_code.js';
import * as php_code from './assets/js/php_code.js';

//=============================================================================
// ドキュメント要素
//=============================================================================
const $tags = document.querySelectorAll("input[name='tag'");
const $areas = document.querySelectorAll(".area");

const $html_pres = document.querySelectorAll(".pre_html");
const $css_pres = document.querySelectorAll(".pre_css");
const $js_pres = document.querySelectorAll(".pre_js");
const $php_pres = document.querySelectorAll(".pre_php");


//=============================================================================
// 定数定義
//=============================================================================
const HIDDEN_CLASS = "hidden";

//=============================================================================
// グローバル変数
//=============================================================================


//=============================================================================
// クラス定義
//=============================================================================


//=============================================================================
// 関数定義
//=============================================================================
// タグ切り替え処理
function set_tag_switch(){
    $tags.forEach(tag => {
        tag.addEventListener("change", () => {
            const target_id = `#${tag.value}`;

            $areas.forEach(area => {
                area.classList.add(HIDDEN_CLASS);
            })

            document.querySelector(target_id).classList.remove(HIDDEN_CLASS);
        })
        
        if(tag.checked){
            tag.dispatchEvent(new Event("change"));
        }
    })
}

// コード表示色付け処理
function set_pre(){
    $html_pres.forEach(pre => {
        const p = pre.querySelector("pre");
        if(!p){
            return;
        }
        const text = p.textContent;
        const list = html_code.classification(text);

        p.innerHTML = "";
        list.forEach(li => {
            const span = document.createElement("span");
            span.className = li.class;
            span.innerHTML = li.word.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
            p.appendChild(span);
        })
    })

    $css_pres.forEach(pre => {
        const p = pre.querySelector("pre");
        if(!p){
            return;
        }
        const text = p.textContent;
        const list = css_code.classification(text);

        p.innerHTML = "";
        list.forEach(li => {
            const span = document.createElement("span");
            span.className = li.class;
            span.innerHTML = li.word;
            p.appendChild(span);
        })
    })

    $js_pres.forEach(pre => {
        const p = pre.querySelector("pre");
        if(!p){
            return;
        }
        const text = p.textContent;
        const list = js_code.classification(text);

        p.innerHTML = "";
        list.forEach(li => {
            const span = document.createElement("span");
            span.className = li.class;
            span.innerHTML = li.word;
            p.appendChild(span);
        })
    })

    $php_pres.forEach(pre => {
        const p = pre.querySelector("pre");
        if(!p){
            return;
        }
        const text = p.textContent;
        const list = php_code.classification(text);

        p.innerHTML = "";
        list.forEach(li => {
            const span = document.createElement("span");
            span.className = li.class;
            span.innerHTML = li.word;
            p.appendChild(span);
        })
    })
}

// エディター文字入れ
function set_code(elem, code_html, code_css){
    const html_editer = elem.querySelector(".html_editer").querySelector("textarea");
    const css_editer = elem.querySelector(".css_editer").querySelector("textarea");

    html_editer.value = code_html;
    css_editer.value = code_css;

    html_editer.dispatchEvent(new Event("input"));
    css_editer.dispatchEvent(new Event("input"));
    css_editer.dispatchEvent(new Event("change"));
}


const fc_area = document.querySelector("#class_first-child");
const fot_area = document.querySelector("#class_first-of-type");
const lc_area = document.querySelector("#class_last-child");
const lot_area = document.querySelector("#class_last-of-type");
const nc_area = document.querySelector("#class_nth-child");
const not_area = document.querySelector("#class_nth-of-type");
const nlc_area = document.querySelector("#class_nth-last-child");
const nlot_area = document.querySelector("#class_nth-last-of-type");
const target_class = "class_child";
const c_size = 40;

set_move_event(fc_area);
set_move_event(fot_area);
set_move_event(lc_area);
set_move_event(lot_area);
set_move_event(nc_area);
set_move_event(not_area);
set_move_event(nlc_area);
set_move_event(nlot_area);

// 移動処理設定関数
function set_move_event(target_area){
    const targets = target_area.querySelectorAll(`.${target_class}`);
    targets.forEach(t => {
        set_move(t, target_area);
    })
}

//----------------------------------------------------------
// スクロール禁止関数
//----------------------------------------------------------
function stop_scroll(e){
    if(e.cancelable){
        e.preventDefault();
    }
}

function set_move(target, area){
  if(!area) return;
  if(!target) return;

  target.addEventListener("pointerdown", move_icon);
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
      const moving_cells = area.getElementsByClassName(target_class);
      
      // アイコンの位置とサイズを取得し、保持
      let location_map = [];
      for(const mc of moving_cells){
        //   location_map.push([mc.offsetLeft, mc.offsetTop, mc.getBoundingClientRect().width, mc.getBoundingClientRect().height]);
          location_map.push([mc.offsetLeft, mc.offsetTop, c_size, c_size]);
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
          area.appendChild(collision);
      }

      // 移動判定ブロックを取得
      const moving_cell_collisions = area.getElementsByClassName('moving_cell_collision');

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
                  area.insertBefore(target, moving_cells[index_change_target]);
              } else {
                  if(index_change_target >= moving_cells.length - 1){
                      area.appendChild(target);
                  } else {
                      area.insertBefore(target, moving_cells[index_change_target + 1]);
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
              // mc.style.width = 'unset';
              // mc.style.height = 'unset';
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
}


const am_targets = document.querySelectorAll(".class_mono");
const target_area_class = ".class_eh";

set_move_area_event(am_targets, target_area_class);

// 移動処理設定関数
function set_move_area_event(targets, target_area){
    targets.forEach(t => {
        set_move_area(t, target_area);
    })
}


function set_move_area(target, area_name){
  if(!area_name) return;
  if(!target) return;

  target.addEventListener("pointerdown", move_icon);
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

      let target_area = null; 

      // クリック位置を取得
      let clientY = e.clientY;
      let clientX = e.clientX;
      let offsetY = 0;
      let offsetX = 0;

      // クリックされたアイコンのコピーを作成
      let clone = target.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.zIndex = 100;
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
          if(elemBelow.closest(area_name)){
            target_area = elemBelow.closest(area_name);
          } else {
            target_area = null;
          }
      }


      //------------------------------------------
      // 終了関数
      //------------------------------------------
      function decide(e){
          // クリックされたアイコンの透明度を元に戻す
          target.style.opacity = 1;

          // クローンを削除する
          clone.remove();

          if(target_area){
            const set_top = e.clientY - target_area.getBoundingClientRect().top;
            const set_left = e.clientX - target_area.getBoundingClientRect().left;
            target_area.appendChild(target);
            target.style.top = `${set_top}px`;
            target.style.left = `${set_left}px`;
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
}


//=============================================
// 初期設定
//---------------------------------------------
// 引数: -
// 戻り値: -
//---------------------------------------------
// 説明：
//   初期設定
//=============================================
function init(){
    // タグ切り替え処理
    set_tag_switch();

    // コード表示色付け
    set_pre();

    // エディター文字入れ
    set_code($edit_flex, flex_html_text, flex_css_text);
    set_code($edit_grid, grid_html_text, grid_css_text);
    set_code($edit_custom, custom_html_text, custom_css_text);
}

// iframe内の要素とれる
const $edit_flex = document.querySelector("#area_flex").querySelector("iframe").contentDocument;
const $edit_grid = document.querySelector("#area_grid").querySelector("iframe").contentDocument;
const $edit_custom = document.querySelector("#area_custom").querySelector("iframe").contentDocument;

const flex_html_text = 
`<div class="parent">
    <div class="child">1</div>
    <div class="child">2</div>
    <div class="child">3</div>
    <div class="child">4</div>
</div>`;

const flex_css_text = 
`.parent{
    /* displayをflexに設定 */
    display: flex;

    /* 主軸の向きを設定 */
    flex-direction: row;

    /* 主軸に収まらないときに改行するかを設定 */
    flex-wrap: wrap;

    /* 主軸の配置方法を設定 */
    justify-content: center;

    /* 交差軸の配置方法を設定 */
    align-items: center;

    /* 要素間の余白を設定 */
    gap: 10px;
}

.child{
    /* 初期サイズ */
    flex-basis: 200px;

    /* 余白があるときの伸びる比率 */
    flex-grow: 1;

    /* 要素が収まらないときの縮む比率 */
    flex-shrink: 0;

    /* 配置順 */
    order: unset;

    border: 2px solid black;
}`;

const grid_html_text = 
`<div class="parent">
    <div class="child">1</div>
    <div class="child">2</div>
    <div class="child">3</div>
    <div class="child">4</div>
</div>`;

const grid_css_text = 
`.parent{
    /* displayをgridに設定 */
    display: grid;

    /* 列数と各幅を定義 */
    grid-template-columns: 40px 50px 60px;

    /* 行数と幅を定義 */
    grid-template-rows: 40px 50px 60px;

    /* セルに名前を割り当て */
    grid-template-areas:
       "a a a"
       "b b c"
       "b b d";

    /* 要素間の余白を設定 */
    gap: 10px;
}

.child{
    border: 2px solid black;
}
.child:nth-of-type(1){
    grid-area: a;
}
.child:nth-of-type(2){
    grid-area: b;
}
.child:nth-of-type(3){
    grid-area: c;
}
.child:nth-of-type(4){
    grid-area: d;
}`;

const custom_html_text = 
`<div class="sazae">
    <div class="tarao">たらこ</div>
</div>
<div class="katsuo">カツオ</div>
`;

const custom_css_text = 
`:root{
    --color-back: blue;
    --color-font: black;
}
.sazae{
    background-color: var(--color-back);
    --item-width: 200px;
    --color-font: white;
}
.tarao{
    border: 2px solid black;
    width: var(--item-width);
    color: var(--color-font);
}
.katsuo{
    border: 2px solid black;
    width: var(--item-width);
    color: var(--color-font);
}`;



//=============================================================================
// 実行
//=============================================================================
// DOMツリー構築後
// document.addEventListener('DOMContentLoaded', init);

// 全体読み込み完了後
window.addEventListener("load", init);

