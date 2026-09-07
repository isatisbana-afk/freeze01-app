// منطبق بر ساختار اکسل M-100: n1 ضریب نقش، n2 تا n8 ضرایب محیطی

const ROLE_COEFFICIENTS = {
  S01: 1.00, S02: 1.05, S03: 1.10, S04: 1.18,
  S05: 1.25, S06: 1.35, S07: 1.45, S08: 1.60,
  S09: 1.75, S10: 1.90, S11: 2.10, S12: 2.30
};

function calculatePayroll() {
  const roleCode = document.getElementById('roleCode').value;
  const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
  const overtimeHours = parseFloat(document.getElementById('overtimeHours').value) || 0;

  // n1: ضریب رده شغلی
  const n1 = ROLE_COEFFICIENTS[roleCode] || 1.0;

  // محاسبه حاصلضرب ضرایب 7 گانه محیطی (n2 تا n8)
  const envInputs = document.querySelectorAll('.env-factor');
  let envProduct = 1;
  envInputs.forEach(input => {
    envProduct *= (parseFloat(input.value) || 1.0);
  });

  // حاصلضرب کل: n1 * (n2 * n3 * ... * n8)
  const totalMultiplier = n1 * envProduct;
  const netSalary = Math.round(baseSalary * totalMultiplier);
  const hourlyRate = Math.round(netSalary / 220);
  const overtimePayWorker = Math.round(overtimeHours * hourlyRate * 1.40);
  const overtimePayContractor = Math.round(overtimeHours * hourlyRate * 1.66);
  const totalWorker = netSalary + overtimePayWorker;
  const totalContractor = netSalary + overtimePayContractor;

  // نمایش در صفحه
  document.getElementById('resNetSalary').innerText = netSalary.toLocaleString('fa-IR');
  document.getElementById('resHourlyRate').innerText = hourlyRate.toLocaleString('fa-IR');
  document.getElementById('resOvertimeWorker').innerText = overtimePayWorker.toLocaleString('fa-IR');
  document.getElementById('resOvertimeContractor').innerText = overtimePayContractor.toLocaleString('fa-IR');
  document.getElementById('resTotalWorker').innerText = totalWorker.toLocaleString('fa-IR');
  document.getElementById('resTotalContractor').innerText = totalContractor.toLocaleString('fa-IR');

  return {
    roleCode, n1, baseSalary,
    envProduct: envProduct.toFixed(4),
    netSalary, hourlyRate, overtimeHours,
    overtimePayWorker, overtimePayContractor,
    totalWorker, totalContractor
  };
}

function exportToExcel() {
  const data = calculatePayroll();
  let csvContent = "\uFEFF";
  csvContent += "شاخص محاسباتی,مقدار / ریال\n";
  csvContent += `کد نقش شغلی,${data.roleCode}\n`;
  csvContent += `ضریب رده شغلی (n1),${data.n1}\n`;
  csvContent += `حقوق پایه مصوب (B_i),${data.baseSalary}\n`;
  csvContent += `حاصلضرب ضرایب محیطی (n2 تا n8),${data.envProduct}\n`;
  csvContent += `خالص دریافتی ماهانه,${data.netSalary}\n`;
  csvContent += `نرخ ساعتی پایه,${data.hourlyRate}\n`;
  csvContent += `ساعت اضافه کاری,${data.overtimeHours}\n`;
  csvContent += `اضافه کاری پرسنل (ضریب ۱.۴۰),${data.overtimePayWorker}\n`;
  csvContent += `اضافه کاری پیمانکار (ضریب ۱.۶۶),${data.overtimePayContractor}\n`;
  csvContent += `جمع کل دریافتی پرسنل,${data.totalWorker}\n`;
  csvContent += `جمع کل صورت وضعیت پیمانکار,${data.totalContractor}\n`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `KCORE_Payroll_${data.roleCode}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
