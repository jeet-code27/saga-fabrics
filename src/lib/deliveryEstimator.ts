export interface DeliveryEstimate {
  isValid: boolean;
  minDays: number;
  maxDays: number;
  dateRangeText: string;
  courierPartners: string;
  dispatchNotice: string;
  region: string;
}

export function getDeliveryEstimate(pincode: string): DeliveryEstimate {
  const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
  if (cleanPin.length !== 6) {
    return {
      isValid: false,
      minDays: 5,
      maxDays: 7,
      dateRangeText: '',
      courierPartners: 'Bluedart / Delhivery / DTDC Express',
      dispatchNotice: 'Dispatched within 24–48 hours directly from Jaipur Atelier',
      region: 'India',
    };
  }

  const prefix = cleanPin.substring(0, 2);
  let minDays = 5;
  let maxDays = 7;
  let region = 'Pan-India Express';

  // 30-34: Rajasthan (Atelier home state)
  if (['30', '31', '32', '33', '34'].includes(prefix)) {
    minDays = 3;
    maxDays = 5;
    region = 'Rajasthan (Direct Atelier Dispatch)';
  }
  // 11, 12, 13, 20: Delhi NCR, Haryana, UP West
  else if (['11', '12', '13', '20'].includes(prefix)) {
    minDays = 4;
    maxDays = 6;
    region = 'Delhi NCR & North Express Zone';
  }
  // 78-79 (NE), 19 (J&K), 74 (Andaman/Islands)
  else if (['78', '79', '19', '74'].includes(prefix)) {
    minDays = 7;
    maxDays = 9;
    region = 'Special Air Delivery Zone';
  } else {
    // All other states & metros (Mumbai, Pune, Bangalore, Kolkata, Hyderabad, Chennai, Gujarat, etc.)
    minDays = 5;
    maxDays = 7;
    region = 'Metro & Pan-India Express';
  }

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() + minDays);

  const endDate = new Date(now);
  endDate.setDate(now.getDate() + maxDays);

  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };

  const startStr = startDate.toLocaleDateString('en-IN', formatOptions);
  const endStr = endDate.toLocaleDateString('en-IN', formatOptions);

  return {
    isValid: true,
    minDays,
    maxDays,
    dateRangeText: `${startStr} – ${endStr}`,
    courierPartners: 'Delhivery / Bluedart / XpressBees Express',
    dispatchNotice: 'Dispatched within 24–48 hours directly from Jaipur Atelier',
    region,
  };
}
