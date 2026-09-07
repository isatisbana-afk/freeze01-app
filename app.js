function runCalculation() {
    // ۱. گرفتن اعداد از کادرهای داخل سایت
    let Si = Number(document.getElementById('Si').value);
    let Tm = Number(document.getElementById('Tm').value);
    let Tr = Number(document.getElementById('Tr').value);
    let Ts = Number(document.getElementById('Ts').value);

    // ۲. ارسال اعداد به موتور محاسباتی (payroll_engine.js)
    let result = calculateSiteSalary(Si, Tm, Tr, Ts);

    // ۳. نمایش نتیجه روی صفحه سایت
    document.getElementById('output').innerHTML = `
        <h3>نتایج محاسبه:</h3>
        <p><b>پایه پرداختی ماهانه:</b> ${result.S_base_paid.toLocaleString()} ریال</p>
        <p><b>اضافه کاری روز (Sa):</b> ${result.Sa.toLocaleString()} ریال</p>
        <p><b>اضافه کاری شب (Se):</b> ${result.Se.toLocaleString()} ریال</p>
        <p><b>شب‌کاری در ساعات موظف (Sd):</b> ${result.Sd.toLocaleString()} ریال</p>
        <hr>
        <h2 style="color: green;">جمع کل پرداختی: ${result.totalPayable.toLocaleString()} ریال</h2>
    `;
}
