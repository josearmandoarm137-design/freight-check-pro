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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      vs_employee_roles: {
        Row: {
          matricula: string
          role: string
        }
        Insert: {
          matricula: string
          role: string
        }
        Update: {
          matricula?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "vs_employee_roles_matricula_fkey"
            columns: ["matricula"]
            isOneToOne: true
            referencedRelation: "vs_employees"
            referencedColumns: ["matricula"]
          },
        ]
      }
      vs_employees: {
        Row: {
          matricula: string
          name: string
        }
        Insert: {
          matricula: string
          name: string
        }
        Update: {
          matricula?: string
          name?: string
        }
        Relationships: []
      }
      vs_occurrences: {
        Row: {
          checked_at: string | null
          clerk: string | null
          clerk_notes: string
          client: string
          condition: string
          conference_result: string
          created_at: string
          description: string
          divergence: string
          driver: string
          id: string
          invoice: string
          kind: string
          notes: string
          number: number
          occurred_on: string
          photos: Json
          plate: string
          product_sku: string
          quantity: number
          reason: string
          received: number | null
          route: string
          status: string
          transported: number
          unit_price: number
          vehicle: string
        }
        Insert: {
          checked_at?: string | null
          clerk?: string | null
          clerk_notes?: string
          client: string
          condition?: string
          conference_result?: string
          created_at?: string
          description?: string
          divergence?: string
          driver: string
          id?: string
          invoice?: string
          kind: string
          notes?: string
          number?: never
          occurred_on?: string
          photos?: Json
          plate: string
          product_sku: string
          quantity: number
          reason: string
          received?: number | null
          route: string
          status?: string
          transported: number
          unit_price: number
          vehicle: string
        }
        Update: {
          checked_at?: string | null
          clerk?: string | null
          clerk_notes?: string
          client?: string
          condition?: string
          conference_result?: string
          created_at?: string
          description?: string
          divergence?: string
          driver?: string
          id?: string
          invoice?: string
          kind?: string
          notes?: string
          number?: never
          occurred_on?: string
          photos?: Json
          plate?: string
          product_sku?: string
          quantity?: number
          reason?: string
          received?: number | null
          route?: string
          status?: string
          transported?: number
          unit_price?: number
          vehicle?: string
        }
        Relationships: [
          {
            foreignKeyName: "vs_occurrences_clerk_fkey"
            columns: ["clerk"]
            isOneToOne: false
            referencedRelation: "vs_employees"
            referencedColumns: ["matricula"]
          },
          {
            foreignKeyName: "vs_occurrences_driver_fkey"
            columns: ["driver"]
            isOneToOne: false
            referencedRelation: "vs_employees"
            referencedColumns: ["matricula"]
          },
          {
            foreignKeyName: "vs_occurrences_product_sku_fkey"
            columns: ["product_sku"]
            isOneToOne: false
            referencedRelation: "vs_products"
            referencedColumns: ["sku"]
          },
        ]
      }
      vs_products: {
        Row: {
          name: string
          price: number
          sku: string
        }
        Insert: {
          name: string
          price?: number
          sku: string
        }
        Update: {
          name?: string
          price?: number
          sku?: string
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
    Enums: {},
  },
} as const
