// 常见食物营养数据库 (每100g)
const foodDatabase = {
    '米饭': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28.6 },
    '面条': { calories: 150, protein: 4.4, fat: 0.5, carbs: 30.0 },
    '馒头': { calories: 220, protein: 7.0, fat: 1.1, carbs: 45.0 },
    '粥': { calories: 50, protein: 1.0, fat: 0.1, carbs: 10.0 },
    '鸡蛋': { calories: 155, protein: 13.3, fat: 11.1, carbs: 1.1 },
    '牛奶': { calories: 54, protein: 3.0, fat: 3.2, carbs: 3.4 },
    '豆浆': { calories: 31, protein: 3.0, fat: 1.6, carbs: 1.5 },
    '豆腐': { calories: 76, protein: 8.1, fat: 4.8, carbs: 1.9 },
    '猪肉': { calories: 143, protein: 20.3, fat: 6.2, carbs: 1.5 },
    '牛肉': { calories: 250, protein: 26.0, fat: 15.0, carbs: 0.0 },
    '鸡肉': { calories: 165, protein: 31.0, fat: 3.6, carbs: 0.0 },
    '鱼': { calories: 100, protein: 20.0, fat: 1.5, carbs: 0.0 },
    '虾': { calories: 85, protein: 20.0, fat: 0.5, carbs: 0.0 },
    '白菜': { calories: 17, protein: 1.5, fat: 0.1, carbs: 3.2 },
    '菠菜': { calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6 },
    '黄瓜': { calories: 16, protein: 0.8, fat: 0.2, carbs: 2.9 },
    '西红柿': { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
    '胡萝卜': { calories: 41, protein: 0.9, fat: 0.2, carbs: 9.6 },
    '土豆': { calories: 77, protein: 2.0, fat: 0.1, carbs: 17.0 },
    '红薯': { calories: 86, protein: 1.6, fat: 0.1, carbs: 20.1 },
    '玉米': { calories: 86, protein: 3.4, fat: 1.2, carbs: 18.7 },
    '香蕉': { calories: 89, protein: 1.1, fat: 0.3, carbs: 22.8 },
    '苹果': { calories: 52, protein: 0.3, fat: 0.2, carbs: 13.8 },
    '橙子': { calories: 47, protein: 0.9, fat: 0.1, carbs: 11.8 },
    '梨': { calories: 57, protein: 0.4, fat: 0.1, carbs: 15.2 },
    '葡萄': { calories: 69, protein: 0.7, fat: 0.2, carbs: 18.1 },
    '西瓜': { calories: 30, protein: 0.6, fat: 0.1, carbs: 7.6 },
    '面包': { calories: 265, protein: 9.0, fat: 3.2, carbs: 50.0 },
    '油条': { calories: 386, protein: 6.9, fat: 17.6, carbs: 50.0 },
    '汉堡': { calories: 295, protein: 17.0, fat: 14.0, carbs: 30.0 },
    '可乐': { calories: 42, protein: 0.0, fat: 0.0, carbs: 10.6 },
    '咖啡': { calories: 2, protein: 0.1, fat: 0.0, carbs: 0.0 },
    '酸奶': { calories: 96, protein: 3.5, fat: 3.3, carbs: 11.0 },
    '奶酪': { calories: 402, protein: 25.0, fat: 33.0, carbs: 1.3 },
    '花生': { calories: 567, protein: 25.0, fat: 49.0, carbs: 16.0 },
    '核桃': { calories: 654, protein: 15.0, fat: 65.0, carbs: 14.0 },
    '酸奶': { calories: 59, protein: 10.0, fat: 0.4, carbs: 3.6 },
    '巧克力': { calories: 546, protein: 4.9, fat: 31.0, carbs: 61.0 },
    '冰淇淋': { calories: 207, protein: 3.5, fat: 11.0, carbs: 24.0 },
    '饼干': { calories: 506, protein: 6.0, fat: 25.0, carbs: 63.0 },
    '方便面': { calories: 473, protein: 9.0, fat: 21.0, carbs: 60.0 },
    '披萨': { calories: 266, protein: 11.0, fat: 10.0, carbs: 33.0 },
    '寿司': { calories: 150, protein: 5.0, fat: 1.0, carbs: 30.0 }
};

// 食物记录
let foodRecords = [];

// DOM元素
const voiceBtn = document.getElementById('voiceBtn');
const textInput = document.getElementById('textInput');
const addBtn = document.getElementById('addBtn');
const transcription = document.getElementById('transcription');
const foodTableBody = document.getElementById('foodTableBody');
const emptyState = document.getElementById('emptyState');
const clearBtn = document.getElementById('clearBtn');

// 语音识别相关
let recognition = null;
let isRecording = false;

// 初始化语音识别
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            isRecording = true;
            voiceBtn.classList.add('recording');
            voiceBtn.querySelector('span').textContent = '正在录音...';
            transcription.textContent = '正在聆听...';
            transcription.classList.remove('has-content');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            transcription.textContent = `识别结果: ${transcript}`;
            transcription.classList.add('has-content');

            // 解析食物
            const foods = parseFoodInput(transcript);
            foods.forEach(food => {
                addFoodRecord(food);
            });
        };

        recognition.onerror = (event) => {
            console.error('语音识别错误:', event.error);
            transcription.textContent = `识别出错: ${event.error}`;
            transcription.classList.remove('has-content');
            stopRecording();
        };

        recognition.onend = () => {
            stopRecording();
        };
    } else {
        voiceBtn.disabled = true;
        voiceBtn.querySelector('span').textContent = '浏览器不支持语音识别';
        transcription.textContent = '您的浏览器不支持语音识别功能,请使用文本输入';
    }
}

function startRecording() {
    if (recognition && !isRecording) {
        recognition.start();
    }
}

function stopRecording() {
    isRecording = false;
    voiceBtn.classList.remove('recording');
    voiceBtn.querySelector('span').textContent = '点击开始录音';
}

// 解析食物输入
function parseFoodInput(input) {
    const foods = [];
    const amountPattern = /(\d+)(?:克|g|个|碗|碗|份|片|块)?\s*(.+)/;
    const quantityPattern = /(.+?)\s*(\d+)\s*(?:克|g|个|碗|碗|份|片|块)/;

    // 尝试匹配 "100克 鸡肉" 或 "鸡肉 100克"
    const amountMatch = input.match(amountPattern) || input.match(quantityPattern);

    if (amountMatch) {
        const amount = parseInt(amountMatch[1]);
        const foodName = amountMatch[2].trim();

        if (foodDatabase[foodName]) {
            const food = calculateNutrition(foodName, amount);
            food.input = input;
            foods.push(food);
        }
    } else {
        // 尝试直接匹配食物名称
        for (const foodName in foodDatabase) {
            if (input.includes(foodName)) {
                const food = calculateNutrition(foodName, 100); // 默认100克
                food.input = input;
                foods.push(food);
                break;
            }
        }
    }

    return foods;
}

// 计算营养成分
function calculateNutrition(foodName, amount) {
    const baseNutrition = foodDatabase[foodName];
    const ratio = amount / 100;

    return {
        name: foodName,
        amount: amount,
        calories: Math.round(baseNutrition.calories * ratio),
        protein: Math.round(baseNutrition.protein * ratio * 10) / 10,
        fat: Math.round(baseNutrition.fat * ratio * 10) / 10,
        carbs: Math.round(baseNutrition.carbs * ratio * 10) / 10
    };
}

// 添加食物记录
function addFoodRecord(food) {
    foodRecords.push({
        ...food,
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleString()
    });
    updateUI();
}

// 删除食物记录
function deleteFoodRecord(id) {
    foodRecords = foodRecords.filter(record => record.id !== id);
    updateUI();
}

// 更新UI
function updateUI() {
    updateTable();
    updateStats();
}

// 更新表格
function updateTable() {
    if (foodRecords.length === 0) {
        foodTableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    foodTableBody.innerHTML = foodRecords.map(record => `
        <tr>
            <td>${record.name} (${record.amount}克)</td>
            <td>${record.calories}</td>
            <td>${record.protein}</td>
            <td>${record.fat}</td>
            <td>${record.carbs}</td>
            <td>
                <button class="delete-btn" onclick="deleteFoodRecord(${record.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

// 更新统计数据
function updateStats() {
    const totals = foodRecords.reduce((acc, record) => ({
        calories: acc.calories + record.calories,
        protein: acc.protein + record.protein,
        fat: acc.fat + record.fat,
        carbs: acc.carbs + record.carbs
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

    document.getElementById('totalCalories').textContent = totals.calories;
    document.getElementById('totalProtein').textContent = Math.round(totals.protein * 10) / 10;
    document.getElementById('totalFat').textContent = Math.round(totals.fat * 10) / 10;
    document.getElementById('totalCarbs').textContent = Math.round(totals.carbs * 10) / 10;
}

// 清空记录
function clearRecords() {
    if (confirm('确定要清空所有记录吗?')) {
        foodRecords = [];
        updateUI();
    }
}

// 事件监听
voiceBtn.addEventListener('click', () => {
    if (isRecording) {
        recognition.stop();
    } else {
        startRecording();
    }
});

addBtn.addEventListener('click', () => {
    const input = textInput.value.trim();
    if (input) {
        const foods = parseFoodInput(input);
        foods.forEach(food => {
            addFoodRecord(food);
        });
        textInput.value = '';
    }
});

textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

clearBtn.addEventListener('click', clearRecords);

// 初始化
initSpeechRecognition();
updateUI();
