export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_checkins: {
        Row: {
          created_at: string
          date: string
          energy: number | null
          id: string
          mood: number | null
          plan_id: string | null
          reflection: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          energy?: number | null
          id?: string
          mood?: number | null
          plan_id?: string | null
          reflection?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy?: number | null
          id?: string
          mood?: number | null
          plan_id?: string | null
          reflection?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_checkins_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "user_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_progress: {
        Row: {
          date: string
          habits_completed: boolean[]
          id: string
          plan_id: string | null
          tasks_completed: boolean[]
          updated_at: string
          user_id: string
        }
        Insert: {
          date: string
          habits_completed?: boolean[]
          id?: string
          plan_id?: string | null
          tasks_completed?: boolean[]
          updated_at?: string
          user_id: string
        }
        Update: {
          date?: string
          habits_completed?: boolean[]
          id?: string
          plan_id?: string | null
          tasks_completed?: boolean[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "user_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_progress: {
        Row: {
          checked_habits: boolean[]
          id: string
          milestone_completed: boolean
          plan_id: string | null
          updated_at: string
          user_id: string
          week: number
        }
        Insert: {
          checked_habits: boolean[]
          id?: string
          milestone_completed?: boolean
          plan_id?: string | null
          updated_at?: string
          user_id: string
          week: number
        }
        Update: {
          checked_habits?: boolean[]
          id?: string
          milestone_completed?: boolean
          plan_id?: string | null
          updated_at?: string
          user_id?: string
          week?: number
        }
        Relationships: [
          {
            foreignKeyName: "habit_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "user_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_adaptations: {
        Row: {
          accepted: boolean | null
          adaptation_type: string
          created_at: string
          id: string
          plan_id: string | null
          suggestion: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted?: boolean | null
          adaptation_type: string
          created_at?: string
          id?: string
          plan_id?: string | null
          suggestion: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted?: boolean | null
          adaptation_type?: string
          created_at?: string
          id?: string
          plan_id?: string | null
          suggestion?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_adaptations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "user_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      reflections: {
        Row: {
          ai_response: Json | null
          created_at: string
          id: string
          plan_id: string | null
          reflection: string
          user_id: string
          week: number
        }
        Insert: {
          ai_response?: Json | null
          created_at?: string
          id?: string
          plan_id?: string | null
          reflection: string
          user_id: string
          week: number
        }
        Update: {
          ai_response?: Json | null
          created_at?: string
          id?: string
          plan_id?: string | null
          reflection?: string
          user_id?: string
          week?: number
        }
        Relationships: [
          {
            foreignKeyName: "reflections_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "user_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_insights: {
        Row: {
          created_at: string
          date: string
          id: string
          insight_text: string
          plan_id: string | null
          related_adaptation: string | null
          related_checkin: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          insight_text: string
          plan_id?: string | null
          related_adaptation?: string | null
          related_checkin?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          insight_text?: string
          plan_id?: string | null
          related_adaptation?: string | null
          related_checkin?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_insights_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "user_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_insights_related_adaptation_fkey"
            columns: ["related_adaptation"]
            isOneToOne: false
            referencedRelation: "plan_adaptations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_insights_related_checkin_fkey"
            columns: ["related_checkin"]
            isOneToOne: false
            referencedRelation: "daily_checkins"
            referencedColumns: ["id"]
          },
        ]
      }
      user_plans: {
        Row: {
          created_at: string
          current_week_index: number
          goal: string
          id: string
          number_of_weeks: number
          plan: Json
          time_commitment: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_week_index?: number
          goal: string
          id?: string
          number_of_weeks?: number
          plan: Json
          time_commitment: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_week_index?: number
          goal?: string
          id?: string
          number_of_weeks?: number
          plan?: Json
          time_commitment?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
