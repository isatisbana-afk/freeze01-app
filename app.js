// جدول ضریب رده شغلی (n1)
const JOB_ROLES = {
    "S01": { title: "نیروی اجرایی پایه", n1: 1.00 },
    "S02": { title: "نیروی اجرایی", n1: 1.05 },
    "S03": { title: "نیروی اجرایی ارشد", n1: 1.10 },
    "S04": { title: "سرپرست", n1: 1.18 },
    "S05": { title: "سرپرست کارگاه", n1: 1.25 },
    "S06": { title: "مدیر بخش", n1: 1.35 },
    "S07": { title: "مهندس ناظر", n1: 1.45 },
    "S08": { title: "مهندس ناظر ارشد", n1: 1.60 },
    "S09": { title: "مدیر فنی / کارشناس ارشد", n1: 1.75 },
    "S10": { title: "مدیر پروژه", n1: 1.90 },
    "S11": { title: "مدیر ارشد پروژه", n1: 2.10 },
    "S12": { title: "مدیر پروژه ویژه", n1: 2.30 }
};

function runCalculation() {
    // ۱. دریافت حقوق پایه و نقش
    const Bi = parseFloat(document.getElementById('Bi').value) || 0;
    const roleCode = document.getElementById('roleCode').value;
    
    // ۲. دریافت ضرایب ۷ گانه محیطی (n2 تا n8)
    const n2 = parseFloat(document.getElementById('n2').value) || 1.00;
    const n3 = parseFloat(document.getElementById('n3').value) || 1.00;
    const n4 = parseFloat(document.getElementById('n4').value) || 1.00;
    const n5 = parseFloat(document.getElementById('n5').value) || 1.00;
    const n6 = parseFloat(document.getElementById('n6').value) || 1.00;
    const n7 = parseFloat(document.getElementById('n7').value) || 1.00;
    const n8 = parseFloat(document.getElementById('n8').value) || 1.00;

    // ۳. دریافت ساعات و ضرایب پیمان
    const Tm = parseFloat(document.getElementById('Tm').value) || 0;
    const Tr = parseFloat(document.getElementById('Tr').value) || 0;
    const Ts = parseFloat(document.getElementById('Ts').value) || 0;
    const F1 = parseFloat(document.getElementById('F1').value) || 1.66;
    const F2 = parseFloat(document.getElementById('F2').value) || 1.66;

    // ۴. محاسبه کامل Si بر اساس حاصل‌ضرب تمام ضرایب (n1 * n2 * ... * n8)
    const role = JOB_ROLES[roleCode] || { title: "نامشخص", n1: 1.00 };
    const n1 = role.n1;
    const envProduct = n2 * n3 * n4 * n5 * n6 * n7 * n8;
    const Si = Bi * n1 * envProduct;

    // ۵. اجرای محاسبات اصلی
    let result;
    if (typeof calculateSiteSalary === 'function') {
        result = calculateSiteSalary(Si, Tm, Tr, Ts, F1, F2);
    } else {
        result = internalCalculate(Si, Tm, Tr, Ts, F1, F2);
    }

    // ۶. نمایش نتایج با تفکیک کامل
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
        <div class="result-card">
            <div class="result-item">
                <span>رده شغلی (n1):</span>
                <b>${role.title} (${roleCode} = ${n1})</b>
            </div>
            <div class="result-item">
                <span>حاصل‌ضرب ضرایب محیطی (n2..n8):</span>
                <b>${envProduct.toFixed(4)}</b>
            </div>
            <div class="result-item">
                <span>حق‌الزحمه پایه (Si):</span>
                <b style="color: #2980b9;">${Math.round(Si).toLocaleString()} ریال</b>
            </div>
            <hr>
            <div class="result-item">
                <span>پایه پرداختی ماهانه:</span>
                <b>${result.S_base_paid.toLocaleString()} ریال</b>
            </div>
            <div class="result-item">
                <span>اضافه کاری روز (Sa):</span>
                <b>${(result.Sa || result.S_a || 0).toLocaleString()} ریال</b>
            </div>
            <div class="result-item">
                <span>اضافه کاری شب (Se):</span>
                <b>${(result.Se || result.S_e || 0).toLocaleString()} ریال</b>
            </div>
            <div class="result-item">
                <span>شب‌کاری موظف (Sd):</span>
                <b>${(result.Sd || result.S_d || 0).toLocaleString()} ریال</b>
            </div>
            
            <div class="total-price">
                جمع کل پرداختی: ${(result.totalPayable || 0).toLocaleString()} ریال
            </div>
        </div>
    `;
}

function internalCalculate(Si, Tm, Tr, Ts, F1, F2) {
    const totalHours = Tr + Ts;
    let lambdaHours = 0, Td = 0, Te = 0;
    let S_base_paid = 0, Sa = 0, Se = 0, Sd = 0;

    if (Tr >= Tm) {
        lambdaHours = Tr - Tm;
        Te = Ts;
        S_base_paid = Si;
        Sa = 0.0077 * F2 * Si * lambdaHours;
        Se = 0.0096 * F2 * Si * Te;
    } else if (totalHours >= Tm) {
        Td = Tm - Tr;
        Te = Ts - Td;
        S_base_paid = Si;
        Se = 0.0096 * F2 * Si * Te;
        Sd = 0.0020 * F1 * Si * Td;
    } else {
        Td = Ts;
        S_base_paid = Si * (totalHours / Tm);
        Sd = 0.0020 * F1 * Si * Ts;
    }

    return {
        S_base_paid: Math.round(S_base_paid),
        Sa: Math.round(Sa),
        Se: Math.round(Se),
        Sd: Math.round(Sd),
        totalPayable: Math.round(S_base_paid + Sa + Se + Sd)
    };
}
