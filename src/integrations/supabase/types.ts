export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_details: Json | null
          contract_url: string | null
          created_at: string
          currency: string | null
          dropoff_date: string
          dropoff_location: string | null
          id: string
          invoice_url: string | null
          nexi_transaction_id: string | null
          payment_completed_at: string | null
          payment_error_message: string | null
          payment_method: string | null
          payment_status: string | null
          pickup_date: string
          pickup_location: string
          price_total: number
          status: string
          updated_at: string
          user_id: string
          vehicle_image_url: string | null
          vehicle_name: string
          vehicle_type: string
        }
        Insert: {
          booking_details?: Json | null
          contract_url?: string | null
          created_at?: string
          currency?: string | null
          dropoff_date: string
          dropoff_location?: string | null
          id?: string
          invoice_url?: string | null
          nexi_transaction_id?: string | null
          payment_completed_at?: string | null
          payment_error_message?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_date: string
          pickup_location: string
          price_total: number
          status?: string
          updated_at?: string
          user_id: string
          vehicle_image_url?: string | null
          vehicle_name: string
          vehicle_type: string
        }
        Update: {
          booking_details?: Json | null
          contract_url?: string | null
          created_at?: string
          currency?: string | null
          dropoff_date?: string
          dropoff_location?: string | null
          id?: string
          invoice_url?: string | null
          nexi_transaction_id?: string | null
          payment_completed_at?: string | null
          payment_error_message?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_date?: string
          pickup_location?: string
          price_total?: number
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_image_url?: string | null
          vehicle_name?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          booking_id: string | null
          created_at: string
          document_type: string
          file_url: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          document_type: string
          file_url: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          id: string
          points_balance: number | null
          points_lifetime: number | null
          tier_benefits: Json | null
          tier_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          points_balance?: number | null
          points_lifetime?: number | null
          tier_benefits?: Json | null
          tier_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          points_balance?: number | null
          points_lifetime?: number | null
          tier_benefits?: Json | null
          tier_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          booking_reminders: boolean | null
          created_at: string
          email_notifications: boolean | null
          id: string
          marketing_emails: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_reminders?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_reminders?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last4: string | null
          created_at: string
          id: string
          is_default: boolean | null
          stripe_payment_method_id: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_payment_method_id: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_payment_method_id?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          completed_at: string | null
          created_at: string
          currency: string
          error_message: string | null
          id: string
          mac_verification_status: string | null
          nexi_auth_code: string | null
          nexi_response_code: string | null
          nexi_transaction_id: string | null
          payment_method: string
          payment_status: string
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          mac_verification_status?: string | null
          nexi_auth_code?: string | null
          nexi_response_code?: string | null
          nexi_transaction_id?: string | null
          payment_method?: string
          payment_status?: string
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          mac_verification_status?: string | null
          nexi_auth_code?: string | null
          nexi_response_code?: string | null
          nexi_transaction_id?: string | null
          payment_method?: string
          payment_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          billing_address: Json | null
          created_at: string
          digital_signature: string | null
          first_name: string | null
          id: string
          identity_documents: Json | null
          identity_verified: boolean | null
          last_name: string | null
          phone: string | null
          preferred_language: string | null
          profile_picture_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          digital_signature?: string | null
          first_name?: string | null
          id?: string
          identity_documents?: Json | null
          identity_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          preferred_language?: string | null
          profile_picture_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          digital_signature?: string | null
          first_name?: string | null
          id?: string
          identity_documents?: Json | null
          identity_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          preferred_language?: string | null
          profile_picture_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          confirmed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          reward_earned: number | null
          status: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          reward_earned?: number | null
          status?: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          reward_earned?: number | null
          status?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          messages: Json | null
          priority: string | null
          status: string
          subject: string
          ticket_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          messages?: Json | null
          priority?: string | null
          status?: string
          subject: string
          ticket_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          messages?: Json | null
          priority?: string | null
          status?: string
          subject?: string
          ticket_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          status: string
          stripe_payment_intent_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          status: string
          stripe_payment_intent_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
