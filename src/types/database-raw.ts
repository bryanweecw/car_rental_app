export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      client: {
        Row: {
          driving_license_number: string | null
          user_uid: string
        }
        Insert: {
          driving_license_number?: string | null
          user_uid: string
        }
        Update: {
          driving_license_number?: string | null
          user_uid?: string
        }
      }
      contact_page: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          message: string | null
          phone_number: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          message?: string | null
          phone_number?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          message?: string | null
          phone_number?: string | null
        }
      }
      fault_report: {
        Row: {
          comments: string | null
          fault_report_id: number
          hire_agreement_id: number | null
          isFaultFound: boolean | null
          staff_uid: string | null
        }
        Insert: {
          comments?: string | null
          fault_report_id: number
          hire_agreement_id?: number | null
          isFaultFound?: boolean | null
          staff_uid?: string | null
        }
        Update: {
          comments?: string | null
          fault_report_id?: number
          hire_agreement_id?: number | null
          isFaultFound?: boolean | null
          staff_uid?: string | null
        }
      }
      hire_agreement: {
        Row: {
          client_uid: string | null
          date_end: string | null
          date_start: string | null
          hire_agreement_id: number
          rental_cost: number | null
          staff_uid: string | null
          transaction_id: number | null
          vehicle_registration_number: string | null
        }
        Insert: {
          client_uid?: string | null
          date_end?: string | null
          date_start?: string | null
          hire_agreement_id?: number
          rental_cost?: number | null
          staff_uid?: string | null
          transaction_id?: number | null
          vehicle_registration_number?: string | null
        }
        Update: {
          client_uid?: string | null
          date_end?: string | null
          date_start?: string | null
          hire_agreement_id?: number
          rental_cost?: number | null
          staff_uid?: string | null
          transaction_id?: number | null
          vehicle_registration_number?: string | null
        }
      }
      outlet: {
        Row: {
          fax_number: string | null
          location: string | null
          outlet_id: number
          telephone_number: string | null
        }
        Insert: {
          fax_number?: string | null
          location?: string | null
          outlet_id: number
          telephone_number?: string | null
        }
        Update: {
          fax_number?: string | null
          location?: string | null
          outlet_id?: number
          telephone_number?: string | null
        }
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birthdate: string | null
          first_name: string | null
          gender: string | null
          issetup: boolean | null
          isstaff: boolean | null
          last_name: string | null
          phone_number: string | null
          updated_at: string | null
          user_uid: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birthdate?: string | null
          first_name?: string | null
          gender?: string | null
          issetup?: boolean | null
          isstaff?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_uid: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birthdate?: string | null
          first_name?: string | null
          gender?: string | null
          issetup?: boolean | null
          isstaff?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_uid?: string
        }
      }
      repair: {
        Row: {
          amount: number | null
          comments: string | null
          fault_report_id: number | null
          iscompleted: boolean | null
          repair_id: number
          transaction_id: number | null
        }
        Insert: {
          amount?: number | null
          comments?: string | null
          fault_report_id?: number | null
          iscompleted?: boolean | null
          repair_id: number
          transaction_id?: number | null
        }
        Update: {
          amount?: number | null
          comments?: string | null
          fault_report_id?: number | null
          iscompleted?: boolean | null
          repair_id?: number
          transaction_id?: number | null
        }
      }
      staff: {
        Row: {
          date_joined: string | null
          isemployed: boolean | null
          job_title: string | null
          national_insurance_number: number | null
          outlet_id: number | null
          salary: number | null
          user_uid: string
        }
        Insert: {
          date_joined?: string | null
          isemployed?: boolean | null
          job_title?: string | null
          national_insurance_number?: number | null
          outlet_id?: number | null
          salary?: number | null
          user_uid: string
        }
        Update: {
          date_joined?: string | null
          isemployed?: boolean | null
          job_title?: string | null
          national_insurance_number?: number | null
          outlet_id?: number | null
          salary?: number | null
          user_uid?: string
        }
      }
      transaction: {
        Row: {
          amount: number | null
          transaction_id: number
        }
        Insert: {
          amount?: number | null
          transaction_id?: number
        }
        Update: {
          amount?: number | null
          transaction_id?: number
        }
      }
      vehicle: {
        Row: {
          capacity: number | null
          color: string | null
          description: string | null
          engine_size: string | null
          hire_rate: number | null
          id: number | null
          imagealt: string | null
          imagesrc: string | null
          isactive: boolean | null
          isrented: boolean | null
          mileage: number | null
          mot_test_date: string | null
          outlet_id: number | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_registration_number: string
        }
        Insert: {
          capacity?: number | null
          color?: string | null
          description?: string | null
          engine_size?: string | null
          hire_rate?: number | null
          id?: number | null
          imagealt?: string | null
          imagesrc?: string | null
          isactive?: boolean | null
          isrented?: boolean | null
          mileage?: number | null
          mot_test_date?: string | null
          outlet_id?: number | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_registration_number: string
        }
        Update: {
          capacity?: number | null
          color?: string | null
          description?: string | null
          engine_size?: string | null
          hire_rate?: number | null
          id?: number | null
          imagealt?: string | null
          imagesrc?: string | null
          isactive?: boolean | null
          isrented?: boolean | null
          mileage?: number | null
          mot_test_date?: string | null
          outlet_id?: number | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_registration_number?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
