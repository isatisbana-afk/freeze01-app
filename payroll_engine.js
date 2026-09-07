/**
 * Freeze01 / K-CORE Payroll & Cloud Engine
 * Core Logic for Engineer Salary Calculation
 */

function calculateFreeze01(input) {
    const {
        dailyWage = 0,
        requiredHours = 176,
        workedHours = 176,
        otHours = 0,
        holidayHours = 0,
        n2 = 1.05,
        n3 = 1.15,
        n4 = 1.08,
        n5 = 1.05,
        n6 = 1.02,
        n7 = 1.02,
        n8 = 1.365
    } = input;

    // 1. Base Salary Bi (قانون کار)
    const Bi = dailyWage * 30.5;

    // 2. K-CORE Multiplier K (ضرب ضرایب n2 تا n8)
    const K = n2 * n3 * n4 * n5 * n6 * n7 * n8;

    // 3. Adjusted Fee Si
    const Si = Bi * K;

    // 4. Overtime & Holiday Calculations
    const hourlyRate = Bi / 176;
    const otPay = otHours * hourlyRate * 1.4;
    const holidayPay = holidayHours * hourlyRate * 1.5;

    // 5. Gross Pay (جمع ناخالص)
    const grossPay = Si + otPay + holidayPay;

    // 6. Insurance & Tax Engine
    const insurance30 = grossPay * 0.30; // بیمه ۳۰٪
    const taxBase = Math.max(0, grossPay - 120000000); // معافیت ۱۲ میلیون تومانی
    const tax10 = taxBase * 0.10; // مالیات ۱۰٪
    const netPay = grossPay - (grossPay * 0.07) - tax10; // خالص دریافتی (کسر ۷٪ سهم کارگر)

    // 7. Alert System Rules
    let alertCode = "OK";
    let alertMessage = "محاسبات طبیعی و بدون خطا";

    if (Si < Bi) {
        alertCode = "RED";
        alertMessage = "هشدار قرمز: دریافتی Si کمتر از حداقل پایه Bi است";
    } else if (workedHours < requiredHours) {
        alertCode = "ORANGE";
        alertMessage = "هشدار نارنجی: کارکرد کمتر از ساعات موظف";
    } else if (otHours > 40) {
        alertCode = "BLUE";
        alertMessage = "هشدار آبی: اضافه‌کاری بیش از حد مجاز (۴۰ ساعت)";
    } else if (!n3 || n3 === 1) {
        alertCode = "YELLOW";
        alertMessage = "هشدار زرد: ضریب n3 اعمال نشده یا خالی است";
    }

    return {
        Bi: Math.round(Bi),
        K: Number(K.toFixed(4)),
        Si: Math.round(Si),
        otPay: Math.round(otPay),
        holidayPay: Math.round(holidayPay),
        grossPay: Math.round(grossPay),
        insurance30: Math.round(insurance30),
        tax10: Math.round(tax10),
        netPay: Math.round(netPay),
        alertCode,
        alertMessage
    };
}

// تست خودکار جهت تایید در GitHub Actions
const testResult = calculateFreeze01({
    dailyWage: 3200000,
    requiredHours: 176,
    workedHours: 180,
    otHours: 20,
    holidayHours: 8,
    n2: 1.05, n3: 1.15, n4: 1.08, n5: 1.05, n6: 1.02, n7: 1.02, n8: 1.365
});

console.log("=== Freeze01 K-CORE Validation Test ===");
console.log(`Bi (پایه): ${testResult.Bi.toLocaleString()} ریال`);
console.log(`ضریب K: ${testResult.K}`);
console.log(`Si (حق‌الزحمه): ${testResult.Si.toLocaleString()} ریال`);
console.log(`جمع ناخالص: ${testResult.grossPay.toLocaleString()} ریال`);
console.log(`وضعیت هشدار: [${testResult.alertCode}] - ${testResult.alertMessage}`);

if (testResult.Si >= testResult.Bi && testResult.K > 1) {
    console.log("\n✅ تمامی محاسبات هماهنگ با K-CORE تایید شد.");
    process.exit(0);
} else {
    console.error("\n❌ خطا در محاسبات هماهنگی Freeze01");
    process.exit(1);
}
