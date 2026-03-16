//================================================================
// デザインリスト
//================================================================
//【タグ】
//   design-list
//
//【属性】
//  value: 初期値
//  min  : 最小値
//  max  : 最大値
//  step : ステップ数
//
//【プロパティ】
//  value: 現在値
//  min  : 最小値
//  max  : 最大値
//  step : ステップ数
//
//【説明】
//  デザイン可能なリスト
//================================================================
class DesignList extends HTMLElement{
    //---------------------------------------
    // コンストラクタ
    //---------------------------------------
    constructor(){
        super();

        // Shadow DOM定義
        const shadow = this.attachShadow({ mode: "open" });

        // スタイル設定
        const style = document.createElement("style");
        style.textContent = `
            :host{
                width: 140px;
                height: 24px;
                position: relative;
                border-radius: 4px;
                display: flex;
            }

            #wrap{
                display: flex;
                width: 100%;
                height: 100%;
                border-radius: inherit;
                position: relative;
                padding: 0;
                margin: 0;
                --rotate: 0deg;

                &:has(#list-block:popover-open){
                    --rotate: 180deg;
                }
            }

            #selecter{
                width: 100%;
                height: 100%;
                border-radius: 4px;
                padding: 0px;
                margin: 0px;
                outline: none;
                border: none;
                cursor: pointer;
                anchor-name: --selecter;
                position: relative;
            }
            
            #text{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                font-size: 0.8rem;
            }

            #picker{
                display: flex;
                position: absolute;
                height: 100%;
                aspect-ratio: 1/1;
                background-color: #333333;
                top: 0%;
                right: 0%;
                clip-path: polygon(50% 70%, 22% 30%, 78% 30%);
                transform: rotateX(var(--rotate));
            }
            
            #list-block{
                position-anchor: --selecter;
                width: 100%;
                max-height: 110px;
                overflow-x: hidden;
                overflow-y: auto;
                top: anchor(--selecter bottom);
                left: anchor(--selecter left);
                flex-direction: column;
                // scrollbar-width: thin;
                padding: 0px;
                margin: 0px;
                inset: unset;
                border: none;
                box-shadow: none;
                background: transparent;
                color: inherit;
                position: absolute;
                position-try: flip-block;
                // top: anchor(--selecter bottom);
                // left: anchor(--selecter left);
                // width: anchor-size(width);
                position-area: bottom center;
                border-radius: inherit;


                &:popover-open{
                    display: flex;
                    --rotate: 180deg;
                }

                & > button{
                    font-size: 0.8rem;
                    cursor: pointer;
                    height: 24px;
                    flex-shrink: 0;
                    border: none;

                    &:hover, &:focus-visible{
                        outline: none;
                    }
                }
            }

            slot{
                display: none;
            }
        `;
        shadow.appendChild(style);

        // 要素設定(<slot>で内部要素の入れる位置を決めれる)
        const template = document.createElement("template");
        const doms = `
            <div id="wrap" part="wrap">
                <button id="selecter", part="selecter" popovertarget="list-block">
                    <span id="text" part="text"></span>
                    <span id="picker" part="picker"></span>
                </button>
                <div id="list-block" part="list-block" popover>
                    <slot part="list"></slot>
                </div>
            </div>
        `;
        template.innerHTML = doms;
        shadow.appendChild(template.content.cloneNode(true));
    }

    //---------------------------------------
    // 属性定義
    //---------------------------------------
    static observedAttributes = ["value"];

    // 属性変更時の処理
    attributeChangedCallback(name, oldValue, newValue){
        switch(name){
            case "value":
                this.update_view();
                break;

            default:
                break;
        }
    }

    //---------------------------------------
    // プロパティ定義 (#xxx で内部変数作成可能)
    //---------------------------------------
    // value
    get value(){
        return this.getAttribute("value");
    }
    set value(v){
        this.setAttribute("value", v);
    }

    #value_list = [];
    #option_list = [];
    #index = 0;

    //---------------------------------------
    // DOM追加時の処理
    //--------------------------------------- 
    connectedCallback(){
        const shadow = this.shadowRoot;

        // 処理設定
        this.set_event();

        // 初期化
        this.init();

        // 初期表示
        this.update_view();
    }

    //---------------------------------------
    // 要素削除時の処理
    //---------------------------------------
    disconnectedCallback(){
    }

    //---------------------------------------
    // 要素移動時(Element.moveBefore())時の処理
    //---------------------------------------
    // ※この処理を定義していない場合、移動時にconnectedCallback, disconnectedCallbackが発火してしまう
    connectedMoveCallback(){
    }


    //---------------------------------------
    // 関数定義
    //---------------------------------------
    // 初期化
    init(){
        if(!this.getAttribute("value")){
            this.setAttribute("value", 0);
        }
        const shadow = this.shadowRoot;
        const slot = shadow.querySelector("slot");
        slot.addEventListener("slotchange", () => {
            this.#value_list = [];
            const options = slot.assignedElements(); 
            options.forEach(op => {
                const new_op = document.createElement("button");
                new_op.textContent = op.textContent;
                new_op.part = "list";
                if(op.value){
                    new_op.value = op.value;
                    this.#value_list[op.value] = op.textContent;
                }

                new_op.addEventListener("click", () => {
                    this.setAttribute("value", new_op.value ?? "");
                    this.close_list();
                })

                if(op.selected){
                    this.setAttribute("value", op.value);
                }

                this.#option_list.push(new_op);
                shadow.getElementById("list-block").appendChild(new_op);
            });
        })
    }

    // イベント設定
    set_event(){
        const shadow = this.shadowRoot;
        const selecter = shadow.getElementById("selecter");
        const list_block = shadow.getElementById("list-block");

        this.addEventListener("keydown", (e) => {
            const key = e.key;
            if(key === "ArrowUp" || key === "ArrowRight"){
                if(this.#index > 0){
                    this.#index -= 1;
                    this.#option_list[this.#index].focus();
                }
            } else if(key === "ArrowDown" || key === "ArrowLeft"){
                if(this.#index < this.#option_list.length - 1){
                    this.#index += 1;
                    this.#option_list[this.#index].focus();
                }
            }
        })

    }

    // 表示更新
    update_view() {
        const shadow = this.shadowRoot;
        shadow.getElementById("text").textContent = this.#value_list[this.getAttribute("value")] ?? "";
    }

    // リストクローズ
    close_list(){
        const shadow = this.shadowRoot;
        shadow.getElementById("selecter").click();
        this.dispatchEvent(new CustomEvent("change", {
            detail: { value: this.getAttribute("value") }
        }));
    }

}

customElements.define("design-list", DesignList);