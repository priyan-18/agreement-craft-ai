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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agreement_parties: {
        Row: {
          agreement_id: string
          id: string
          invited_at: string
          responded_at: string | null
          role: string
          status: string
          user_id: string
        }
        Insert: {
          agreement_id: string
          id?: string
          invited_at?: string
          responded_at?: string | null
          role: string
          status?: string
          user_id: string
        }
        Update: {
          agreement_id?: string
          id?: string
          invited_at?: string
          responded_at?: string | null
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agreement_parties_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "agreements"
            referencedColumns: ["id"]
          },
        ]
      }
      agreements: {
        Row: {
          content: string
          created_at: string
          creator_id: string
          form_data: Json
          id: string
          pdf_url: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          creator_id: string
          form_data?: Json
          id?: string
          pdf_url?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          creator_id?: string
          form_data?: Json
          id?: string
          pdf_url?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          agreement_id: string
          created_at: string
          details: Json
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          agreement_id: string
          created_at?: string
          details?: Json
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          agreement_id?: string
          created_at?: string
          details?: Json
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "agreements"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          mobile: string | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          mobile?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      signatures: {
        Row: {
          agreement_id: string
          id: string
          ip_address: unknown | null
          signature_data: Json
          signature_type: string
          signed_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          agreement_id: string
          id?: string
          ip_address?: unknown | null
          signature_data?: Json
          signature_type: string
          signed_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          agreement_id?: string
          id?: string
          ip_address?: unknown | null
          signature_data?: Json
          signature_type?: string
          signed_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signatures_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "agreements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_audit_log: {
        Args: {
          p_action: string
          p_agreement_id: string
          p_details?: Json
          p_ip_address?: unknown
          p_user_agent?: string
          p_user_id: string
        }
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
