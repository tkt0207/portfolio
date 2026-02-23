// canvasの描画コンテキストを取得
const canvas1 = document.querySelector("#canvas1");
const ctx1 = canvas1.getContext("2d");

// canvasの横幅、高さを設定
let c1_width = canvas1.clientWidth || 800; 
let c1_height = canvas1.clientHeight || 500;
canvas1.width = c1_width;
canvas1.height = c1_height;

// データ定義(汎用化するならこのデータの中身を変える)
let graph_mode = 0;
const data_types = ["土木", "電設", "工業"];
const line_colors = ["#d499e6", "#8fd3c7", "#6e6acf"];
let type_flg = [true, false, false];
const datas = [
  [3128456, 3659021, 3874512, 4427690, 4592033, 4981204, 4998732, 5218743, 2765938, 2156384, 1837421, 1349027],
  [1745931, 2216847, 1874519, 2569024, 3182076, 3093628, 3637291, 3720186, 3891735, 4029341, 785943, 958402],
  [2872301, 1129847, 547893, 2391205, 3012764, 2205983, 1762149, 683452, 938471, 2598312, 2981207, 974635],
];
const labels = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];


// 各種設定値
const paddingLeft = 80;
const paddingBottom = 40;
const paddingTop = 40;
const paddingRight = 40;
let chartWidth = c1_width - paddingLeft - paddingRight;
let chartHeight = c1_height - paddingTop - paddingBottom;
const min_stepX = 40;
const line_width = 1;
const line_cap = "butt";
const line_join = "round";
const tick_color = "#88888840";
const label_color = "#888888";
const bar_width = 30;
const circle_size = 0.8;
const point_radius = 3;
let maxValue = 0;
let stepY = 0;
let stepY_num = 0;
let stepX = 0;
let pointsX = [];
let bars = [];
let hoveredIndex = null;
const point_values = document.querySelectorAll(".point_value");
point_values.forEach((pv, i) => {
  pv.style.setProperty("--in-color", line_colors[i]);
})


graph_init();

//=========================
// グラフ初期処理
//=========================
function graph_init(){
    // スタイル設定
    ctx1.lineCap = line_cap;
    ctx1.lineJoin = line_join;
    // グラフセット
    graph_set();
    // グラフイベント設定
    graph_event_set();
}

//=========================
// グラフセット処理
//=========================
function graph_set(){
  // カーソル値リセット
  cursol_value_reset();
  // グラフ最大値(Y軸)更新
  if(graph_mode != 2){
    maxValue_update();
  }
  // グラフX軸ステップ更新
  stepX_update();
  // グラフ描画
  graph_view();
}

//=========================
// グラフイベント設定処理
//=========================
function graph_event_set(){
  /* 表示項目変更時 */
  const type_chks = document.querySelector("#select_type").querySelectorAll("input");
  type_chks.forEach((chk, i) => {
    chk.addEventListener("change", () => {
      type_flg[i] = chk.checked;
      graph_set();
    })
  })

  /* グラフタイプ変更時 */
  const graph_types = document.querySelector("#select_graph").querySelectorAll("input");
  graph_types.forEach((radio, i) => {
    radio.addEventListener("change", () => {
      if(radio.checked){
        graph_mode = i;
      }
      graph_set();
    })
  })

  /* グラフホバー時 */
  const point_cursol = document.querySelector("#point_cursol");
  canvas1.addEventListener("pointermove", (e) => {
    const rect = canvas1.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    hoveredIndex = null;

    if(graph_mode == 0){
      pointsX.forEach((x, i) => {
        const distance = mouseX - x;
        if (Math.abs(distance) <= stepX/2) {
          hoveredIndex = i;
        }
      });

      if(hoveredIndex != null){
        type_flg.forEach((flg, i) => {
          if(flg){
            point_values[i].innerHTML = `${datas[i][hoveredIndex].toLocaleString()}`;
          }
        })
        point_cursol.style.left = `${pointsX[hoveredIndex]}px`;
        point_cursol.style.display = "flex";
      } else {
        point_cursol.style.display = "none";
      }
    } else if(graph_mode == 1){
      if(!bars[0]) return;
      bars[0].forEach((b, i) => {
        const x1 = b.x-stepX/2 + b.w/2;
        const x2 = x1 + stepX;
        if (mouseX >= x1 && mouseX < x2) {
          hoveredIndex = i;
        }
      });

      if(hoveredIndex != null){
        type_flg.forEach((flg, i) => {
          if(flg){
            point_values[i].innerHTML = `${datas[i][hoveredIndex].toLocaleString()}`;
          }
        })
        point_cursol.style.left = `${bars[0][hoveredIndex].x + bars[0][hoveredIndex].w/2}px`;
        point_cursol.style.display = "flex";
      } else {
        point_cursol.style.display = "none";
      }
    }
  });

  /* グラフホバー解除時 */
  canvas1.addEventListener("pointerleave", () => {
    hoveredIndex = null;
    point_cursol.style.display = "none";
  });

  /* ウィンドウリサイズ時(固定値の場合は不要) */
  const canvas_graph = document.querySelector("#canvas_graph");
  window.addEventListener("resize", () => {
    c1_width = canvas_graph.getBoundingClientRect().width; 
    c1_height = 500;
    canvas1.style.width = "100%";
    canvas1.width = c1_width;
    canvas1.height = c1_height;
    chartWidth = c1_width - paddingLeft - paddingRight;
    chartHeight = c1_height - paddingTop - paddingBottom;
    graph_set();
  })

  // 専用イベント設定
  const tag_cavas = document.querySelector("#tag_cavas");
  tag_cavas.addEventListener("change", () => {
    if(tag_cavas.checked){
        setTimeout(() => {
            c1_width = canvas_graph.getBoundingClientRect().width; 
            c1_height = 500;
            canvas1.style.width = "100%";
            canvas1.width = c1_width;
            canvas1.height = c1_height;
            chartWidth = c1_width - paddingLeft - paddingRight;
            chartHeight = c1_height - paddingTop - paddingBottom;
            graph_set();
        }, 250);
    }
  })
  const list_tgl = document.querySelector("#list_tgl");
  list_tgl.addEventListener("change", () => {
    setTimeout(() => {
        c1_width = canvas_graph.getBoundingClientRect().width;
        c1_height = 500;
        canvas1.style.width = "100%";
        canvas1.width = c1_width;
        canvas1.height = c1_height;
        chartWidth = c1_width - paddingLeft - paddingRight;
        chartHeight = c1_height - paddingTop - paddingBottom;
        graph_set();
    }, 250);
  })
}




//=========================
// カーソル値リセット
//=========================
function cursol_value_reset(){
  point_values.forEach(pv => {
    pv.innerHTML = "";
  })
}

//=========================
// X軸ステップ数更新処理
//=========================
function stepX_update(){
  let step_num = labels.length - 1;

  if(graph_mode == 1){
    step_num = labels.length;
  }
  stepX = chartWidth / step_num;
  if(stepX < min_stepX){
    stepX = min_stepX;
    chartWidth = min_stepX * step_num;
    c1_width = chartWidth + paddingLeft + paddingRight;
    canvas1.width = c1_width;
    canvas1.style.width = `${c1_width}px`;
  }

  if(graph_mode == 2){
    stepX = min_stepX;
    canvas1.style.width = '100%';
    c1_width = canvas1.clientWidth;
    canvas1.width = c1_width;
    chartWidth = c1_width - paddingLeft - paddingRight
  }
}


//=========================
// 最大値更新処理
//=========================
function maxValue_update(){
  let target_datas = [];
  if(graph_mode == 0){
    type_flg.forEach((flg, i) => {
      if(flg){
        datas[i].forEach(data => {
          target_datas.push(data);
        })
      }
    })
  } else if(graph_mode == 1){
    type_flg.forEach((flg, i) => {
      if(flg){
        datas[i].forEach((data, k) => {
          if(target_datas[k]){
            target_datas[k] += data;
          } else {
            target_datas[k] = data;
          }
        })
      }
    })
  }
  maxValue = Math.max(...target_datas);

  // 10*Xの倍数にしたい場合
  stepY = Math.pow(10, Math.floor(Math.log10(maxValue)));
  stepY_num = Math.floor(maxValue/stepY) + 1;
  maxValue = stepY_num * stepY;
  if(stepY_num <= 2){
    stepY = stepY/10;
    stepY_num += 9;
    maxValue = stepY_num * stepY;
  }

  // きれいな数に丸める場合
  // const desiredSteps = 10;
  // const rawStep = maxValue / desiredSteps;
  // const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  // stepY = Math.ceil(rawStep / magnitude) * magnitude;
  // stepY_num = Math.ceil(maxValue / stepY);
  // maxValue = stepY_num * stepY;
}

//=========================
// X座標計算処理
//=========================
function getX(i) {
  return paddingLeft + stepX * i;
}

//=========================
// Y座標計算処理
//=========================
function getY(value) {
  return paddingTop + chartHeight - (value / maxValue) * chartHeight;
}

//=========================
// 主軸描画処理
//=========================
function draw_primary_axis(color, width){
  ctx1.beginPath();
  ctx1.strokeStyle = color;
  ctx1.lineWidth = width;

  // Y軸
  ctx1.moveTo(paddingLeft, paddingTop/2);
  ctx1.lineTo(paddingLeft, paddingTop + chartHeight);

  // X軸
  ctx1.lineTo(paddingLeft + chartWidth + paddingRight/2, paddingTop + chartHeight);

  ctx1.stroke();
}

//=========================
// Y軸目盛描画処理
//=========================
function draw_secondary_y_axis(color, width, steps, max, labels=[], l_color="#000"){
  ctx1.strokeStyle = color;
  ctx1.lineWidth = width;
  ctx1.fillStyle = l_color;
  ctx1.font = "12px sans-serif";
  ctx1.textAlign = "right";

  for (let i = 0; i <= steps; i++) {
    const value = (max / steps) * i;
    const y = getY(value);

    if(labels[i]){
      ctx1.fillText(labels[i], paddingLeft - 10, y);
    } else {
      ctx1.fillText(Math.round(value).toLocaleString(), paddingLeft - 10, y);
    }
    
    // 補助線
    if(i == 0) continue;
    ctx1.beginPath();
    ctx1.moveTo(paddingLeft, y);
    ctx1.lineTo(paddingLeft + chartWidth, y);
    ctx1.stroke();
  }
}

//=========================
// X軸目盛描画処理
//=========================
function draw_secondary_x_axis(color, width, steps, max, labels=[], l_color="#000"){
  ctx1.strokeStyle = color;
  ctx1.lineWidth = width;
  ctx1.fillStyle = l_color;
  ctx1.font = "12px sans-serif";
  ctx1.textAlign = "center";

  for (let i = 0; i <= steps; i++) {
    const value = (max / steps) * i;
    const x = getX(i);
    let lx = x;

    if(i != steps){
      if(graph_mode == 1){
        lx += stepX/2;
      }

      if(labels[i]){
        ctx1.fillText(labels[i], lx, paddingTop + chartHeight + 20);
      } else {
        ctx1.fillText(Math.round(value), lx, paddingTop + chartHeight + 20);
      }
    }
    
    // 補助線
    if(i == 0) continue;
    ctx1.beginPath();
    ctx1.moveTo(x, paddingTop);
    ctx1.lineTo(x, paddingTop + chartHeight);
    ctx1.stroke();
  }
}

//=========================
// 折れ線グラフ描画処理
//=========================
function draw_line_graph(color, width, datas, point_size=0, fill=false){
  // ポイントリセット
  pointsX = [];

  // パスを生成
  ctx1.beginPath();
  datas.forEach((value, i) => {
    const x = getX(i);
    const y = getY(value);

    if (i === 0) {
      ctx1.moveTo(x, y);
    } else {
      ctx1.lineTo(x, y);
    }
    pointsX.push(x);
  });

  // 線を描画
  ctx1.lineCap = line_cap;
  ctx1.lineJoin = line_join;
  ctx1.strokeStyle = color;
  ctx1.lineWidth = width;
  ctx1.stroke();

  // 塗りつぶし
  if(fill){
    const gradient = ctx1.createLinearGradient(0,paddingTop,0,paddingTop + chartHeight);
    gradient.addColorStop(0, `${color}80`);
    gradient.addColorStop(1, `${color}00`);
    ctx1.lineTo(getX(datas.length - 1), paddingTop + chartHeight);
    ctx1.lineTo(getX(0), paddingTop + chartHeight);
    ctx1.closePath();
    ctx1.fillStyle = gradient;
    ctx1.fill();
  }

  // 点追加
  if(point_size > 0){
    datas.forEach((value, i) => {
      const x = getX(i);
      const y = getY(value);

      ctx1.beginPath();
      ctx1.arc(x,y,point_size,0,360);
      ctx1.fillStyle = color;
      ctx1.fill();
    });
  }
}

//=========================
// 棒グラフ描画処理
//=========================
function draw_bar_graph(color, width, datas){
  // 棒追加
  bars.push([]);

  // 影の定義
  ctx1.shadowOffsetX = 0;
  ctx1.shadowOffsetY = 0;
  ctx1.shadowBlur = 6;
  ctx1.shadowColor = `${color}80`;

  datas.forEach((value, i) => {
    // 棒の位置決め
    const x = getX(i) + stepX/2 - width/2;
    const y = bars[bars.length-2] ? getY(value) - (chartHeight + paddingTop - bars[bars.length-2][i].y) : getY(value);
    const w = width;
    const h = chartHeight + paddingTop - getY(value);

    // 塗りつぶし
    const gradient = ctx1.createLinearGradient(x,y,x+w,y);
    gradient.addColorStop(0, `${color}df`);
    gradient.addColorStop(0.75, `${color}80`);
    gradient.addColorStop(1, `${color}df`);
    ctx1.fillStyle = gradient;
    ctx1.fillRect(x,y,w,h);

    // 枠線
    ctx1.lineCap = line_cap;
    ctx1.lineJoin = line_join;
    ctx1.strokeStyle = color;
    ctx1.lineWidth = 2;
    ctx1.strokeRect(x,y+1,w,h-2);

    bars[bars.length-1].push({x:x, y:y, w:w, h:h, value:value});
  });

  // 影の定義リセット
  ctx1.shadowOffsetX = 0;
  ctx1.shadowOffsetY = 0;
  ctx1.shadowBlur = 0;
  ctx1.shadowColor = 'transparent';
}

//=========================
// 円グラフ描画処理
//=========================
function draw_circle_graph(colors, datas, angle=0, size=0.8){
  const degToRad = deg => deg * (Math.PI / 180);
  const clearLineWidth = 20;
  const total = datas.reduce((t, v) => t + v, 0);
  let startAngle = degToRad(angle - 90);

  datas.forEach((data, i) => {
    // 角度,半径設定
    const ratio = data / total;
    const endAngle = startAngle + ratio * Math.PI * 2;
    const centerX = chartWidth/2 + paddingLeft;
    const centerY = chartHeight/2 + paddingTop;
    let radius = Math.min(chartWidth,chartHeight)/2 * size;
    let in_radius = radius/2;
    const radius_distance = radius - in_radius;
    const midRadius = (radius + in_radius)/2;
    if(datas.length == 1){
      radius -= clearLineWidth/2;
      in_radius += clearLineWidth/2;
    }

    // パス生成
    ctx1.beginPath();
    ctx1.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx1.arc(centerX, centerY, in_radius, endAngle, startAngle, true);
    ctx1.closePath();

    // 塗りつぶし
    const gradient = ctx1.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${colors[i]}ff`);
    gradient.addColorStop(1, `${colors[i]}ff`);
    ctx1.fillStyle = gradient;
    ctx1.fill();

    // 境界を追加
    if(datas.length != 1){
      ctx1.lineCap = line_cap;
      ctx1.lineJoin = line_join;
      ctx1.strokeStyle = colors[i];
      ctx1.lineWidth = clearLineWidth;
      ctx1.save();
      ctx1.globalCompositeOperation = "destination-out";
      ctx1.stroke();
      ctx1.restore();
    }

    // 繋げれるようなデザインに
    radius -= clearLineWidth;
    in_radius += clearLineWidth;
    ctx1.beginPath();
    ctx1.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx1.arc(centerX, centerY, in_radius, endAngle, startAngle, true);
    ctx1.closePath();
    ctx1.lineCap = line_cap;
    ctx1.lineJoin = line_join;
    ctx1.strokeStyle = colors[i];
    ctx1.lineWidth = clearLineWidth/2;
    ctx1.stroke();

    ctx1.font = "bold 24px sans-serif";
    ctx1.fillStyle = label_color;
    ctx1.textAlign = "center";
    ctx1.textBaseline = "middle";
    ctx1.fillText(total.toLocaleString(), centerX, centerY);


    // 項目の%値表示
    let midAngle = (startAngle + endAngle) / 2;
    if(datas.length == 1){
      midAngle = degToRad(45);
    }
    const lineStartX = centerX + Math.cos(midAngle) * midRadius;
    const lineStartY = centerY + Math.sin(midAngle) * midRadius;
    const offset = radius_distance/2;
    const lineMidX = centerX + Math.cos(midAngle) * (midRadius + offset);
    const lineMidY = centerY + Math.sin(midAngle) * (midRadius + offset);
    const horizontalLength = 20;
    const isRightSide = Math.cos(midAngle) >= 0;
    const lineEndX = lineMidX + (isRightSide ? horizontalLength : -horizontalLength);
    const lineEndY = lineMidY;

    ctx1.beginPath();
    ctx1.moveTo(lineStartX, lineStartY);
    ctx1.lineTo(lineMidX, lineMidY);
    ctx1.lineTo(lineEndX, lineEndY);
    ctx1.lineWidth = 2;
    ctx1.strokeStyle = label_color;
    ctx1.stroke();

    ctx1.font = "bold 16px sans-serif";
    ctx1.fillStyle = label_color;
    ctx1.textAlign = isRightSide ? "left" : "right";
    ctx1.textBaseline = "middle";

    const percent = (ratio * 100).toFixed(1);
    const lineXOffset = isRightSide ? 4 : -4;

    ctx1.fillText(`${percent}%`, lineEndX+lineXOffset, lineEndY);
    ctx1.fillText(`(${data.toLocaleString()})`, lineEndX+lineXOffset, lineEndY + 20);

    // 角度更新
    startAngle = endAngle;
  });
}

//=========================
// グラフ描画処理
//=========================
function graph_view(){
  ctx1.clearRect(0,0,c1_width,c1_height);

  if(graph_mode != 2){
    draw_primary_axis(tick_color, 2);
    draw_secondary_y_axis(tick_color, 1, stepY_num, maxValue, [], label_color);
    draw_secondary_x_axis("transparent", 0, labels.length, labels.length, labels, label_color);
  }
  if(graph_mode == 0){
    type_flg.forEach((flg, i) => {
      if(flg){
        draw_line_graph(line_colors[i], line_width, datas[i], point_radius, true);
      }
    });
  } else if(graph_mode == 1){
    bars = [];
    const type_num = type_flg.length-1;
    [...type_flg].reverse().forEach((flg, i) => {
      if(flg){
        draw_bar_graph(line_colors[type_num-i], bar_width, datas[type_num-i]);
      }
    });
  } else if(graph_mode == 2){
    let tmp_data = [];
    let tmp_colors = [];
    type_flg.forEach((flg, i) => {
      if(flg){
        tmp_data.push(datas[i].reduce((t, v) => t + v, 0));
        tmp_colors.push(line_colors[i]);
      }
    });
    draw_circle_graph(tmp_colors, tmp_data, 0, circle_size);
  }
}