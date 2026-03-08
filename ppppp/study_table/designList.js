//================================================================
// デザインリスト
//================================================================
//【タグ】
//   design-list
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
            *, *::before, *::after{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }
            
            :host{
                display: inline-block;
                width: 120px;
                height: 30px;
                border-radius: 6px;
                position: relative;
                --ac-color: rgb(37, 227, 231);
            }

            #wrap{
                display: inline-block;
                width: 100%;
                height: 100%;
                border-radius: inherit;
                position: relative;
                padding: 0;
                margin: 0;
                box-sizing: border-box;

                &:has(#list-block:popover-open) #picker{
                    transform: rotateX(180deg);
                }
            }

            #selecter{
                background-color: white;
                border: none;
                box-shadow: 2px 2px 6px #88888888;
                border-radius: inherit;
                color: #444444;
                font-weight: bold;
                padding-inline: 10px;
                

                width: 100%;
                height: 100%;
                cursor: pointer;
                user-select: none;

                &:focus-visible, &:hover{
                    outline: 2px solid var(--ac-color);
                }
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
                --color: #5fafe1;
                position: absolute;
                top: 50%;
                right: 0px;
                translate: -50% -50%;
                width: 10px;
                height: 10px;
                
                &::before{
                    content: "";
                    position: absolute;
                    top: 40%;
                    left: 0px;
                    rotate: 40deg;
                    height: 2.5px;
                    border-radius: 5px;
                    width: 6.5px;
                    background-color: #444444;
                }

                &::after{
                    content: "";
                    position: absolute;
                    top: 40%;
                    right: 0px;
                    rotate: -40deg;
                    height: 2.5px;
                    border-radius: 5px;
                    width: 6.5px;
                    background-color: #444444;
                }
            }
            
            #list-block{
                /* 調整要素 */
                width: 100%;
                max-height: 120px;
                border: none;
                border-radius: inherit;
                margin-block: 4px;
                background-color: white;
                box-shadow: 2px 2px 6px #88888888;
                scrollbar-width: none;

                position: absolute;
                position-try: flip-block;
                position-area: bottom center;
                flex-direction: column;
                align-items: center;
                justify-content: start;
                overflow-y: auto;

                &:popover-open{
                    display: flex;
                }

                & > button{
                    /* 調整要素 */
                    width: 100%;
                    height: 30px;
                    background-color: white;
                    border: none;
                    font-weight: bold;
                    color: #444444;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: inherit;


                    cursor: pointer;
                    position: relative;
                    flex-shrink: 0;
                    flex-grow: 0;
                    user-select: none;

                    &:hover, &:focus-visible{
                        outline: none;
                        background-color: color-mix(in srgb, #5fafe1 50%, transparent) !important;
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
                if(oldValue != newValue){
                    this.update_view();
                }
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
    #init_flg = false;

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
            this.setAttribute("value", -1);
        }
        const shadow = this.shadowRoot;
        const slot = shadow.querySelector("slot");
        slot.addEventListener("slotchange", () => {
            this.#init_flg = false;
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
                this.#init_flg = true;
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

        selecter.addEventListener("click", (e) => {
            setTimeout(() => {
                if(list_block.matches(':popover-open')){
                    this.#option_list[this.#index].focus();
                }
            }, 1)
        })

    }

    // 表示更新
    update_view() {
        const shadow = this.shadowRoot;
        shadow.getElementById("text").textContent = this.#value_list[this.getAttribute("value")] ?? "";
        
        if(this.#init_flg){
            this.dispatchEvent(new CustomEvent("change", {
                detail: { value: this.getAttribute("value") }
            }));
        }
    }

    // リストクローズ
    close_list(){
        const shadow = this.shadowRoot;
        shadow.getElementById("selecter").click();
        shadow.getElementById("selecter").focus();
    }

}

customElements.define("design-list", DesignList);