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

// تابع محاسبه خودکار Si
function calculateSi(Bi, roleCode, envFactors = [1, 1, 1, 1, 1, 1, 1]) {
    const role = JOB_ROLES[roleCode];
    const n1 = role ? role.n1 : 1.00;
    
    // حاصل‌ضرب ضرایب محیطی (n2 * n3 * ... * n8)
    const envProduct = envFactors.reduce((acc, val) => acc * val, 1);
    
    // فرمول اصلی: Si = Bi * n1 * envProduct
    return Bi * n1 * envProduct;
}
