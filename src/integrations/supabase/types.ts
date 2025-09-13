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
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: string | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: string | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: string | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_applications: {
        Row: {
          audience_size: string | null
          created_at: string
          email: string
          experience: string | null
          full_name: string
          id: string
          motivation: string
          social_media_handles: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audience_size?: string | null
          created_at?: string
          email: string
          experience?: string | null
          full_name: string
          id?: string
          motivation: string
          social_media_handles?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audience_size?: string | null
          created_at?: string
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          motivation?: string
          social_media_handles?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      course_content: {
        Row: {
          calories_target: number | null
          content_type: string
          created_at: string
          day_number: number
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          equipment_needed: string[] | null
          id: string
          image_url: string | null
          instructions: string | null
          is_premium: boolean
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
          week_id: string
        }
        Insert: {
          calories_target?: number | null
          content_type?: string
          created_at?: string
          day_number: number
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_premium?: boolean
          order_index?: number
          title: string
          updated_at?: string
          video_url?: string | null
          week_id: string
        }
        Update: {
          calories_target?: number | null
          content_type?: string
          created_at?: string
          day_number?: number
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_premium?: boolean
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_content_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "course_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      course_weeks: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          focus_areas: string[] | null
          id: string
          title: string
          updated_at: string
          week_number: number
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          title: string
          updated_at?: string
          week_number: number
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          title?: string
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_weeks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string | null
          difficulty_level: string
          duration_weeks: number
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string
          duration_weeks?: number
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string
          duration_weeks?: number
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      food_detection_logs: {
        Row: {
          calories: number | null
          confidence: number | null
          created_at: string | null
          detected_food: string | null
          id: string
          image_path: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          confidence?: number | null
          created_at?: string | null
          detected_food?: string | null
          id?: string
          image_path?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          confidence?: number | null
          created_at?: string | null
          detected_food?: string | null
          id?: string
          image_path?: string | null
          user_id?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          calories: number
          carbs: number | null
          created_at: string | null
          fat: number | null
          id: string
          name: string
          protein: number | null
          serving_size: string | null
          updated_at: string | null
        }
        Insert: {
          calories: number
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          id?: string
          name: string
          protein?: number | null
          serving_size?: string | null
          updated_at?: string | null
        }
        Update: {
          calories?: number
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          id?: string
          name?: string
          protein?: number | null
          serving_size?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          points: number
          source: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          points: number
          source: string
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          source?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_users: {
        Row: {
          created_at: string
          id: string
          is_premium: boolean
          subscription_end: string | null
          subscription_start: string | null
          subscription_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_premium?: boolean
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_premium?: boolean
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          motherhood_stage: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          motherhood_stage?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          motherhood_stage?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      "Strip balance": {
        Row: {
          attrs: Json | null
        }
        Insert: {
          attrs?: Json | null
        }
        Update: {
          attrs?: Json | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_content_completion: {
        Row: {
          completed_at: string
          content_id: string
          created_at: string
          id: string
          notes: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          content_id: string
          created_at?: string
          id?: string
          notes?: string | null
          rating?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          content_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_content_completion_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "course_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          current_day: number
          current_week: number
          id: string
          is_active: boolean
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          current_day?: number
          current_week?: number
          id?: string
          is_active?: boolean
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          current_day?: number
          current_week?: number
          id?: string
          is_active?: boolean
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string
          id: string
          level: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verification_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: number
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: never
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: never
          user_id?: string
        }
        Relationships: []
      }
      weekly_checkins: {
        Row: {
          chest_measurement: number | null
          created_at: string
          description: string | null
          glute_measurement: number | null
          hip_measurement: number | null
          id: string
          notes: string | null
          progress_image_url: string | null
          thigh_measurement: number | null
          updated_at: string
          upper_arm_measurement: number | null
          user_id: string
          waist_measurement: number | null
          week_date: string
          weight: number | null
        }
        Insert: {
          chest_measurement?: number | null
          created_at?: string
          description?: string | null
          glute_measurement?: number | null
          hip_measurement?: number | null
          id?: string
          notes?: string | null
          progress_image_url?: string | null
          thigh_measurement?: number | null
          updated_at?: string
          upper_arm_measurement?: number | null
          user_id: string
          waist_measurement?: number | null
          week_date: string
          weight?: number | null
        }
        Update: {
          chest_measurement?: number | null
          created_at?: string
          description?: string | null
          glute_measurement?: number | null
          hip_measurement?: number | null
          id?: string
          notes?: string | null
          progress_image_url?: string | null
          thigh_measurement?: number | null
          updated_at?: string
          upper_arm_measurement?: number | null
          user_id?: string
          waist_measurement?: number | null
          week_date?: string
          weight?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_points: {
        Args: {
          p_description?: string
          p_points: number
          p_source: string
          p_user_id: string
        }
        Returns: undefined
      }
      admin_adjust_user_points: {
        Args: {
          points_adjustment: number
          reason: string
          target_user_id: string
        }
        Returns: undefined
      }
      approve_all_pending_affiliates: {
        Args: Record<PropertyKey, never>
        Returns: {
          updated_count: number
        }[]
      }
      create_affiliate_application: {
        Args: {
          audience_size_param: string
          email_param: string
          experience_param: string
          full_name_param: string
          motivation_param: string
          social_media_param: string
        }
        Returns: undefined
      }
      get_affiliate_status: {
        Args: { user_id_param: string }
        Returns: {
          status: string
        }[]
      }
      get_all_affiliate_applications: {
        Args: Record<PropertyKey, never>
        Returns: {
          audience_size: string
          created_at: string
          email: string
          experience: string
          full_name: string
          id: string
          motivation: string
          social_media_handles: string
          status: string
          updated_at: string
          user_id: string
        }[]
      }
      get_all_users_with_points: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          display_name: string
          email: string
          level: number
          total_points: number
          user_id: string
        }[]
      }
      is_admin: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      is_premium_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          action_details?: string
          action_name: string
          target_user_id?: string
        }
        Returns: undefined
      }
      redeem_points_for_discount: {
        Args: {
          p_description?: string
          p_points_to_redeem: number
          p_user_id: string
        }
        Returns: {
          discount_percentage: number
          remaining_points: number
          success: boolean
        }[]
      }
      update_affiliate_status: {
        Args: { application_id: string; new_status: string }
        Returns: undefined
      }
      user_has_active_subscription: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
