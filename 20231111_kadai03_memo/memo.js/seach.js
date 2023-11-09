// 送信時間の文字列を Date オブジェクトに変換する関数
function parseDate(dateString) {
    // 日本の日付形式 "YYYY/MM/DD HH:mm:ss" を正しく解析する
    var parts = dateString.match(/(\d+)/g);
    // new Date(year, month [, date [, hours [, minutes [, seconds [, ms ] ] ] ] ])
    // 注意: months は 0-11 で指定
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
}

// アナリティクスボタンイベント
$("#analytics").on("click", function() {
    // 日付ごとの申込件数を集計する
    let dateCounts = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const data = JSON.parse(localStorage.getItem(key));
        // 送信時間を Date オブジェクトに変換
        const date = parseDate(data.submissionTime);
        // 日付をYYYY-MM形式に変換します（月別に集計するため）
        const monthYear = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2);
        if (dateCounts[monthYear]) {
            dateCounts[monthYear] += 1; // 既にキーが存在する場合はカウントアップ
        } else {
            dateCounts[monthYear] = 1; // 新しいキーの場合は初期値1を設定
        }
    }

    // Chart.jsに渡すためのデータセットを準備
    // キーを日付順にソートします
    const sortedDates = Object.keys(dateCounts).sort();
    const chartData = sortedDates.map(date => dateCounts[date]);

    // グラフを描画
    drawChart(sortedDates, chartData);
});


// Chart.jsを使ってグラフを描画する関数
function drawChart(labels, data) {
    // 既存のグラフがあれば破棄する
    if (window.myChart) {
        window.myChart.destroy();
    }

    const ctx = document.getElementById('analyticsChart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'bar', // グラフのタイプを棒グラフに変更
        data: {
            labels: labels, // x軸のラベル
            datasets: [{
                label: '送信件数', // グラフのラベル
                backgroundColor: 'rgba(0, 123, 255, 0.5)', // グラフの背景色
                borderColor: 'rgba(0, 123, 255, 1)', // 線の色
                data: data, // y軸のデータ
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true // y軸のスケールを0からスタートする
                },
                x: {
                    // x軸のラベルを月別に表示する設定
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'YYYY-MM'
                        }
                    }
                }
            },
            // 凡例の表示をオフにする
            legend: {
                display: false
            }
        }
    });
}
