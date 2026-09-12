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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          bucket: string | null
          created_at: string
          id: string
          ip: string | null
          metadata: Json
          target: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          bucket?: string | null
          created_at?: string
          id?: string
          ip?: string | null
          metadata?: Json
          target: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          bucket?: string | null
          created_at?: string
          id?: string
          ip?: string | null
          metadata?: Json
          target?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      before_after_cases: {
        Row: {
          after_path: string
          before_path: string
          caption: string | null
          city: string | null
          created_at: string
          doctor_id: string | null
          i18n: Json
          id: string
          months_after: number | null
          procedure: string | null
          status: string
          title: string
        }
        Insert: {
          after_path: string
          before_path: string
          caption?: string | null
          city?: string | null
          created_at?: string
          doctor_id?: string | null
          i18n?: Json
          id?: string
          months_after?: number | null
          procedure?: string | null
          status?: string
          title: string
        }
        Update: {
          after_path?: string
          before_path?: string
          caption?: string | null
          city?: string | null
          created_at?: string
          doctor_id?: string | null
          i18n?: Json
          id?: string
          months_after?: number | null
          procedure?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "before_after_cases_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          area_en: string | null
          area_zh: string | null
          city_slug: string
          created_at: string
          description_en: string | null
          description_zh: string | null
          hidden: boolean
          id: string
          is_public: boolean
          name_en: string
          name_zh: string
          photo_gallery: Json | null
          photo_path: string | null
          static_slug: string | null
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          area_en?: string | null
          area_zh?: string | null
          city_slug: string
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          hidden?: boolean
          id?: string
          is_public?: boolean
          name_en?: string
          name_zh?: string
          photo_gallery?: Json | null
          photo_path?: string | null
          static_slug?: string | null
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          area_en?: string | null
          area_zh?: string | null
          city_slug?: string
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          hidden?: boolean
          id?: string
          is_public?: boolean
          name_en?: string
          name_zh?: string
          photo_gallery?: Json | null
          photo_path?: string | null
          static_slug?: string | null
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      doctors: {
        Row: {
          bio: string
          city: string
          created_at: string
          credentials: string | null
          hospital: string
          i18n: Json
          id: string
          languages: string | null
          name: string
          photo_path: string | null
          specialties: string[]
          status: string
          title: string
        }
        Insert: {
          bio: string
          city: string
          created_at?: string
          credentials?: string | null
          hospital: string
          i18n?: Json
          id?: string
          languages?: string | null
          name: string
          photo_path?: string | null
          specialties?: string[]
          status?: string
          title: string
        }
        Update: {
          bio?: string
          city?: string
          created_at?: string
          credentials?: string | null
          hospital?: string
          i18n?: Json
          id?: string
          languages?: string | null
          name?: string
          photo_path?: string | null
          specialties?: string[]
          status?: string
          title?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          city: string | null
          contact_method: string
          country: string
          created_at: string
          email: string | null
          expert_name: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          phone_prefix: string | null
          preferred_slot: string | null
          procedure: string
          source: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          contact_method: string
          country: string
          created_at?: string
          email?: string | null
          expert_name?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          phone_prefix?: string | null
          preferred_slot?: string | null
          procedure: string
          source?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          contact_method?: string
          country?: string
          created_at?: string
          email?: string | null
          expert_name?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          phone_prefix?: string | null
          preferred_slot?: string | null
          procedure?: string
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_alert_outbox: {
        Row: {
          body: string
          created_at: string
          finding_count: number
          id: string
          kind: string
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          body: string
          created_at?: string
          finding_count?: number
          id?: string
          kind: string
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          body?: string
          created_at?: string
          finding_count?: number
          id?: string
          kind?: string
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      security_watchdog_findings: {
        Row: {
          check_key: string
          created_at: string
          detail: string
          id: string
          object_name: string
          run_id: string
          severity: string
        }
        Insert: {
          check_key: string
          created_at?: string
          detail: string
          id?: string
          object_name: string
          run_id: string
          severity: string
        }
        Update: {
          check_key?: string
          created_at?: string
          detail?: string
          id?: string
          object_name?: string
          run_id?: string
          severity?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          caption: string | null
          city: string | null
          cover_path: string | null
          created_at: string
          doctor_id: string | null
          i18n: Json
          id: string
          procedure: string | null
          status: string
          storage_path: string
          title: string
        }
        Insert: {
          caption?: string | null
          city?: string | null
          cover_path?: string | null
          created_at?: string
          doctor_id?: string | null
          i18n?: Json
          id?: string
          procedure?: string | null
          status?: string
          storage_path: string
          title: string
        }
        Update: {
          caption?: string | null
          city?: string | null
          cover_path?: string | null
          created_at?: string
          doctor_id?: string | null
          i18n?: Json
          id?: string
          procedure?: string | null
          status?: string
          storage_path?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      enqueue_weekly_security_summary: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      run_security_watchdog: { Args: never; Returns: string }
      valid_clinic_photo_gallery: { Args: { gallery: Json }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
