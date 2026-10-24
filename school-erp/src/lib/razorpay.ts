import { api } from '../api/axios';

// Razorpay Client SDK Utility for RIPS School ERP
export const RAZORPAY_KEY_ID = 
  import.meta.env.VITE_RAZORPAY_KEY_ID || 
  import.meta.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 
  'rzp_test_TrL8dHIIzl9UKI';

export interface RazorpayOptions {
  amount: number; // in INR (Rupees)
  description: string;
  studentId?: string;
  studentName?: string;
  email?: string;
  phone?: string;
  feeType?: string;
  orderId?: string;
  notes?: Record<string, string>;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Ensures Razorpay Checkout script is loaded into the DOM.
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Opens Razorpay Standard Checkout popup.
 * Resolves with payment details on success, rejects on user dismiss or error.
 */
export const initiateRazorpayPayment = async (
  options: RazorpayOptions
): Promise<RazorpaySuccessResponse> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
  }

  // Attempt backend order creation if orderId is not pre-provided
  let generatedOrderId = options.orderId;
  if (!generatedOrderId) {
    try {
      const orderResp = await api.post('/payments/razorpay/create-order', {
        amount: options.amount,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      });
      if (orderResp.data && orderResp.data.orderId) {
        generatedOrderId = orderResp.data.orderId;
      }
    } catch (e) {
      // Backend order creation optional fallback
      console.warn('Backend order creation skipped, using direct checkout mode:', e);
    }
  }

  return new Promise((resolve, reject) => {
    const paymentOptions = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(options.amount * 100), // convert to paise
      currency: 'INR',
      name: 'Royal International Public School',
      description: options.description || 'Senior Secondary Fee Payment',
      image: 'https://cdn-icons-png.flaticon.com/512/3135/3135755.png', // school crest icon
      order_id: generatedOrderId || undefined,

      prefill: {
        name: options.studentName || 'Senior Secondary Student',
        email: options.email || 'student@rips.edu.in',
        contact: options.phone || '+919876543210'
      },
      notes: {
        school: 'Royal International Public School',
        student_id: options.studentId || 'N/A',
        student_name: options.studentName || 'Student',
        fee_type: options.feeType || 'Tuition Fee',
        ...(options.notes || {})
      },
      theme: {
        color: '#1E3A8A' // RIPS Brand Blue
      },
      modal: {
        ondismiss: () => {
          reject(new Error('PAYMENT_CANCELLED'));
        }
      },
      handler: (response: RazorpaySuccessResponse) => {
        if (!response.razorpay_payment_id) {
          reject(new Error('Payment failed - No payment ID received.'));
          return;
        }
        resolve(response);
      }
    };

    try {
      const rzpInstance = new window.Razorpay(paymentOptions);
      rzpInstance.on('payment.failed', function (resp: any) {
        console.error('Razorpay payment failed:', resp.error);
        reject(new Error(resp.error?.description || 'Payment transaction failed.'));
      });
      rzpInstance.open();
    } catch (err) {
      reject(err);
    }
  });
};
