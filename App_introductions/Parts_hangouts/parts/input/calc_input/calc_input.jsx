import { useRef } from "react";
import { nanoid } from "nanoid";
import './calc_input.css'


//----------------------------------------------------------
// 入力制限関数
//----------------------------------------------------------
function input_restrict(dom){
    let target = dom;
    let val = target.value;
    let ans = '';

    // 数字の特定の符号以外は消す
    ans = val.replaceAll(/[^0123456789()+-/%.^\*]/g, '');

    // +/%^*(の後に続いていいのは数字と(-のみ
    ans = ans.replaceAll(/([+/%^(\*])[+/%^.)\*]+/g, '$1');

    // -の後に続いていいのは数字と(のみ
    ans = ans.replaceAll(/[-][+-/%^.)\*]+/g, '-');

    // .の後に続いていいのは数字のみ
    ans = ans.replaceAll(/[.][+-/%^.()\*]+/g, '.');

    // )の後に続いていいのは符号のみ .(は除く
    ans = ans.replaceAll(/[)][0123456789.(]+/g, ')');

    // 先頭に入力できるのは数値と(-のみ
    ans = ans.replaceAll(/^[+/%^.)\*]/g, '');

    // 同数値内で.は一つまで
    while(ans.match(/[0-9]+[\.][0-9]+[\.]/)){
        ans = ans.replaceAll(/([0-9]+[\.][0-9]+)[\.]/g, '$1');
    }

    // 値を更新
    target.value=ans;
}


//----------------------------------------------------------
// 正規化関数
//----------------------------------------------------------
function normalize(dom){
    const target = dom;
    const min = parseFloat(target.min);
    const max = parseFloat(target.max);
    const step = parseFloat(target.step);

    if(!target.value){
        target.value = min;
        return;
    }

    let value = parseFloat(target.value);

    let check_value = value * (1/step);
    let check_step = step * (1/step);

    if(value > max){
        value = max;
    } else if(value < min){
        value = min;
    } else if(check_value % check_step != 0){
        value -= value % step;
        value = Math.floor(value * (1/step)) / (1/step);
    }

    target.value = value;
}


//----------------------------------------------------------
// 通常計算関数
//----------------------------------------------------------
function calc_normal(num1, num2, operator){
    let ans = 0;

    // 符号に応じて引数の値を計算した結果を返す
    if(operator == '+'){
        ans = parseFloat(num1) + parseFloat(num2);
    } else if(operator == '-'){
        ans = parseFloat(num1) - parseFloat(num2);
    } else if(operator == '*'){
        ans = parseFloat(num1) * parseFloat(num2);
    } else if(operator == '/'){
        ans = parseFloat(num1) / parseFloat(num2);
    } else if(operator == '%'){
        ans = parseFloat(num1) % parseFloat(num2);
    } else if(operator == '^'){
        ans = parseFloat(num1) ** parseFloat(num2);
    }

    return ans;
}


//----------------------------------------------------------
// 計算関数(コールバック)
//----------------------------------------------------------
function call_back_calc(val){
    let val_array = [];
    let operator_array = [];
    let brackets_loc_array = [];
    let brackets_num = 0;
    let val_tmp = '';
    let operator_flg = true;


    for(const v of val){
        // (の場合
        if(v == '('){
            // ()内である場合
            if(brackets_num != 0){
                val_tmp += v;
            }

            // ()数をインクリメント
            brackets_num += 1;

            // 符号フラグをOFF
            operator_flg = false;
        } 
        
        // )の場合
        else if( v == ')'){
            // ()数をデクリメント
            brackets_num -= 1;

            // ()の外に出る場合
            if(brackets_num == 0){
                // 数値(一時)に数値が含まれていない場合
                if(val_tmp.search(/[0-9]/g) == -1){
                    // 数値(一時)をクリア
                    val_tmp = '';
                }
                
                // 数値が含まれている場合
                else {
                    // ()位置配列に数値配列のインデックスを保存
                    brackets_loc_array.push(val_array.length);
                }
                
            } 
            
            // ()内の場合
            else {
                // 数値(一時)に追加
                val_tmp += v;
            }

            // 符号フラグをOFF
            operator_flg = false;
            
        } 
        
        // 数値の場合
        else if( '0123456789.'.indexOf(v) != -1){
            // 数値(一時)に追加
            val_tmp += v;

            // 符号フラグをOFF
            operator_flg = false;
        } 
        
        // 符号の場合
        else{
            // ()外の場合
            if(brackets_num == 0){
                // 符号フラグがONかつ、符号が-の場合
                if( (v == '-') && operator_flg){
                    // 数値(一時)に追加
                    val_tmp += v;
                } 
                
                // 上記以外かつ、数値(一時)に数値が含まれている場合
                else if(val_tmp.search(/[0-9]/g) != -1){
                    // 数値配列に数値(一時)を追加
                    val_array.push(val_tmp);
                    // 数値(一時)をクリア
                    val_tmp = "";
                    // 符号配列に追加
                    operator_array.push(v);
                }
                
                // 符号フラグをON
                operator_flg = true;
            } 
            
            // ()内の場合
            else {
                // 数値(一時)に追加
                val_tmp += v;
            }
        }
    }

    // 最後の数値を格納
    if(val_tmp != ''){
        val_array.push(val_tmp);
    }

    // ()の数、再帰処理
    for(const brackets_loc of brackets_loc_array){
        val_array[brackets_loc] = call_back_calc(val_array[brackets_loc]);
    }


    // 計算の優先順位は右のようにする [^] > [*/%] > [+-]
    for(let i = 0; i < operator_array.length; i++){
        if(operator_array[i] == '^'){
            val_array[i] = calc_normal(val_array[i], val_array[i + 1], operator_array[i]);
            val_array.splice(i+1, 1);
            operator_array.splice(i, 1);
            i = i - 1;
        }
    }

    for(let i = 0; i < operator_array.length; i++){
        if((operator_array[i] == '*') || (operator_array[i] == '/') || (operator_array[i] == '%')){
            val_array[i] = calc_normal(val_array[i], val_array[i + 1], operator_array[i]);
            val_array.splice(i+1, 1);
            operator_array.splice(i, 1);
            i = i - 1;
        }
    }

    for(let i = 0; i < operator_array.length; i++){
        if((operator_array[i] == '+') || (operator_array[i] == '-')){
            val_array[i] = calc_normal(val_array[i], val_array[i + 1], operator_array[i]);
            val_array.splice(i+1, 1);
            operator_array.splice(i, 1);
            i = i - 1;
        }
    }

    // 計算結果を返す
    let ans = val_array[0];
    return ans;
}


//----------------------------------------------------------
// 計算関数
//----------------------------------------------------------
function calc_input_value(dom){
    let target = dom;
    let val = target.value;

    // 符号で終わっている場合、最後の符号を消す
    while('+-/%.^*'.indexOf(val[val.length-1]) != -1){
        val = val.slice(0, val.length-1);
    }

    // 数値がない場合は何もしない
    if(val.search(/[0-9]/g) == -1){
        return;
    }

    // ()の数を保持する変数を定義
    let open_brackets_num = 0;
    let close_brackets_num = 0;

    // (の数を取得
    if(val.match(/[(]/g)){
        open_brackets_num = val.match(/[(]/g).length;
    }

    // )の数を取得
    if(val.match(/[)]/g)){
        close_brackets_num = val.match(/[)]/g).length;
    }

    // (と)の数の差を取得
    let brackets_difference = open_brackets_num - close_brackets_num;

    // ()の数を揃える
    val = '('.repeat(Math.max(-brackets_difference, 0)) + val + ')'.repeat(Math.max(brackets_difference, 0));

    // 計算後に正規化を実施
    if(val){
        let ans = call_back_calc(val);
        target.value = ans;
        let view_formula = target.closest('div').children[0];
        view_formula.textContent = val + '=';
        view_formula.style.display = 'none';
        void view_formula.offsetWidth;
        view_formula.style.display = 'block';
        normalize(dom);
    }
}



//========================================================================
// コンポーネント
//========================================================================
// 【プロパティ】
//    props.id : インプットのid
//    props.min : スライダーの最小値
//    props.max : スライダーの最大値
//    props.step : スライダーのステップ値
// 
//========================================================================
function Calc_input(props) {
    // インプットへの参照
    const input = useRef();

    // インプットのID
    const input_id = props.id ? props.id : nanoid();


    //------------------------------------------------
    // インプットイベント
    //------------------------------------------------
    function input_event(){
        // 入力制限
        input_restrict(input.current);   
    }

    //------------------------------------------------
    // フィーカス解除イベント
    //------------------------------------------------
    function blur_event(){
        // 正規化
        calc_input_value(input.current);   
    }

    //------------------------------------------------
    // フォーカスイベント
    //------------------------------------------------
    function focus_event(e){
        // ターゲットを取得
        let target = e.currentTarget;

        // ターゲットにキー押し込みイベントを設定
        target.onkeydown = (e) =>{
            // Enterキーが押されたとき、フォーカスを解除し、キー押し込みイベントを削除
            if(e.key == 'Enter'){
                target.blur();
                target.onkeydown = null;
            }
        }
    }


    //------------------------------------------------
    // レンダリング
    //------------------------------------------------
    return(
        <div className='calc_input_block'>
            <span className="view_formula"
                onAnimationEnd={(e) => e.currentTarget.style.display='none'}></span>
            <span className="calc_input_outline">
                <input type='text' className='calc_input' id={input_id} ref={input}
                    min={props.min ? props.min : -Number.MAX_VALUE}
                    max={props.max ? props.max : Number.MAX_VALUE}
                    step={props.step ? props.step : 0.00000001}
                    onInput={input_event}
                    onBlur={blur_event}
                    onFocus={focus_event}
                    />
            </span>
        </div>

    )
}

export default Calc_input