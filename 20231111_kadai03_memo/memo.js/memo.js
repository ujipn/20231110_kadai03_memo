// 送信イベント

$("#save").on("click",function(){
    // name=登録者、time=希望日時、start=出発地点、goal=目的地、transportation=移動手段
    const name = $("#name").val();
    const timeStart = $("#timestart").val();
    const timeEnd = $("#timeend").val();
    const start = $("#start").val();
    const goal = $("#goal").val();
    const transportations = [];
    // 名前が "move" でありチェックされた移動手段のチェックボックス要素を選択し、それぞれに対して以下の処理を実行する
    $('input[name="move"]:checked').each(function() {
    // 選択された移動手段の値を transportations 配列に追加する
    transportations.push($(this).val());
    });
    const number = $("#number").val(); //参加人数を取得
    const submissionTime = new Date().toLocaleString(); // 送信時間を取得
    const text = $("#text").val(); //要望を取得

  // 入力データをオブジェクトとして保存
  const data = {
    name: name,
    timeStart: timeStart,
    timeEnd: timeEnd,
    start: start,
    goal: goal,
    transportation: transportations,
    number: number,
    submissionTime: submissionTime,
    text: text
};

    // ここで管理者コードを設定
    const adminCode = $("#adminCodeInput").val();
    data.adminCode = adminCode;
    
//name をキーとして、JSON 文字列をローカルストレージに保存
 localStorage.setItem(name, JSON.stringify(data));

 $("#name").val("");
 $("#timestart").val("");
 $("#timeend").val("");
 $("#start").val("");
 $("#goal").val("");
 $('input[name="move"]').prop('checked', false); //すべてのチェックボックスが選択解除される
 $("#number").val("0");
 $("#text").val("");


});

// 取り消しイベント
$("#clear").on("click",function(){
    localStorage.clear();
    $("#list").empty(); 
    $("#adminCodeInput").val(""); // 管理者コード入力フィールドをクリア
    $("#searchName").val(""); // 検索欄をクリア
    $("#searchDate").val(""); // 検索欄をクリア
})

 // データをローカルストレージから取得して表示する関数
 function displayData() {
    $("#list").empty(); // リストをクリア


// ページ読み込み
for(let i = 0; i < localStorage.length; i++) {
    const name = localStorage.key(i);  // ローカルストレージに保存されたデータのキー（名前）を取得
    const value = localStorage.getItem(name);  // 文字列として保存されたデータを取得

    // ここでは、保存されたデータをJSONオブジェクトとして取得し、そのプロパティを抽出します
    const data = JSON.parse(value);
    const timeStart = data.timeStart;
    const timeEnd = data.timeEnd;
    const start = data.start;
    const goal = data.goal;
    const transportations = data.transportation;
    const number = data.number;
    const submissionTime = data.submissionTime;
    const text = data.text;



    // 取得したデータを表示するHTML要素を作成します
    const html = `
        <li>
            <p>申込者：${name}</p>
            <p>出発日時：${timeStart}</p>
            <p>終了日時：${timeEnd}</p>
            <p>出発地点：${start}</p>
            <p>終着地点：${goal}</p>
            <p>移動手段：${transportations.join(', ')}</p>
            <p>参加人数：${number}</p>
            <p>ご要望：${text}</p>
            <p>送信時間：${submissionTime}</p>
        </li>
    `;
   $("#list").append(html);
}
};

// 管理者コードでデータ表示
$("#adminView").on("click", function () {
    const adminCodeInput = $("#adminCodeInput").val();
    const correctAdminCode = "1234"; // 正しい管理者コード

    if (adminCodeInput === correctAdminCode) {
        // 正しい管理者コードが入力された場合にリストを表示
        $("#list").css("display", "block");

        $("#list").empty();

        // ローカルストレージからデータを取得
        for (let i = 0; i < localStorage.length; i++) {
            const name = localStorage.key(i);
            const value = localStorage.getItem(name);
            const data = JSON.parse(value);

            // データの管理者コードをチェック
            if (data.adminCode === correctAdminCode) {
                // データを表示するロジック...
                const timeStart = data.timeStart;
                const timeEnd = data.timeEnd;
                const start = data.start;
                const goal = data.goal;
                const transportations = data.transportation;
                const number = data.number;
                const submissionTime = data.submissionTime;
                const text = data.text;

                // 取得したデータを表示するHTML要素を作成します
                const html = `
                    <li>
                        <p>申込者：${name}</p>
                        <p>出発日時：${timeStart}</p>
                        <p>終了日時：${timeEnd}</p>
                        <p>出発地点：${start}</p>
                        <p>目的地：${goal}</p>
                        <p>移動手段：${transportations.join(', ')}</p>
                        <p>参加人数：${number}</p>
                        <p>ご要望：${text}</p>
                        <p>送信時間：${submissionTime}</p>
                    </li>
                `;
                $("#list").append(html);
            }



            
        }
    } else {
        // 不正な管理者コードが入力された場合にメッセージを表示
        alert("管理者コードが正しくありません");
    }
       // データを表示する
       displayData();




       
       const resetButton = $("#clear");

       if (adminCodeInput === correctAdminCode) {
           resetButton.show(); // 正しい管理者コードの場合、リセットボタンを表示
       } else {
           resetButton.hide(); // 正しくない場合、リセットボタンを非表示
       }

});
