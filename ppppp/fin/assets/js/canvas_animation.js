// canvasの描画コンテキストを取得
const canvas2 = document.querySelector("#canvas2");
const ctx2 = canvas2.getContext("2d");

// canvasの横幅、高さを設定
const c2_width = 1000; 
const c2_height = 400;
canvas2.width = c2_width;
canvas2.height = c2_height;

// canvasの描画コンテキストを取得
const canvas3 = document.querySelector("#canvas3");
const ctx3 = canvas3.getContext("2d");

// canvasの横幅、高さを設定
const c3_width = 120; 
const c3_height = 120;
canvas3.width = c3_width;
canvas3.height = c3_height;



// 定数値
const TWO_PI = Math.PI * 2;
const C2_LINE_WIDTH = 2;
const C2_LINE_CAP = "round";
const C2_LINE_JOIN = "round";
const PHASE_COLORS = ["#d499e6", "#8fd3c7", "#6e6acf"];
const SCALE_Y = 40;
let SCALE_X = 1/1000/1;
let SCALE_S = 1/60*0.005;

const TRI_COLOR = "#ff8080";
const MORTER_COLOR = "lightgray";
const MAGNET_COLORS = ["#e84e4e", "#4f4ff8"];


// 入力値
let morter_rpm = 1000;             /* モーター回転数 */
let morter_pole_pairs = 4;         /* モーター極数 */
let carrier_raito = 30;            /* キャリア同期数 */
let peak_current = 2.5 * SCALE_Y;  /* 電流ピーク値 */
let modulate_flg = false;          /* 変調フラグ */
let carrier_view_flg = false;      /* キャリア表示フラグ */
let switch_view_flg = false;       /* 表示切替スイッチ */

// 出力値
let peak_modulatio_current= peak_current / 6;                 /* 3次調波ピーク値 */
let electrode_num = morter_pole_pairs / 2 * 3;                /* 電極数 */
let electrical_freq = morter_rpm * morter_pole_pairs/2 / 60;  /* 電気周波数 */
let modulatio_electrical_freq = electrical_freq * 3;          /* 3次調波周波数 */
let carrier_freq = electrical_freq * carrier_raito/2;         /* キャリア周波数 */

// 変動値
let time = 0;                           /* 時間(s) */
let morter_angle = 0;                   /* モーター角度(rad) */
let electrical_anle = 0;                /* 電気角度(rad) */
let modulatio_electrical_anle = 0;      /* 三次調波角度(rad) */
let carrier_anle = 0;                   /* キャリア電気角度(rad) */
let phase_flg = [false, false, false];  /* 相フラグ */


// アニメーション
let raf = null;

// input要素
const ca_mr = document.querySelector("#ca_mr");
const ca_mp = document.querySelector("#ca_mp");
const ca_cr = document.querySelector("#ca_cr");
const ca_pc = document.querySelector("#ca_pc");
const ca_sx = document.querySelector("#ca_sx");
const ca_xx = document.querySelector("#ca_xx");
const ca_md = document.querySelector("#ca_md");
const ca_cv = document.querySelector("#ca_cv");
const ca_vs = document.querySelector("#ca_vs");
const ca_st = document.querySelector("#ca_st");

//==============================================================
// イベント設定処理
//==============================================================
function set_ca_event(){
  // モーター回転数
  ca_mr.addEventListener("change", (e) => {
    const val = e.currentTarget.value;
    morter_rpm = val;
    electrical_freq = morter_rpm * morter_pole_pairs/2 / 60;
    modulatio_electrical_freq = electrical_freq * 3;
    carrier_freq = electrical_freq * carrier_raito/2;
    draw_wave();
  })
  // モーター極数
  ca_mp.addEventListener("change", (e) => {
    const val = e.currentTarget.value;
    morter_pole_pairs = val;
    electrode_num = morter_pole_pairs/2 * 3;
    electrical_freq = morter_rpm * morter_pole_pairs/2 / 60;
    modulatio_electrical_freq = electrical_freq * 3;
    carrier_freq = electrical_freq * carrier_raito/2;
    draw_wave();
  })
  // キャリア同期数
  ca_cr.addEventListener("change", (e) => {
    const val = e.currentTarget.value;
    carrier_raito = val;
    carrier_freq = electrical_freq * carrier_raito/2;
    draw_wave();
  })
  // ピーク電圧
  ca_pc.addEventListener("change", (e) => {
    const val = e.currentTarget.value;
    peak_current = val * SCALE_Y;
    peak_modulatio_current= peak_current / 6;
    draw_wave();
  })
  // スピード倍率
  ca_sx.addEventListener("change", (e) => {
    const val = e.currentTarget.value;
    SCALE_S = 1/60 * val;
    draw_wave();
  })
  // 表示倍率(X)
  ca_xx.addEventListener("change", (e) => {
    const val = e.currentTarget.value;
    if(val==0){
      SCALE_X = 0;
      return;
    }
    SCALE_X = 1/1000/val;
    draw_wave();
  })
  // 3次高調波重畳
  ca_md.addEventListener("change", (e) => {
    const flg = e.currentTarget.checked;
    modulate_flg = flg;
    draw_wave();
  })
  // キャリア表示
  ca_cv.addEventListener("change", (e) => {
    const flg = e.currentTarget.checked;
    carrier_view_flg = flg;
    draw_wave();
  })
  // 表示切替
  ca_vs.addEventListener("change", (e) => {
    const flg = e.currentTarget.checked;
    switch_view_flg = flg;
    draw_wave();
  })
  // 再生/停止
  ca_st.addEventListener("change", (e) => {
    const flg = e.currentTarget.checked;
    if(flg){
      cancelAnimationFrame(raf);
      raf = null;
    } else {
      if(raf==null){
        raf = requestAnimationFrame(draw_wave_animation);
      }
    }
  })
  // 専用イベント設定
  const tag_cavas = document.querySelector("#tag_cavas");
  const tags = document.querySelectorAll(`[name="tag"]`);
  tags.forEach(t => {
    t.addEventListener("change", () => {
      if(!tag_cavas.checked){
        cancelAnimationFrame(raf);
        raf = null;
        ca_st.checked = true;
      }
    })
  })
}

//==============================================================
// sin波取得処理
//==============================================================
function get_sin_wave(t, amp, freq, pha){
  return Math.sin(t * freq*SCALE_X + pha) * amp;
}

//==============================================================
// 三角波取得処理
//==============================================================
function get_tri_wave(t, amp, freq, pha){
  return (2 * amp / Math.PI) * Math.asin(Math.sin(t * freq*SCALE_X + pha));
  // const theta = (t * freq*SCALE_X + pha);
  // const period = 2 * Math.PI;
  // const x = theta % period;
  // const nor = x / period
  // const y = (4 * amp * Math.abs(nor - 0.5)) + amp;
}

//==============================================================
// 3相波形描画処理
//==============================================================
function draw_phase_wave(color, phase, mod=false){
  const f_tmp = electrical_freq;
  const a_tmp = peak_current;
  const p_tmp = phase=="V" ? electrical_anle+degToRad(120) : phase=="W" ? electrical_anle+degToRad(240) : electrical_anle;

  ctx2.beginPath();
  for(let x = 0; x < c2_width; x++) {
      const y1 = get_sin_wave(x, a_tmp, f_tmp, p_tmp);
      const y2 = mod ? get_sin_wave(x, peak_modulatio_current, modulatio_electrical_freq, modulatio_electrical_anle) : 0;
      const y = c2_height / 2 - y1 - y2;
      if(x == 0) {
          ctx2.moveTo(x, y);
      } else {
          ctx2.lineTo(x, y);
      }
  }
  ctx2.strokeStyle = color;
  ctx2.stroke();
}

//==============================================================
// 三角波描画処理
//==============================================================
function draw_tri_wave(color){
  ctx2.beginPath();
  for(let x = 0; x < c2_width; x++) {
      const y = c2_height / 2 - get_tri_wave(x, peak_current,carrier_freq,carrier_angle);
      if(x == 0) {
          ctx2.moveTo(x, y);
      } else {
          ctx2.lineTo(x, y);
      }
  }
  ctx2.strokeStyle = color;
  ctx2.stroke();
}

//==============================================================
// PWM描画処理
//==============================================================
function draw_pwm_wave(color, phase, mod=false){
  const f_tmp = electrical_freq;
  const a_tmp = peak_current;
  const p_tmp = phase=="V" ? electrical_anle+degToRad(120) : phase=="W" ? electrical_anle+degToRad(240) : electrical_anle;
  const y_off = phase=="V" ? c2_height/3 : phase=="W" ? c2_height/3*2 : 0;

  ctx2.beginPath();
  for(let x = 0; x < c2_width; x++) {
      const normal = get_sin_wave(x, a_tmp, f_tmp, p_tmp);
      const modulate = mod ? get_sin_wave(x, peak_modulatio_current, modulatio_electrical_freq, modulatio_electrical_anle) : 0;
      const triangle = get_tri_wave(x, peak_current,carrier_freq,carrier_angle);
      const y_t = normal-modulate >= triangle ? peak_current : -peak_current;
      // const y = c2_height / 2 - y_t;
      const y = c2_height / 6 - y_t/3 + y_off;
      if(x == 0) {
          ctx2.moveTo(x, y);
      } else {
          ctx2.lineTo(x, y);
      }
  }
  ctx2.strokeStyle = color;
  ctx2.stroke();
}
//==============================================================
// 位相正規化処理
//==============================================================
function phase_fix(rad) {
  return ((rad % TWO_PI) + TWO_PI) % TWO_PI;
}

//==============================================================
// 角度正規化処理
//==============================================================
function angle_fix(deg) {
  return deg % 360;
}

//==============================================================
// 度→ラジアン変換処理
//==============================================================
function degToRad(deg){
  return deg * (Math.PI / 180);
}

//==============================================================
// モーター描画処理
//==============================================================
function draw_morter(){
  ctx3.clearRect(-c3_width/2,-c3_height/2,c3_width,c3_height);
  const size = c3_height * 0.8/2;

  // 枠を描画
  ctx3.beginPath();
  ctx3.arc(0,0,size,0,TWO_PI);
  ctx3.strokeStyle = MORTER_COLOR;
  ctx3.lineWidth = 6;
  ctx3.stroke();

  // 極を描画
  const pw = 8;
  const ph = 16;
  const al = 360/electrode_num;
  ctx3.save();
  ctx3.rotate(degToRad(al));
  for(let i = 0; i<electrode_num; i++){
    ctx3.rotate(-degToRad(al));
    ctx3.fillStyle = MORTER_COLOR;
    ctx3.fillRect(-pw/2,-size,pw,ph);
    ctx3.beginPath();
    ctx3.arc(0,0,size-ph,degToRad(360-(al/4)-90),degToRad(al/4-90));
    ctx3.lineWidth = 4;

    const rev_flg = Math.floor(i/3) % 2 == 1;
    if(phase_flg[i%3] != rev_flg){
      ctx3.strokeStyle = PHASE_COLORS[i%3];
      ctx3.lineWidth = 6;
      ctx3.shadowColor = PHASE_COLORS[i%3];
      ctx3.shadowBlur = 10;
    } else {
      ctx3.strokeStyle = MORTER_COLOR;
    }
    ctx3.stroke();
    ctx3.shadowColor = "transparent";
    ctx3.shadowBlur = 0;
  }
  ctx3.restore();

  // 磁石を描画
  ctx3.save();
  ctx3.rotate(morter_angle);
  ctx3.beginPath();
  ctx3.arc(0,0,size/2,0,TWO_PI);
  const gradient = ctx3.createConicGradient(0,0,0);
  for(let i = 0; i<morter_pole_pairs; i++){
    const per = i*1/morter_pole_pairs;
    gradient.addColorStop(per, MAGNET_COLORS[i%2]);
  }
  gradient.addColorStop(1, MAGNET_COLORS[0]);
  ctx3.fillStyle = gradient;
  ctx3.fill();

  ctx3.font = "bold 12px sans-serif";
  ctx3.fillStyle = "white";
  ctx3.textAlign = "center";
  ctx3.textBaseline = "middle";
  ctx3.fillText("M",0,0);

  ctx3.restore();
}


//==============================================================
// キャンバス初期設定
//==============================================================
function c23_init_set(){
  // 線のスタイル設定
  ctx2.lineWidth = C2_LINE_WIDTH;
  ctx2.lineCap = C2_LINE_CAP;
  ctx2.lineJoin = C2_LINE_JOIN;

  // 線のスタイル設定
  ctx3.lineWidth = C2_LINE_WIDTH;
  ctx3.lineCap = C2_LINE_CAP;
  ctx3.lineJoin = C2_LINE_JOIN;

  // 原点を中央へ移動
  const cx = c3_width/2;
  const cy = c3_height/2;
  ctx3.translate(cx,cy);

  // イベント設定
  set_ca_event();

  // アニメーション開始
  raf = requestAnimationFrame(draw_wave_animation);
}

//==============================================================
// 波アニメーション描画処理
//==============================================================
function draw_wave_animation() {
    time += SCALE_S;
    morter_angle = phase_fix(TWO_PI * time * morter_rpm/60);
    electrical_anle = phase_fix(TWO_PI * time * electrical_freq);
    modulatio_electrical_anle = phase_fix(TWO_PI * time * modulatio_electrical_freq);
    carrier_angle = phase_fix(TWO_PI * time * carrier_freq);

    draw_wave();
    raf = requestAnimationFrame(draw_wave_animation);
}


//==============================================================
// 波描画処理
//==============================================================
function draw_wave() {
    ctx2.clearRect(0, 0, c2_width, c2_height);
    if(!switch_view_flg){
      draw_phase_wave(PHASE_COLORS[0], "U", modulate_flg);
      draw_phase_wave(PHASE_COLORS[1], "V", modulate_flg);
      draw_phase_wave(PHASE_COLORS[2], "W", modulate_flg);
      if(carrier_view_flg){
        draw_tri_wave(TRI_COLOR);
      }
    } else {
      draw_pwm_wave(PHASE_COLORS[0], "U", modulate_flg);
      draw_pwm_wave(PHASE_COLORS[1], "V", modulate_flg);
      draw_pwm_wave(PHASE_COLORS[2], "W", modulate_flg);
    }

    for(let i = 0; i < 3; i++){
      const pha = i*120;
      const w_t1 = get_sin_wave(0,peak_current,electrical_freq,electrical_anle+degToRad(pha));
      const w_t2 = get_sin_wave(0,peak_modulatio_current,modulatio_electrical_freq,modulatio_electrical_anle);
      const w_t = modulate_flg ? w_t1-w_t2 : w_t1;
      const t_t = get_tri_wave(0,peak_current,carrier_freq,carrier_anle);
      const flg = w_t >= t_t;
      phase_flg[i] = flg;
    }
    draw_morter();
}

c23_init_set();