const MODE_NONE = 0;
const MODE_COMMENT = 1;
const MODE_STRING = 2;

const CN = {
    id: 'identifier',
    var: 'variable',
    com: 'comment',
    func: 'function',
    str: 'string',
    num: 'number',
    sys: 'system',
    dec: 'decided',
    none0: 'none0',
    none1: 'none1'
}

const DECIDED_LIST = [
    'function',
    'of',
    'true',
    'false',
]

const SYSTEM_LIST = [
    'return',
    'export',
    'import',
    'from',
    'if',
    'else',
    'while',
    'for',
    'continue',
    'break',
    'switch',
    'case'
]

const JS_SYMBOLS = /([\!\?\@\#\%\^\&\*\(\)\+\-\= \:\;\(\r)\(\n)\"\'\`\<\>\\\/\{\}\[\]\^\.\,])/;

export function classification(text){
  const result = [];
  const lines = text.split(/\r?\n/);
  let mode = MODE_NONE;
  let mode_pre = MODE_NONE;
  let part = 0;
  let str_unit= "";
  let str_update = false;

  function fix(class_name, flg=false){
    for(let i = result.length - 1; i >= 0; i--){
      const re = result[i];
      if(re.type == 1){
        re.class = class_name;
        if(flg){
          return;
        }
      } else if(re.word.includes("\n")){
        return;
      }
    }
  }

  lines.forEach(line => {
    const words = line.split(JS_SYMBOLS);
    words.forEach(word => {
      if(word == "") return;

      if(word == "*" && mode_pre == MODE_COMMENT){
        mode = MODE_COMMENT;
        mode_pre = MODE_NONE;
        part = 1;
      } else if(word == "/" && mode_pre == MODE_COMMENT){
        mode = -MODE_COMMENT;
        mode_pre = MODE_NONE;
        part = 1;
      }

      if(word == "/" && mode == MODE_NONE){
        mode_pre = MODE_COMMENT;
      } else if(word == "*" && mode == MODE_COMMENT){
        mode_pre = -MODE_COMMENT;
      } else if(word == "/" && mode_pre == -MODE_COMMENT){
        // 何もしない
      } else {
        mode_pre = MODE_NONE;
      }

      if(/['"`]/.test(word) && mode == MODE_NONE){
        str_unit = word;
        mode = MODE_STRING;
        str_update = true;
      }

      if(Math.abs(mode) == MODE_COMMENT){
        result.push({word:word, class:CN.com, type:0});
        if(part == 1){
          result[result.length-2].class = CN.com;
          part = 0;
        }
      } else if(mode == MODE_STRING){
        result.push({word:word, class:CN.str, type:0});
      } else {
        if(DECIDED_LIST.includes(word)){
          result.push({word:word, class:CN.dec, type:0});
          return;
        } else if(SYSTEM_LIST.includes(word)){
          result.push({word:word, class:CN.sys, type:0});
          return;
        }
        
        if(JS_SYMBOLS.test(word)){
          result.push({word:word, class:"", type:0});
          if(word.includes("(")){
            fix(CN.func, true);
          }
        } else {
          if( /^[0-9-]/.test(word)){
            result.push({word:word, class:CN.num, type:1});    
          } else {
            result.push({word:word, class:CN.var, type:1});  
          }
        } 
      }

      if(/['"`]/.test(word) && mode == MODE_STRING){
        if(str_unit == word && !str_update){
          str_unit = "";
          mode = MODE_NONE;
        }
      }

      str_update = false;

      if(word == "/" && mode_pre == -MODE_COMMENT){
        mode = MODE_NONE;
        mode_pre = MODE_NONE;
      }

    })
    result.push({word:"\n", class:CN.none0, type:0});
    if(mode == -MODE_COMMENT){
      mode = MODE_NONE;
      mode_pre = MODE_NONE;
    }
  })
  
  const ans = (arr) =>
    arr.reduce((acc, cur) => {
      if (acc.length === 0) {
        acc.push({ ...cur });
      } else {
        const last = acc[acc.length - 1];
        if (last.class === cur.class) {
          last.word += cur.word;
        } else {
          acc.push({ ...cur });
        }
      }
      return acc;
    }, 
  []);

  return ans(result);
}