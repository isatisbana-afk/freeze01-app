let currentCalculationResult = null;

function processCalculation() {
    const dailyWage = parseFloat(document.getElementById('dailyBaseWage').value) || 0;
    const n2 = parseFloat(document.getElementById('n2').value);
    const n3 = parseFloat(document.getElementById('n3').value);
    const n4 = parseFloat(document.getElementById('n4').value);
    const n5 = parseFloat(document.getElementById('n5').value);
    const n6 = parseFloat(document.getElementById('n6').value);
    const n7 = parseFloat(document.getElementById('n7').value);
    const n8 = parseFloat(document.getElementById('n8').value) || 1.365;

    const workedHours = parseFloat(document.getElementById('workedHours').value) || 0;
    const requiredHours = parseFloat(document.getElementById('requiredHours').value) || 176;
    const overtimeHours = parseFloat(document.getElementById('overtimeHours').value) || 0;
    const holidayHours = parseFloat(document.getElementById('holidayHours').value) || 0;

    // ۱. محاسبه پایه ماهانه Bi
    const Bi = dailyWage * 30.5;

    // ۲. بررسی ضریب خالی (YELLOW Alert)
    if ([n2, n3, n4, n5, n6, n7].some(val => isNaN(val) || val <= 0)) {
        renderResult("YELLOW", "یکی از ضرایب هفت‌گانه وارد نشده یا صفر است.", Bi, 0, 0, 0);
        return;
    }

    // ۳. محاسبه K و Si
    const K = n2 * n3 * n4 * n5 * n6 * n7 * n8;
    const Si = Bi * K;

    // ۴. اضافه‌کاری و جمع کل
    const hourlyRate = Bi / 176;
    const otPay = overtimeHours * hourlyRate * 1.4;
    const holPay = holidayHours * hourlyRate * 1.5;
    const totalPay = Si + otPay + holPay;

    // ۵. ارزیابی هشدارهای ۵ گانه
    let alertStatus = "GREEN";
    let alertMessage = "محاسبات تایید شد و حقوق منطبق بر فرمول است.";

    if (Si < Bi) {
        alertStatus = "RED";
        alertMessage = "خطای بحرانی حقوق: مقدار Si کمتر از پایه قانونی Bi است!";
    } else if (workedHours < requiredHours) {
        alertStatus = "ORANGE";
        alertMessage = "هشدار: کارکرد واقعی کمتر از موظفی ماهانه ثبت شده است.";
    } else if (overtimeHours > 60) {
        alertStatus = "BLUE";
        alertMessage = "تذکر: ساعات اضافه‌کاری بیش از سقف استاندارد (۶۰ ساعت) است.";
    }

    renderResult(alertStatus, alertMessage, Bi, K, Si, totalPay);
}

function renderResult(status, message, Bi, K, Si, totalPay) {
    const card = document.getElementById('resultCard');
    const badge = document.getElementById('alertBadge');
    
    card.classList.remove('hidden');
    badge.className = `badge bg-${status}`;
    badge.innerText = `وضعیت هشدار: ${status}`;
    document.getElementById('alertMessage').innerText = message;

    document.getElementById('resBi').innerText = Math.round(Bi).toLocaleString();
    document.getElementById('resK').innerText = K.toFixed(4);
    document.getElementById('resSi').innerText = Math.round(Si).toLocaleString();
    document.getElementById('resTotal').innerText = Math.round(totalPay).toLocaleString();

    currentCalculationResult = {
        staffId: document.getElementById('staffId').value,
        roleCode: document.getElementById('roleCode').value,
        timestamp: new Date().toISOString(),
        Bi, K, Si, totalPay, alertStatus: status, alertMessage: message
    };

    // ذخیره در LocalStorage مرورگر گوشی
    localStorage.setItem('last_freeze01_worklog', JSON.stringify(currentCalculationResult));
}

// دانلود فایل جهت انتقال کابل به VS Code
function exportDataJSON() {
    if (!currentCalculationResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentCalculationResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `freeze01_worklog_${currentCalculationResult.staffId || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}