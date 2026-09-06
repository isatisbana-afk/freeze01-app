// K-CORE Independent Payroll Engine
function calculateSalary(baseSalary, envFactors, roleFactor) {
  // فرمول خطی مستقیم
  const productEnv = envFactors.reduce((acc, curr) => acc * curr, 1);
  const netPayable = baseSalary * productEnv * roleFactor;
  
  return {
    baseSalary: baseSalary,
    environmentalMultiplier: productEnv,
    roleFactor: roleFactor,
    netPayable: netPayable
  };
}

// مثال جهت تست
// const result = calculateSalary(10000000, [1.1, 1.05, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], 1.2);
