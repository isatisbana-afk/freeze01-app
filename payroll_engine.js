// مرجع: سند Freeze01_Master_Architecture_Blueprint_v1.0 (بخش ۴)[span_3](start_span)[span_3](end_span)

export interface CalculationInput {  
  dailyBaseWage: number;   // مزد شغل روزانه
  n2: number;              // محیط کارگاهی[span_4](start_span)[span_4](end_span)
  n3: number;              // مسئولیت[span_5](start_span)[span_5](end_span)
  n4: number;              // سختی کار[span_6](start_span)[span_6](end_span)
  n5: number;              // پروژه‌محور[span_7](start_span)[span_7](end_span)
  n6: number;              // تخصصی[span_8](start_span)[span_8](end_span)
  n7: number;              // کارایی[span_9](start_span)[span_9](end_span)
  n8: number;              // ضریب منطقه (یزد = 1.365)[span_10](start_span)[span_10](end_span)
  workedHours: number;     // ساعات کارکرد واقعی[span_11](start_span)[span_11](end_span)
  requiredHours: number;   // ساعات موظفی[span_12](start_span)[span_12](end_span)
  overtimeHours: number;   // ساعات اضافه‌کاری[span_13](start_span)[span_13](end_span)
  holidayHours: number;    // ساعات تعطیل‌کاری[span_14](start_span)[span_14](end_span)
}  
  
export interface CalculationResult {  
  Bi: number;  
  K: number;  
  Si: number;  
  totalPay: number;  
  alert: 'RED' | 'ORANGE' | 'YELLOW' | 'BLUE' | 'GREEN';  
  alertMessage: string;  
}  
  
export function calculateFreeze01(input: CalculationInput): CalculationResult {  
  // ۱. پایه حقوق ماهانه: Bi = DailyBaseWage * 30.5[span_15](start_span)[span_15](end_span)
  const Bi = input.dailyBaseWage * 30.5;  
   
  // ۲. بررسی ضریب خالی (هشدار YELLOW)[span_16](start_span)[span_16](end_span)
  if ([input.n2, input.n3, input.n4, input.n5, input.n6, input.n7].some(n => n === undefined || n === null || n === 0)) {  
    return { 
      Bi, K: 0, Si: 0, totalPay: 0, 
      alert: 'YELLOW', 
      alertMessage: 'یکی از ضرایب هفت‌گانه ثبت نشده یا خالی است.' 
    };  
  }  
  
  // ۳. محاسبه ضریب جامع K و حقوق Freeze01 (Si)[span_17](start_span)[span_17](end_span)
  const K = input.n2 * input.n3 * input.n4 * input.n5 * input.n6 * input.n7 * (input.n8 || 1.365);  
  const Si = Bi * K;  
   
  // ۴. محاسبه اضافه‌کاری و تعطیل‌کاری[span_18](start_span)[span_18](end_span)
  const otPay = input.overtimeHours * (Bi / 176) * 1.4;  
  const holidayPay = input.holidayHours * (Bi / 176) * 1.5;  
  const totalPay = Si + otPay + holidayPay;  
  
  // ۵. ارزیابی هشدار قرمز (RED): Si < Bi[span_19](start_span)[span_19](end_span)
  if (Si < Bi) {  
    return { 
      Bi, K, Si, totalPay, 
      alert: 'RED', 
      alertMessage: 'خطای حقوق: حقوق محاسباتی Si کمتر از حقوق پایه Bi است.' 
    };  
  }  
  
  // ۶. ارزیابی هشدار نارنجی (ORANGE): کارکرد کمتر از موظفی[span_20](start_span)[span_20](end_span)
  if (input.workedHours < input.requiredHours) {  
    return { 
      Bi, K, Si, totalPay, 
      alert: 'ORANGE', 
      alertMessage: 'هشدار: کارکرد ثبت‌شده کمتر از ساعات موظفی ماهانه است.' 
    };  
  }  
  
  // ۷. ارزیابی هشدار آبی (BLUE): اضافه‌کاری بیش از ۶۰ ساعت[span_21](start_span)[span_21](end_span)
  if (input.overtimeHours > 60) {  
    return { 
      Bi, K, Si, totalPay, 
      alert: 'BLUE', 
      alertMessage: 'تذکر: ساعات اضافه‌کاری بیش از سقف استاندارد (۶۰ ساعت) است.' 
    };  
  }  
  
  // ۸. وضعیت سبز (GREEN): محاسبه نرمال و بدون مغایرت[span_22](start_span)[span_22](end_span)
  return { 
    Bi, K, Si, totalPay, 
    alert: 'GREEN', 
    alertMessage: 'وضعیت محاسبه نرمال و مورد تأیید است.' 
  };  
}
