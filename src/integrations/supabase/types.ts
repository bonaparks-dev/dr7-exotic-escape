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
      booking_line_items: {
        Row: {
          booking_id: string
          created_at: string
          currency: string
          description: string
          id: string
          item_type: string
          metadata: Json | null
          quantity: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          currency?: string
          description: string
          id?: string
          item_type: string
          metadata?: Json | null
          quantity?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          currency?: string
          description?: string
          id?: string
          item_type?: string
          metadata?: Json | null
          quantity?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          age_bucket: string | null
          booking_details: Json | null
          contract_url: string | null
          country_iso2: string | null
          created_at: string
          currency: string | null
          date_of_birth: string | null
          dropoff_date: string
          dropoff_location: string | null
          google_event_id: string | null
          id: string
          invoice_url: string | null
          license_file_url: string | null
          license_issue_date: string | null
          nexi_transaction_id: string | null
          payment_breakdown: Json | null
          payment_completed_at: string | null
          payment_error_message: string | null
          payment_method: string | null
          payment_status: string | null
          pickup_date: string
          pickup_location: string
          price_total: number
          refund_amount: number | null
          refund_status: string | null
          security_deposit_amount: number | null
          security_deposit_status: string | null
          status: string
          terms_accepted: boolean | null
          updated_at: string
          user_id: string
          vehicle_image_url: string | null
          vehicle_name: string
          vehicle_type: string
        }
        Insert: {
          age_bucket?: string | null
          booking_details?: Json | null
          contract_url?: string | null
          country_iso2?: string | null
          created_at?: string
          currency?: string | null
          date_of_birth?: string | null
          dropoff_date: string
          dropoff_location?: string | null
          google_event_id?: string | null
          id?: string
          invoice_url?: string | null
          license_file_url?: string | null
          license_issue_date?: string | null
          nexi_transaction_id?: string | null
          payment_breakdown?: Json | null
          payment_completed_at?: string | null
          payment_error_message?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_date: string
          pickup_location: string
          price_total: number
          refund_amount?: number | null
          refund_status?: string | null
          security_deposit_amount?: number | null
          security_deposit_status?: string | null
          status?: string
          terms_accepted?: boolean | null
          updated_at?: string
          user_id: string
          vehicle_image_url?: string | null
          vehicle_name: string
          vehicle_type: string
        }
        Update: {
          age_bucket?: string | null
          booking_details?: Json | null
          contract_url?: string | null
          country_iso2?: string | null
          created_at?: string
          currency?: string | null
          date_of_birth?: string | null
          dropoff_date?: string
          dropoff_location?: string | null
          google_event_id?: string | null
          id?: string
          invoice_url?: string | null
          license_file_url?: string | null
          license_issue_date?: string | null
          nexi_transaction_id?: string | null
          payment_breakdown?: Json | null
          payment_completed_at?: string | null
          payment_error_message?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_date?: string
          pickup_location?: string
          price_total?: number
          refund_amount?: number | null
          refund_status?: string | null
          security_deposit_amount?: number | null
          security_deposit_status?: string | null
          status?: string
          terms_accepted?: boolean | null
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
      google_reviews_cache: {
        Row: {
          author_name: string
          created_at: string
          id: string
          language: string | null
          profile_photo_url: string | null
          rating: number
          relative_time: string | null
          review_id: string
          text: string | null
          time: number | null
          updated_at: string
        }
        Insert: {
          author_name: string
          created_at?: string
          id?: string
          language?: string | null
          profile_photo_url?: string | null
          rating: number
          relative_time?: string | null
          review_id: string
          text?: string | null
          time?: number | null
          updated_at?: string
        }
        Update: {
          author_name?: string
          created_at?: string
          id?: string
          language?: string | null
          profile_photo_url?: string | null
          rating?: number
          relative_time?: string | null
          review_id?: string
          text?: string | null
          time?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      google_reviews_config: {
        Row: {
          auto_rotate_interval: number | null
          created_at: string
          id: string
          last_fetch: string | null
          max_reviews: number | null
          min_rating: number | null
          place_id: string
          updated_at: string
        }
        Insert: {
          auto_rotate_interval?: number | null
          created_at?: string
          id?: string
          last_fetch?: string | null
          max_reviews?: number | null
          min_rating?: number | null
          place_id: string
          updated_at?: string
        }
        Update: {
          auto_rotate_interval?: number | null
          created_at?: string
          id?: string
          last_fetch?: string | null
          max_reviews?: number | null
          min_rating?: number | null
          place_id?: string
          updated_at?: string
        }
        Relationships: []
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
      payment_audit_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          amount: number | null
          booking_id: string
          created_at: string
          currency: string | null
          gateway_response: Json | null
          id: string
          ip_address: unknown | null
          payment_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          amount?: number | null
          booking_id: string
          created_at?: string
          currency?: string | null
          gateway_response?: Json | null
          id?: string
          ip_address?: unknown | null
          payment_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          amount?: number | null
          booking_id?: string
          created_at?: string
          currency?: string | null
          gateway_response?: Json | null
          id?: string
          ip_address?: unknown | null
          payment_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      payment_config: {
        Row: {
          created_at: string | null
          enable_full_charge: boolean
          enable_security_deposit_preauth: boolean
          id: string
          max_retry_attempts: number | null
          nexi_environment: string | null
          security_deposit_amount: number | null
          updated_at: string | null
          verification_timeout_minutes: number | null
        }
        Insert: {
          created_at?: string | null
          enable_full_charge?: boolean
          enable_security_deposit_preauth?: boolean
          id?: string
          max_retry_attempts?: number | null
          nexi_environment?: string | null
          security_deposit_amount?: number | null
          updated_at?: string | null
          verification_timeout_minutes?: number | null
        }
        Update: {
          created_at?: string | null
          enable_full_charge?: boolean
          enable_security_deposit_preauth?: boolean
          id?: string
          max_retry_attempts?: number | null
          nexi_environment?: string | null
          security_deposit_amount?: number | null
          updated_at?: string | null
          verification_timeout_minutes?: number | null
        }
        Relationships: []
      }
      payment_configurations: {
        Row: {
          created_at: string
          enable_full_charge: boolean
          enable_security_deposit_preauth: boolean
          id: string
          security_deposit_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enable_full_charge?: boolean
          enable_security_deposit_preauth?: boolean
          id?: string
          security_deposit_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enable_full_charge?: boolean
          enable_security_deposit_preauth?: boolean
          id?: string
          security_deposit_amount?: number | null
          updated_at?: string
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
          captured_amount: number | null
          completed_at: string | null
          created_at: string
          currency: string
          error_message: string | null
          gateway_fees: number | null
          gateway_transaction_time: string | null
          id: string
          line_items: Json | null
          mac_verification_status: string | null
          nexi_auth_code: string | null
          nexi_response_code: string | null
          nexi_transaction_id: string | null
          payer_email: string | null
          payer_name: string | null
          payment_method: string
          payment_status: string
          refund_status: string | null
          risk_flags: Json | null
          three_ds_status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          captured_amount?: number | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          gateway_fees?: number | null
          gateway_transaction_time?: string | null
          id?: string
          line_items?: Json | null
          mac_verification_status?: string | null
          nexi_auth_code?: string | null
          nexi_response_code?: string | null
          nexi_transaction_id?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payment_method?: string
          payment_status?: string
          refund_status?: string | null
          risk_flags?: Json | null
          three_ds_status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          captured_amount?: number | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          gateway_fees?: number | null
          gateway_transaction_time?: string | null
          id?: string
          line_items?: Json | null
          mac_verification_status?: string | null
          nexi_auth_code?: string | null
          nexi_response_code?: string | null
          nexi_transaction_id?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payment_method?: string
          payment_status?: string
          refund_status?: string | null
          risk_flags?: Json | null
          three_ds_status?: string | null
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
      refund_requests: {
        Row: {
          admin_notes: string | null
          booking_id: string
          created_at: string | null
          currency: string
          id: string
          nexi_refund_id: string | null
          nexi_response: Json | null
          payment_id: string
          processed_at: string | null
          processed_by: string | null
          reason: string
          requested_amount: number
          requested_by: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          booking_id: string
          created_at?: string | null
          currency?: string
          id?: string
          nexi_refund_id?: string | null
          nexi_response?: Json | null
          payment_id: string
          processed_at?: string | null
          processed_by?: string | null
          reason: string
          requested_amount: number
          requested_by?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          booking_id?: string
          created_at?: string | null
          currency?: string
          id?: string
          nexi_refund_id?: string | null
          nexi_response?: Json | null
          payment_id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string
          requested_amount?: number
          requested_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "refund_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          admin_notes: string | null
          amount: number
          booking_id: string
          created_at: string
          currency: string
          error_message: string | null
          id: string
          nexi_refund_id: string | null
          payment_id: string | null
          processed_at: string | null
          reason: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          booking_id: string
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          nexi_refund_id?: string | null
          payment_id?: string | null
          processed_at?: string | null
          reason?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          nexi_refund_id?: string | null
          payment_id?: string | null
          processed_at?: string | null
          reason?: string | null
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
      calculate_booking_total: {
        Args: {
          base_price_cents: number
          days: number
          extras: Json
          insurance_type: string
        }
        Returns: number
      }
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
