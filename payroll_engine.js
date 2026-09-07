/**
 * موتور محاسباتی جدید حقوق و مزایای عوامل مدیریت کارگاه
 * فایل: payroll_engine.js
 */

const CONSTANTS = {
    DEFAULT_F1: 1.66,
    DEFAULT_F2: 1.66,
    COEFF_SA: 0.0077, // اضافه کاری روز
    COEFF_SE: 0.0096, // اضافه کاری شب
    COEFF_SD: 0.0020, // شب کاری موظف
    MAX_HOURS_LIMIT: 250
};

function calculateSiteSalary(Si, Tm, Tr, Ts, F1 = CONSTANTS.DEFAULT_F1, F2 = CONSTANTS.DEFAULT_F2) {
    const totalHours = Tr + Ts;
    const overLimitWarning = totalHours > CONSTANTS.MAX_HOURS_LIMIT;

    let lambdaHours = 0, Td = 0, Te = 0;
    let S_base_paid = 0, Sa = 0, Se = 0, Sd = 0;

    // حالت ۱: کارکرد روزانه بیشتر یا برابر موظفی
    if (Tr >= Tm) {
        lambdaHours = Tr - Tm;
        Td = 0;
        Te = Ts;

        S_base_paid = Si;
        Sa = CONSTANTS.COEFF_SA * F2 * Si * lambdaHours;
        Se = CONSTANTS.COEFF_SE * F2 * Si * Te;
        Sd = 0;
    } 
    // حالت ۲: مجموع روز و شب موظفی را پر می‌کند
    else if (totalHours >= Tm) {
        lambdaHours = 0;
        Td = Tm - Tr;
        Te = Ts - Td;

        S_base_paid = Si;
        Sa = 0;
        Se = CONSTANTS.COEFF_SE * F2 * Si * Te;
        Sd = CONSTANTS.COEFF_SD * F1 * Si * Td;
    } 
    // حالت ۳: کسر کار
    else {
        lambdaHours = 0;
        Td = Ts;
        Te = 0;

        const W = totalHours / Tm;
        S_base_paid = Si * W;
        Sa = 0;
        Se = 0;
        Sd = CONSTANTS.COEFF_SD * F1 * Si * Ts;
    }

    const totalPayable = S_base_paid + Sa + Se + Sd;

    return {
        S_base_paid: Math.round(S_base_paid),
        Sa: Math.round(Sa),
        Se: Math.round(Se),
        Sd: Math.round(Sd),
        totalPayable: Math.round(totalPayable),
        details: {
            totalHours,
            lambdaHours,
            Td,
            Te,
            overLimitWarning
        }
    };
}

// خروجی برای استفاده در app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateSiteSalary };
}
