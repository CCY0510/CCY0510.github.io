function displayFileNames() {
    const fileInput = document.getElementById('fileInput');
    const pictureFileInput = document.getElementById('picturefileInput');
    const fileNamesDiv = document.getElementById('fileNames');
    fileNamesDiv.innerHTML = ''; // 清空之前的内容

    let fileNames = '';

    // 處理 fileInput 選擇的檔案
    if (fileInput.files.length > 0) {
        fileNames += '選擇的檔案:<br>';
        for (let i = 0; i < fileInput.files.length; i++) {
            fileNames += fileInput.files[i].name + '<br>';
        }
    }

    // 處理 pictureFileInput 選擇的檔案
    if (pictureFileInput.files.length > 0) {
        fileNames += '選擇的壓縮檔(圖片病歷):<br>';
        for (let i = 0; i < pictureFileInput.files.length; i++) {
            fileNames += pictureFileInput.files[i].name + '<br>';
        }
    }

    // 若都未選擇檔案，顯示未選擇任何檔案
    if (fileInput.files.length === 0 && pictureFileInput.files.length === 0) {
        fileNames = '未選擇任何檔案';
    }

    fileNamesDiv.innerHTML = fileNames;
}


function uploadFiles() {
    // 清空上次回應的訊息
    const responseMsg = document.getElementById("responseMessage");
    responseMsg.innerHTML = '⏳ 等待上傳中...'; // ✅ 新增：上傳中提示

    var userName = document.getElementById("name").value;
    var userID = document.getElementById("userID").value;
    var userEmail = document.getElementById("email") ? document.getElementById("email").value : '';
    var pasthistory = '[' + Array.from(selectedPastConditions).map(item => `"${item}"`).join(',') + ']';
    var familyhistory = '[' + Array.from(selectedConditions).map(item => `"${item}"`).join(',') + ']';
    var family_history_heart = document.getElementById("family_history_heart").value;
    var family_history_heart_input = document.getElementById("family_history_heart_input").value;
    var smoking = document.getElementById("smoking") ? document.getElementById("smoking").value : '';
    var drinking = document.getElementById("drinking") ? document.getElementById("drinking").value : '';

    const fileInput = document.getElementById('fileInput');
    const picturefileInput = document.getElementById('picturefileInput');
    const api_url = `${API_BASE_URL}/upload`;

    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('userName', userName);
    formData.append('userEmail', userEmail);
    formData.append('pasthistory', pasthistory);
    formData.append('familyhistory', familyhistory);
    formData.append('family_history_heart', family_history_heart);
    formData.append('family_history_heart_input', family_history_heart_input);
    formData.append('smoking', smoking);
    formData.append('drinking', drinking);

    // 加入上傳檔案
    const files = fileInput.files;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            formData.append('fileInput', files[i]);
        }
    }

    const folderFiles = picturefileInput.files;
    if (folderFiles.length > 0) {
        formData.append('picturefileInput', folderFiles[0]);
    }

    // 計算預計完成時間（仍保留此功能，但不顯示在畫面上）
    const totalFiles = files.length + folderFiles.length;
    const estimatedTime = totalFiles * 3;

    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';
    loadingSpinner.querySelector('p').innerHTML = '正在上傳資料...';

    // 開始上傳
    fetch(api_url, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('網路錯誤');
    })
    .then(data => {
        console.log('伺服器回應:', data);

        // ✅ 修改：不顯示 Email 通知或預估時間，只顯示上傳成功
        responseMsg.innerHTML = "✅ 上傳成功！";

        // 隱藏 loading 圖示
        loadingSpinner.style.display = 'none';
    })
    .catch(error => {
        console.error('錯誤:', error);
        responseMsg.innerHTML = '❌ 上傳失敗: ' + error.message;
        loadingSpinner.style.display = 'none';
    });
}











