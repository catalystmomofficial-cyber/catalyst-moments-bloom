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
      birth_ball_exercise_logs: {
        Row: {
          completed_at: string
          created_at: string
          duration_seconds: number | null
          exercise_id: string
          exercise_name: string
          id: string
          session_id: string | null
          trimester: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          duration_seconds?: number | null
          exercise_id: string
          exercise_name: string
          id?: string
          session_id?: string | null
          trimester?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          duration_seconds?: number | null
          exercise_id?: string
          exercise_name?: string
          id?: string
          session_id?: string | null
          trimester?: number | null
          user_id?: string
        }
        Relationships: []
      }
      birth_ball_reminders: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean
          reminder_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean
          reminder_time?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean
          reminder_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blog_analytics: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          session_id: string | null
          time_spent_seconds: number | null
          user_id: string | null
          view_date: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          session_id?: string | null
          time_spent_seconds?: number | null
          user_id?: string | null
          view_date?: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          session_id?: string | null
          time_spent_seconds?: number | null
          user_id?: string | null
          view_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_analytics_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          blog_id: string
          content: string
          created_at: string
          id: string
          is_approved: boolean
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          blog_id: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          scheduled_publish_at: string | null
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          scheduled_publish_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          scheduled_publish_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          group_slug: string
          id: string
          likes_count: number
          sub_category: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          group_slug?: string
          id?: string
          likes_count?: number
          sub_category?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          group_slug?: string
          id?: string
          likes_count?: number
          sub_category?: string
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
      custom_meal_plans: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          duration_days: number
          id: string
          is_active: boolean
          plan_data: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean
          plan_data: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean
          plan_data?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_reminders: {
        Row: {
          created_at: string
          days_of_week: number[] | null
          description: string | null
          exercise_id: string | null
          frequency: string
          goal_type: string | null
          id: string
          is_active: boolean
          monthly_day: number | null
          reminder_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[] | null
          description?: string | null
          exercise_id?: string | null
          frequency?: string
          goal_type?: string | null
          id?: string
          is_active?: boolean
          monthly_day?: number | null
          reminder_time?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[] | null
          description?: string | null
          exercise_id?: string | null
          frequency?: string
          goal_type?: string | null
          id?: string
          is_active?: boolean
          monthly_day?: number | null
          reminder_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_workout_programs: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          difficulty_level: string
          duration_weeks: number
          id: string
          is_active: boolean
          program_data: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty_level?: string
          duration_weeks?: number
          id?: string
          is_active?: boolean
          program_data: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty_level?: string
          duration_weeks?: number
          id?: string
          is_active?: boolean
          program_data?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          email: string
          event_date: string | null
          event_id: string
          event_time: string | null
          event_title: string
          experience: string | null
          first_name: string
          id: string
          last_name: string
          notification_pref: string | null
          phone: string | null
          questions: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_date?: string | null
          event_id: string
          event_time?: string | null
          event_title: string
          experience?: string | null
          first_name: string
          id?: string
          last_name: string
          notification_pref?: string | null
          phone?: string | null
          questions?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_date?: string | null
          event_id?: string
          event_time?: string | null
          event_title?: string
          experience?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notification_pref?: string | null
          phone?: string | null
          questions?: string | null
          user_id?: string | null
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
      lead_responses: {
        Row: {
          activity_level: string
          assessment_results: Json | null
          category_scores: Json | null
          created_at: string | null
          dietary_preferences: string
          email: string
          equipment: string
          id: string
          name: string
          overall_score: number | null
          primary_goal: string
          special_notes: string | null
          tier: string | null
          user_id: string | null
        }
        Insert: {
          activity_level: string
          assessment_results?: Json | null
          category_scores?: Json | null
          created_at?: string | null
          dietary_preferences: string
          email: string
          equipment: string
          id?: string
          name: string
          overall_score?: number | null
          primary_goal: string
          special_notes?: string | null
          tier?: string | null
          user_id?: string | null
        }
        Update: {
          activity_level?: string
          assessment_results?: Json | null
          category_scores?: Json | null
          created_at?: string | null
          dietary_preferences?: string
          email?: string
          equipment?: string
          id?: string
          name?: string
          overall_score?: number | null
          primary_goal?: string
          special_notes?: string | null
          tier?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      monthly_challenges: {
        Row: {
          badge_color: string | null
          badge_icon: string | null
          challenge_type: string
          created_at: string | null
          current_winners: number
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          max_winners: number
          motherhood_stage: string
          name: string
          start_date: string
          target_count: number
          updated_at: string | null
        }
        Insert: {
          badge_color?: string | null
          badge_icon?: string | null
          challenge_type?: string
          created_at?: string | null
          current_winners?: number
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          max_winners?: number
          motherhood_stage: string
          name: string
          start_date: string
          target_count?: number
          updated_at?: string | null
        }
        Update: {
          badge_color?: string | null
          badge_icon?: string | null
          challenge_type?: string
          created_at?: string | null
          current_winners?: number
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_winners?: number
          motherhood_stage?: string
          name?: string
          start_date?: string
          target_count?: number
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
      notification_preferences: {
        Row: {
          achievement_alerts_enabled: boolean
          created_at: string
          daily_reminders_enabled: boolean
          id: string
          reminder_time: string
          updated_at: string
          user_id: string
          weekly_summary_enabled: boolean
        }
        Insert: {
          achievement_alerts_enabled?: boolean
          created_at?: string
          daily_reminders_enabled?: boolean
          id?: string
          reminder_time?: string
          updated_at?: string
          user_id: string
          weekly_summary_enabled?: boolean
        }
        Update: {
          achievement_alerts_enabled?: boolean
          created_at?: string
          daily_reminders_enabled?: boolean
          id?: string
          reminder_time?: string
          updated_at?: string
          user_id?: string
          weekly_summary_enabled?: boolean
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
          approved: boolean
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          motherhood_stage: string | null
          referral_code: string | null
          referred_by_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          motherhood_stage?: string | null
          referral_code?: string | null
          referred_by_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          motherhood_stage?: string | null
          referral_code?: string | null
          referred_by_code?: string | null
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
      reminder_logs: {
        Row: {
          created_at: string
          id: string
          message: string | null
          reminder_id: string | null
          reminder_type: string
          sent_at: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          reminder_id?: string | null
          reminder_type: string
          sent_at?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          reminder_id?: string | null
          reminder_type?: string
          sent_at?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_logs_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "custom_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_change_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          current_stage: string | null
          id: string
          reason: string | null
          requested_stage: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          current_stage?: string | null
          id?: string
          reason?: string | null
          requested_stage: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          current_stage?: string | null
          id?: string
          reason?: string | null
          requested_stage?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
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
      user_achievements: {
        Row: {
          achievement_id: string
          achievement_type: string
          created_at: string
          description: string
          earned_at: string
          icon: string
          id: string
          level: number | null
          title: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          achievement_type?: string
          created_at?: string
          description: string
          earned_at?: string
          icon?: string
          id?: string
          level?: number | null
          title: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          achievement_type?: string
          created_at?: string
          description?: string
          earned_at?: string
          icon?: string
          id?: string
          level?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_challenge_progress: {
        Row: {
          awarded: boolean | null
          challenge_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_count: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          awarded?: boolean | null
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_count?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          awarded?: boolean | null
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_count?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "monthly_challenges"
            referencedColumns: ["id"]
          },
        ]
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
      add_purchased_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_source: string
          p_user_id: string
        }
        Returns: {
          new_total: number
          success: boolean
        }[]
      }
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
      admin_delete_blog: { Args: { blog_id: string }; Returns: undefined }
      admin_update_blog: {
        Args: {
          blog_author: string
          blog_content: string
          blog_excerpt: string
          blog_featured_image_url: string
          blog_id: string
          blog_slug: string
          blog_status: string
          blog_tags: string[]
          blog_title: string
        }
        Returns: undefined
      }
      approve_all_pending_affiliates: {
        Args: never
        Returns: {
          updated_count: number
        }[]
      }
      approve_user: { Args: { user_id_param: string }; Returns: undefined }
      award_challenge_badges: { Args: never; Returns: undefined }
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
      deduct_user_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_source: string
          p_user_id: string
        }
        Returns: {
          error_message: string
          remaining_points: number
          success: boolean
        }[]
      }
      get_affiliate_status: {
        Args: { user_id_param: string }
        Returns: {
          status: string
        }[]
      }
      get_all_affiliate_applications: {
        Args: never
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
      get_all_blogs: {
        Args: {
          page_number?: number
          page_size?: number
          search_query?: string
        }
        Returns: {
          author: string
          content: string
          created_at: string
          excerpt: string
          featured_image_url: string
          id: string
          published_at: string
          slug: string
          status: string
          tags: string[]
          title: string
          total_count: number
          updated_at: string
        }[]
      }
      get_all_users_with_points: {
        Args: never
        Returns: {
          created_at: string
          display_name: string
          email: string
          level: number
          total_points: number
          user_id: string
        }[]
      }
      get_blog_analytics_summary: {
        Args: { days_back?: number }
        Returns: {
          avg_time_spent: number
          blog_id: string
          blog_title: string
          total_views: number
          unique_visitors: number
        }[]
      }
      get_pending_stage_change_requests: {
        Args: never
        Returns: {
          created_at: string
          current_stage: string
          display_name: string
          email: string
          id: string
          reason: string
          requested_stage: string
          user_id: string
        }[]
      }
      get_pending_users: {
        Args: never
        Returns: {
          created_at: string
          display_name: string
          email: string
          motherhood_stage: string
          user_id: string
        }[]
      }
      get_user_credits: { Args: { p_user_id: string }; Returns: number }
      increment_challenge_progress: {
        Args: { p_challenge_type: string; p_user_id: string }
        Returns: undefined
      }
      is_admin: { Args: { user_id_param: string }; Returns: boolean }
      is_premium_user: { Args: never; Returns: boolean }
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
      request_stage_change: {
        Args: { p_reason?: string; p_requested_stage: string }
        Returns: string
      }
      review_stage_change: {
        Args: { p_decision: string; p_notes?: string; p_request_id: string }
        Returns: undefined
      }
      update_affiliate_status: {
        Args: { application_id: string; new_status: string }
        Returns: undefined
      }
      user_has_active_subscription: { Args: never; Returns: boolean }
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
