//=============================================================================
// 定数定義
//=============================================================================


//=============================================================================
// ドキュメント要素
//=============================================================================
const $input = document.getElementById("input");
const $output = document.getElementById("output");

const $chk1 = document.getElementById("chk1");
const $indent = document.getElementById("indent");

const $b_clear = document.getElementById("b_clear");
const $b_ext = document.getElementById("b_ext");
const $b_copy = document.getElementById("b_copy");

const $view = document.getElementById("view");

const $input_type = document.getElementById("input_type");
const $output_type = document.getElementById("output_type");


//=============================================================================
// 変数定義
//=============================================================================
const TYPES = {
  JSON: 0,
  JSO: 1,
  CSV_T: 2,
  CSV_C: 3,
  HTML: 4
}

// この定数値は使用しない
const HTML_KEY = {
  no: null,
  tag: null,
  id: null,
  class: null,
  attr: null,
  parent: null,
}


//=============================================================================
// 関数定義
//=============================================================================

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 変換関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function conversion(){
    const input_value = $input.value;
    const head_flg = $chk1.checked;
    const indent_num = $indent.value;
    const before_type = Number($input_type.value);
    const after_type = Number($output_type.value);
    let tmp = null;
    let output_value = "";

    try{
      // 入力に応じた変換(JSOへ)
      switch(before_type){
        case TYPES.CSV_T:
          tmp = parseCSV2JSO(input_value, head_flg, "\t");
          break;
        case TYPES.CSV_C:
          tmp = parseCSV2JSO(input_value, head_flg, ",");
          break;
        case TYPES.JSON:
          tmp = JSON.parse(input_value);
          break;
        case TYPES.JSO:
          tmp = Function("return " + input_value)();
          console.log(tmp);
          break;
        case TYPES.HTML:
          tmp = parseHTML2JSO(input_value);
          break;
        default:
          break;
      }


      // 出力に応じた変換
      switch(after_type){
        case TYPES.CSV_T:
          output_value = parseJSO2CSV(tmp, "\t");
          break;
        case TYPES.CSV_C:
          output_value = parseJSO2CSV(tmp, ",");
          break;
        case TYPES.JSON:
          output_value = JSON.stringify(tmp, null, parseInt(indent_num));
          break;
        case TYPES.JSO:
          output_value = outputJSO(tmp, indent_num);
          break;
        case TYPES.HTML:
          output_value = parseJSO2HTML(tmp, indent_num);
          break;
        default:
          break;
      }
    } catch(e){
      err_view();
    }
    
    $output.textContent = output_value;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CSV → JSオブジェクト
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function parseCSV2JSO(tsv, head=true, sep="\t") {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < tsv.length; i++) {
    const char = tsv[i];
    const nextChar = tsv[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"'; // エスケープされたクォート
        i++; // 次のクォートをスキップ
      } else {
        inQuotes = !inQuotes; // クォートの開始/終了
      }
    } else if (char === sep && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // 最後の行が改行で終わっていない場合
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  // ヘッダーを使ってJSON化
  let headers = rows[0];
  let start_index = 1;

  if(!head){
    headers = [];
    for(let i = 0; i < rows[0].length; i++){
        headers.push("item" + (i + 1));
    }
    start_index = 0;
  }

  const data = rows.slice(start_index).map(row => {
    const obj = {};
    headers.forEach((key, i) => {
      obj[key] = row[i] || '';
    });
    return obj;
  });

  return data;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// HTML → JSオブジェクト
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function parseHTML2JSO(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    let counter = 1;
    const results = [];

    function walk(node, parentNo = 0) {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const currentNo = counter++;

        // ★ input の場合は type をタグ名に含める
        let tag = node.tagName.toLowerCase();
        if (tag === "input") {
        const type = node.getAttribute("type") || "";
        tag = type ? `input[type="${type}"]` : "input";
        }

        let attrs = "";
        for (const attr of node.attributes) {
          if(attr.name == "id" || attr.name == "class" || attr.name == "type"){
            continue;
          }
          if(attr.value){
            attrs += `${attr.name}="${attr.value}" `;
          } else {
            attrs += `${attr.name}`;
          }
        }

        results.push({
          no: currentNo,
          tag,
          id: node.id || "",
          class: node.className || "",
          attr: attrs,
          parent: parentNo
        });

        for (const child of node.children) {
        walk(child, currentNo);
        }
    }

    for (const child of doc.body.children) {
        walk(child, 0);
    }

    return results;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// フラット化
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function flatten(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      acc[path] = JSON.stringify(value);
    } else if (value !== null && typeof value === "object") {
      Object.assign(acc, flatten(value, path));
    } else {
      acc[path] = value;
    }

    return acc;
  }, {});
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// JSオブジェクト → CSV
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function parseJSO2CSV(data, sep=",") {
  const arr = Array.isArray(data) ? data : [data];
  const first = flatten(arr[0]);
  const headers = Object.keys(first);

  const lines = arr.map(item => {
    const flat = flatten(item);
    return headers
      .map(key => {
        const val = flat[key];
        if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
          return val;
        }

        return `${val}`;
      })
      .join(sep);
  });

  return [headers.join(sep), ...lines].join("\n");
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// JSオブジェクト → HTML
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function parseJSO2HTML(data, indent=2) {
  const map = new Map();
  const roots = [];

  for (const item of data) {

    const key = String(item.no);

    map.set(key, {
      ...item,
      no: key,
      parent: item.parent != null ? String(item.parent) : null,
      children: []
    });

  }

  for (const node of map.values()) {

    if (!node.parent || node.parent === "0") {
      roots.push(node);
      continue;
    }

    const parent = map.get(node.parent);
    if (parent) parent.children.push(node);

  }

  const space = n => " ".repeat(n);

  function parseTag(tag) {

    const match = tag.match(/^([a-zA-Z0-9]+)(\[(.+)\])?$/);

    return {
      tagName: match ? match[1] : tag,
      attrs: match && match[3] ? match[3] : ""
    };

  }

  function build(nodes, depth = 0) {

    return nodes.map(node => {

      let { tagName, attrs } = parseTag(node.tag);
      if(attrs){
        let tmp = attrs.split("=");
        attrs = `${tmp[0]}="${tmp[1]}"`;
      }

      let attttt = [];
      const attttts = node.attr.split(" ");
      for(const a of attttts){
        const as = a.split("=");
        if(!as[0]) continue;
        if(as[1]){
          attttt.push(`${as[0]}="${as[1]}"`);
        } else {
          attttt.push(`${as[0]}`);
        }
      }

      const attrList = [
        attrs,
        node.id ? `id="${node.id}"` : "",
        node.class ? `class="${node.class}"` : "",
        attttt ? attttt.join(" ") : ""
      ].filter(Boolean).join(" ");

      const open = attrList
        ? `<${tagName} ${attrList}>`
        : `<${tagName}>`;

      // inputは閉じタグなし
      if (tagName === "input") {
        return `${space(depth * indent)}${open}`;
      }

      if (node.children.length === 0) {
        return `${space(depth * indent)}${open}</${tagName}>`;
      }

      const children = build(node.children, depth + 1);

      return [
        `${space(depth * indent)}${open}`,
        children,
        `${space(depth * indent)}</${tagName}>`
      ].join("\n");

    }).join("\n");

  }

  return build(roots);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// JSオブジェクト出力関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function outputJSO(obj, indent = 2, level = 0) {
  const pad = " ".repeat(indent * level);
  const padInner = " ".repeat(indent * (level + 1));

  if (obj === null) return "null";
  if (typeof obj === "string") return JSON.stringify(obj);
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (typeof obj === "function") return obj.toString();
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    const items = obj
      .map(v => padInner + outputJSO(v, indent, level + 1))
      .join(",\n");
    return `[\n${items}\n${pad}]`;
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    const body = entries
      .map(([k, v]) => `${padInner}${k}: ${outputJSO(v, indent, level + 1)}`)
      .join(",\n");
    return `{\n${body}\n${pad}}`;
  }

  return "undefined";
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// インプットクリア関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function clear_input(){
    $input.value = "";
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// アウトプットコピー関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function copy_output(){
    const text = $output.textContent;

    $view.style.display = "none";
    $view.classList.remove("anime");
    void $view.offsetWidth;

    navigator.clipboard.writeText(text)
    .then(() => {
        $view.textContent = "コピーしました。";
    })
    .catch(err => {
        $view.textContent = "コピーに失敗しました。"
    });

    $view.classList.add("anime");
    $view.style.display = "block";
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// エラー発生時関数
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function err_view(){
    $view.style.display = "none";
    $view.classList.remove("anime");
    void $view.offsetWidth;

    $view.textContent = "入力を見直してください。"

    $view.classList.add("anime");
    $view.style.display = "block";
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 初期化処理
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function init(){
    $b_clear.addEventListener("click", clear_input);
    $b_ext.addEventListener("click", conversion);
    $b_copy.addEventListener("click", copy_output);

    $view.addEventListener("animationend", () => {
        $view.style.display = "none";
        $view.classList.remove("anime");
    })
}

//=============================================================================
// イベント設定
//=============================================================================
// document.onload = init;

init();
