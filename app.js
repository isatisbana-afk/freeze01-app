// ==========================================
// K-CORE / M-100 Payroll & Subcontractor Engine
// ==========================================

// جدول ضرایب رده شغلی (n1)
const ROLE_COEFFICIENTS = {
    'S01': 1.00, // نیروی اجرایی پایه
    'S02': 1.05, // نیروی اجرایی
    'S03': 1.10, // نیروی اجرایی ارشد
    'S04': 1.18, // سرپرست
    'S05': 1.25, // سرپرست کارگاه
    'S06': 1.35, // مدیر بخش
    'S07': 1.45, // مهندس ناظر
    'S08': 1.60, // مهندس ناظر ارشد
    'S09': 1.75, // مدیر فنی / کارشناس ارشد
    'S10': 1.90, // مدیر پروژه
    'S11': 2.10, // مدیر ارشد پروژه
    'S12': 2.30  // مدیر پروژه ویژه
};

function calculatePayroll() {
    const roleCode = document.getElementById('roleCode').value;
    const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
    const overtimeHours = parseFloat(document.getElementById('overtimeHours').value) || 0;

    // n1: ضریب رده شغلی
    const n1 = ROLE_COEFFICIENTS[roleCode] || 1.00;

    // n2 تا n8: محاسبه حاصلضرب ضرایب 7 گانه شرایط محیطی
    const envInputs = document.querySelectorAll('.env-factor');
    let envProduct = 1.0;
    envInputs.forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val) && val > 0) {
            envProduct *= val;
        }
    });

    // حاصلضرب کل 8 ضریب (n1 * n2 * ... * n8)
    const totalMultiplier = n1 * envProduct;

    // خالص حقوق ماهانه
    const netSalary = Math.round(baseSalary * totalMultiplier);

    // نرخ ساعتی پایه (حقوق ÷ 220)
    const hourlyRate = Math.round(netSalary / 220);

    // اضافه کاری پرسنل (ضریب 1.40)
    const overtimePayWorker = Math.round(overtimeHours * hourlyRate * 1.40);

    // اضافه کاری صورت وضعیت پیمانکار (ضریب 1.66)
    const overtimePayContractor = Math.round(overtimeHours * hourlyRate * 1.66);

    // جمع‌های کل
    const totalWorker = netSalary + overtimePayWorker;
    const totalContractor = netSalary + overtimePayContractor;

    // درج خروجی در صفحه
    document.getElementById('resNetSalary').innerText = netSalary.toLocaleString('fa-IR');
    document.getElementById('resHourlyRate').innerText = hourlyRate.toLocaleString('fa-IR');
    document.getElementById('resOvertimeWorker').innerText = overtimePayWorker.toLocaleString('fa-IR');
    document.getElementById('resOvertimeContractor').innerText = overtimePayContractor.toLocaleString('fa-IR');
    document.getElementById('resTotalWorker').innerText = totalWorker.toLocaleString('fa-IR');
    document.getElementById('resTotalContractor').innerText = totalContractor.toLocaleString('fa-IR');

    return {
        roleCode,
        n1,
        baseSalary,
        envProduct: envProduct.toFixed(4),
        totalMultiplier: totalMultiplier.toFixed(4),
        netSalary,
        hourlyRate,
        overtimeHours,
        overtimePayWorker,
        overtimePayContractor,
        totalWorker,
        totalContractor
    };
}

// تابع خروجی اکسل / CSV با پشتیبانی کامل از کاراکترهای فارسی
function exportToExcel() {
    const data = calculatePayroll();

    // افزودن UTF-8 BOM جهت نمایش صحیح حروف فارسی در Excel
    let csvContent = "\uFEFF";
    csvContent += "عنوان شاخص,مقدار / مبلغ (ریال)\n";
    csvContent += `کد رده شغلی,${data.roleCode}\n`;
    csvContent += `ضریب رده شغلی (n1),${data.n1}\n`;
    csvContent += `حقوق پایه مصوب (B_i),${data.baseSalary}\n`;
    csvContent += `حاصلضرب ضرایب محیطی (n2 تا n8),${data.envProduct}\n`;
    csvContent += `ضریب کل محاسباتی (n1 * ... * n8),${data.totalMultiplier}\n`;
    csvContent += `خالص دریافتی ماهانه پرسنل,${data.netSalary}\n`;
    csvContent += `نرخ ساعتی پایه (حقوق ÷ ۲۲۰),${data.hourlyRate}\n`;
    csvContent += `ساعت کارکرد اضافه کاری,${data.overtimeHours}\n`;
    csvContent += `مبلغ اضافه کاری پرسنل (ضریب ۱.۴۰),${data.overtimePayWorker}\n`;
    csvContent += `مبلغ اضافه کاری پیمانکار (ضریب ۱.۶۶),${data.overtimePayContractor}\n`;
    csvContent += `جمع کل پرداختی مستقیم به پرسنل,${data.totalWorker}\n`;
    csvContent += `جمع کل صورت وضعیت پیمانکار,${data.totalContractor}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `KCORE_Payroll_Report_${data.roleCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
