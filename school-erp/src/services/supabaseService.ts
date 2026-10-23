import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SupabaseApplication {
  id?: string;
  applicant_name: string;
  email: string;
  phone: string;
  target_class: string;
  stream: string;
  tenth_percentage?: number;
  roll_number?: string;
  previous_school?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  documents?: Record<string, string>;
  created_at?: string;
}

export interface SupabaseStudent {
  student_id?: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  grade: string;
  stream: string;
  section?: string;
  roll_no?: string;
  blood_group?: string;
  status: 'ENROLLED' | 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED' | string;
  attendance?: number;
  fees_status?: 'PAID' | 'PARTIAL' | 'DUE' | 'PENDING' | string;
  created_at?: string;
}

export interface SupabaseTeacher {
  teacher_id?: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: string;
  specialization?: string;
  designation?: string;
  qualification?: string;
  joining_date?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  created_at?: string;
}

export interface SupabasePayment {
  id?: string;
  receipt_no: string;
  student_id: string;
  student_name: string;
  grade: string;
  fee_type: string;
  amount: number;
  payment_method: 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'BANK_TRANSFER' | 'CASH_COUNTER' | 'CHEQUE' | string;
  reference_no: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payer_email?: string;
  payer_phone?: string;
  invoice_pdf?: string;
  pdf_url?: string;
  date?: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED' | string;
  created_at?: string;
}

export interface SupabaseFeeStructure {
  id?: string;
  name: string;
  grade: string;
  stream?: string;
  tuition_fee?: number;
  lab_fee?: number;
  exam_fee?: number;
  total_annual?: number;
  amount?: number;
  is_mandatory?: boolean;
  frequency?: string;
  due_date?: string;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  created_at?: string;
}


export const supabaseService = {
  // ----------------- ADMISSIONS / APPLICATIONS -----------------
  async getApplications(): Promise<SupabaseApplication[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async submitApplication(app: Omit<SupabaseApplication, 'id' | 'created_at'>): Promise<SupabaseApplication> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('admissions')
      .insert([app])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateApplicationStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<void> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('admissions')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  // ----------------- STUDENTS -----------------
  async getStudents(): Promise<SupabaseStudent[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(s => ({
      ...s,
      name: `${s.first_name || ''} ${s.last_name || ''}`.trim()
    }));
  },

  async addStudent(student: Partial<SupabaseStudent>): Promise<SupabaseStudent> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStudent(id: string | number, student: Partial<SupabaseStudent>): Promise<SupabaseStudent> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('students')
      .update(student)
      .eq('student_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteStudent(id: string | number): Promise<void> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('student_id', id);

    if (error) throw error;
  },

  // ----------------- TEACHERS -----------------
  async getTeachers(): Promise<SupabaseTeacher[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(t => ({
      ...t,
      name: `${t.first_name || ''} ${t.last_name || ''}`.trim()
    }));
  },

  async addTeacher(teacher: Partial<SupabaseTeacher>): Promise<SupabaseTeacher> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('teachers')
      .insert([teacher])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTeacher(id: string | number, teacher: Partial<SupabaseTeacher>): Promise<SupabaseTeacher> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('teachers')
      .update(teacher)
      .eq('teacher_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTeacher(id: string | number): Promise<void> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('teacher_id', id);

    if (error) throw error;
  },

  // ----------------- PAYMENTS & TRANSACTIONS -----------------
  async getPayments(): Promise<SupabasePayment[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching payments from Supabase:', error.message);
      return [];
    }
    return data || [];
  },

  async recordPayment(payment: SupabasePayment): Promise<SupabasePayment> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const paymentToInsert = {
      ...payment,
      id: payment.id || `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentToInsert])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ----------------- FEE STRUCTURES -----------------
  async getFeeStructures(): Promise<SupabaseFeeStructure[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('fee_structures')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching fee_structures from Supabase:', error.message);
      return [];
    }
    return data || [];
  },

  async createFeeStructure(fee: Partial<SupabaseFeeStructure>): Promise<SupabaseFeeStructure> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const feeToInsert = {
      ...fee,
      id: fee.id || `FEE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    const { data, error } = await supabase
      .from('fee_structures')
      .insert([feeToInsert])
      .select()
      .single();


    if (error) throw error;
    return data;
  },

  async updateFeeStructure(id: string, fee: Partial<SupabaseFeeStructure>): Promise<SupabaseFeeStructure> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('fee_structures')
      .update(fee)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFeeStructure(id: string): Promise<void> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('fee_structures')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

