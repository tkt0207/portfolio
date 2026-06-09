<?php
//=======================================================
// コンフィグ
//=======================================================
// セッションの有効時間(秒)
$SESSION_TIME = 30 * 60;

// Pythonの実行パス
$PYTHON_PATH = "C:\Users\qooli\AppData\Local\Programs\Python\Python310\python.exe";

// ホスト
$HOST = '127.0.0.1:3306';

// 文字コード
$CHARSET = 'utf8';

// データベース名
$db_name = '';

// ユーザー名
$db_user = "root";

// パスワード
$db_pass = "";

// ファイル保存先
$upload_dir = __DIR__ . "/assets/json/favorite/favorite_list.json";

//=======================================================
// 初期設定
//=======================================================
// json形式での受け取り
$json = file_get_contents('php://input');
// jsonデータをPHPオブジェクトに変換
$data = json_decode($json, true);

// 結果
$response = [
    'success' => false,
    'message' => "",
    'data' => []
];

// データがない場合
if(!$data){
    // エラーメッセージを格納
    $response['message'] = "データの受信に失敗しました。";
    
    // JSONとしてレスポンスを返す
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}


//=======================================================
// json更新
//=======================================================
if($data["type"] == "save"){
    // 値を書き換え
    $tmp = $data['data']['query'];

    // 保存パスを取得
    $path = $upload_dir;

    // JSON に戻して保存（整形したい場合は JSON_PRETTY_PRINT）
    $newJson = json_encode($tmp, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    // 上書き保存
    file_put_contents($path, $newJson);

    // ステータスを更新
    $response['success'] = true;
}

//=======================================================
// ログイン
//=======================================================
else if($data["type"] == "login"){
    // セッションの有効時間の設定
    ini_set('session.gc_maxlifetime', $SESSION_TIME);

    // クッキーの有効期限の設定
    session_set_cookie_params($SESSION_TIME);

    // セッション開始
    session_start();

    // セッション変数に値を格納
    $_SESSION['is_login'] = true;

    // ステータスを更新
    $response['success'] = true;
}


//=======================================================
// ログアウト
//=======================================================
else if($data["type"] == "logout"){
    // セッション開始
    session_start();

    // ログイン済みの場合、ログアウト
    if (isset($_SESSION['is_login']) && $_SESSION['is_login'] === true) {
        // セッション変数をすべて削除
        session_unset();

        // セッションを破棄
        session_destroy();
    }

    // ステータスを更新
    $response['success'] = true;
}


//=======================================================
// データベース読み込み
//=======================================================
else if($data['type'] == "db_read"){
    // データーベース名設定
    if(isset($data['data']['db_name'])){
        $db_name = $data['data']['db_name'];
    }

    // ユーザー名設定
    if(isset($data['data']['db_user'])){
        $db_user = $data['data']['db_user'];
    }

    // パスワード設定
    if(isset($data['data']['db_pass'])){
        $db_pass = $data['data']['db_pass'];
    }

    // DB接続
    $dsn = "mysql:dbname=$db_name;host=$HOST;charset=$CHARSET";
    if(empty($db_name)){
        $dsn = "mysql:host=$HOST;charset=$CHARSET";
    }

    try {
        $pdo = new PDO($dsn, $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = $pdo->query($data['data']['query']);
        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        // ステータスとデータを更新
        $response['success'] = true;
        $response['data'] = $result;

    } catch (PDOException $e){
        // ステータスとメッセージを更新
        $response['success'] = false;
        $response['message'] = $e->getMessage();
    }
}


//=======================================================
// データベース書き込み
//=======================================================
else if($data['type'] == "db_write"){
    // データーベース名設定
    if(isset($data['data']['db_name'])){
        $db_name = $data['data']['db_name'];
    }

    // ユーザー名設定
    if(isset($data['data']['db_user'])){
        $db_user = $data['data']['db_user'];
    }

    // パスワード設定
    if(isset($data['data']['db_pass'])){
        $db_pass = $data['data']['db_pass'];
    }

    // DB接続
    $dsn = "mysql:dbname=$db_name;host=$HOST;charset=$CHARSET";
    if(empty($db_name)){
        $dsn = "mysql:host=$HOST;charset=$CHARSET";
    }

    try {
        $pdo = new PDO($dsn, $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec($data['data']['query']);

        // ステータスを更新
        $response['success'] = true;

    } catch (PDOException $e){
        // ステータスとメッセージを更新
        $response['success'] = false;
        $response['message'] = $e->getMessage();
    }
}


//=======================================================
// Python実行
//=======================================================
else if($data['type'] == "python"){
    // Pythonの時は、$db_nameを実行するPythonのパスと扱う
    if(isset($data['data']['db_name'])){
        $db_name = $data['data']['db_name'];
    }

    // Pythonの実行コマンドを作成
    $cmd = "$PYTHON_PATH $db_name ";

    if(!empty($data['data']['args'])){
        for($i = 0; $i < count($data['data']['args']); $i++){
            $cmd .= escapeshellarg($data['data']['args'][$i]) . ' ';
        }
    }
    
    // Python実行
    try {
        $output = shell_exec($cmd);
        if ($output === null) {
            throw new Exception('コマンドの実行に失敗しました');
        }

        // ステータスとデータを更新
        $response['success'] = true;
        $response['data'] = $output;

    } catch (Exception $e) {
        // ステータスとメッセージを更新
        $response['success'] = false;
        $response['message'] = $e->getMessage();
    }    
}


// JSONとしてレスポンスを返す
header('Content-Type: application/json');
echo json_encode($response);

?>