document.getElementById('calcBtn').addEventListener('click', function() {
    const dailyWage = Number(document.getElementById('dailyWage').value) || 0;
    const requiredHours = Number(document.getElementById('requiredHours').value) || 176;
    const workedHours = Number(document.getElementById('workedHours').value) || 176;
    const otHours = Number(document.getElementById('otHours').value) || 0;
    const holidayHours = Number(document.getElementById('holidayHours').value) || 0;

    const n2 = Number(document.getElementById('n2').value) || 1;
    const n3 = Number(document.getElementById('n3').value) || 1;
    const n4 = Number(document.getElementById('n4').value) || 1;
    const n5 = Number(document.getElementById('n5').value) || 1;
    const n6 = Number(document.getElementById('n6').value) || 1;
    const n7 = Number(document.getElementById('n7').value) || 1;
    const n8 = Number(document.getElementById('n8').value) || 1;

    const Bi = dailyWage * 30.5;
    const K = n2 * n3 * n4 * n5 * n6 * n7 * n8;
    const Si = Bi * K;

    const hourlyRate = Bi / 176;
    const otPay = otHours * hourlyRate * 1.4;
    const holidayPay = holidayHours * hourlyRate * 1.5;
    const grossPay = Si + otPay + holidayPay;

    const taxBase = Math.max(0, grossPay - 120000000);
    const tax10 = taxBase * 0.10;
    const netPay = grossPay - (grossPay * 0.07) - tax10;

    document.getElementById('resBi').innerText = Math.round(Bi).toLocaleString() + ' ریال';
    document.getElementById('resK').innerText = K.toFixed(4);
    document.getElementById('resSi').innerText = Math.round(Si).toLocaleString() + ' ریال';
    document.getElementById('resGross').innerText = Math.round(grossPay).toLocaleString() + ' ریال';
    document.getElementById('resTax').innerText = Math.round(tax10).toLocaleString() + ' ریال';
    document.getElementById('resNet').innerText = Math.round(netPay).toLocaleString() + ' ریال';

    const badge = document.getElementById('alertBadge');
    const alertText = document.getElementById('alertText');

    if (Si < Bi) {
        badge.className = "badge badge-red"; badge.innerText = "وضعیت: هشدار قرمز";
        alertText.innerText = "دریافتی Si کمتر از حداقل پایه Bi است.";
    } else if (workedHours < requiredHours) {
        badge.className = "badge badge-orange"; badge.innerText = "وضعیت: هشدار نارنجی";
        alertText.innerText = "کارکرد کمتر از ساعات موظف می‌باشد.";
    } else if (otHours > 40) {
        badge.className = "badge badge-blue"; badge.innerText = "وضعیت: هشدار آبی";
        alertText.innerText = "ساعات اضافه‌کاری بیش از سقف مجاز (۴۰ ساعت) است.";
    } else if (n3 === 1) {
        badge.className = "badge badge-yellow"; badge.innerText = "وضعیت: هشدار زرد";
        alertText.innerText = "ضریب n3 اعمال نشده است.";
    } else {
        badge.className = "badge badge-ok"; badge.innerText = "وضعیت: OK";
        alertText.innerText = "محاسبات طبیعی و بدون خطا است.";
    }
});

// اجرای اولیه هنگام بارگذاری
document.getElementById('calcBtn').click();
