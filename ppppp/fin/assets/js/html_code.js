const MODE_NONE = 0;
const MODE_COMMENT = 1;
const MODE_STRING = 2;
const MODE_IN_TAG = 3;

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


const HTML_SYMBOLS = /([\?\$\^\&\*\(\)\+\= \:\;\(\r)\(\n)\<\>\\\/\{\}\[\]\^\,\"\'\`\!\-])/;

export function classification(text){
  const result = [];
  const lines = text.split(/\r?\n/);
  let mode = MODE_NONE;
  let part = 0;
  let part2 = 0;
  let str_unit= "";
  let str_update = false;
  let tag_update = false;


  lines.forEach(line => {
    const words = line.split(HTML_SYMBOLS);
    words.forEach(word => {
      if(word == "") return;

      if(part == 3){
        mode = MODE_COMMENT;
      }

      if(/['"`]/.test(word) && mode == MODE_IN_TAG){
        str_unit = word;
        mode = MODE_STRING;
        str_update = true;
      }

      if(word == "<" && mode == MODE_NONE){
        mode = MODE_IN_TAG;
        tag_update = true;
      } else if(word == ">" && mode == MODE_IN_TAG){
        mode = MODE_NONE;
      }

      if(mode == MODE_COMMENT){
        result.push({word:word, class:CN.com, type:0});
        if(part == 3){
          result[result.length-2].class = CN.com;
          result[result.length-3].class = CN.com;
          result[result.length-4].class = CN.com;
          result[result.length-5].class = CN.com;
          part = 0;
        }
      } else if(mode == MODE_STRING){
        result.push({word:word, class:CN.str, type:0});
      } else if(mode == MODE_IN_TAG){
        if(HTML_SYMBOLS.test(word)){
          result.push({word:word, class:CN.none0, type:0});
          if(word == "!" && part == 0 && tag_update){
            tag_update = false;
            part = 1;
          } else if(word == "-" && part > 0){
            part += 1;
          } else if(tag_update && word == "/"){
            // 何もしない
          } else if(tag_update && word == "<"){
            // 何もしない
          } else {
            part = 0;
            tag_update = false;
          }
        } else {
          if(tag_update){
            tag_update = false;
            result.push({word:word, class:CN.dec, type:0});
          } else {
            result.push({word:word, class:CN.var, type:0});
          }
        }
      } else {
        result.push({word:word, class:CN.none0, type:0});
      }

      if(/['"`]/.test(word) && mode == MODE_STRING){
        if(str_unit == word && !str_update){
          str_unit = "";
          mode = MODE_IN_TAG;
        }
      }

      if(mode == MODE_COMMENT){
        if(word == "-"){
          part2 += 1;
        } else if(word == ">" && part2 >= 2){
          mode = MODE_NONE;
          part2 = 0;
        } else {
          part2 = 0;
        }
      }

      str_update = false;
    })
    result.push({word:"\n", class:CN.none0, type:0});
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