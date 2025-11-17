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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          descripcion: string | null
          estado: Database["public"]["Enums"]["activity_status"] | null
          fecha_fin: string
          fecha_inicio: string
          id: string
          id_parcela: string
          nombre: string
          tipo: Database["public"]["Enums"]["activity_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["activity_status"] | null
          fecha_fin: string
          fecha_inicio: string
          id?: string
          id_parcela: string
          nombre: string
          tipo: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["activity_status"] | null
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          id_parcela?: string
          nombre?: string
          tipo?: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_id_parcela_fkey"
            columns: ["id_parcela"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_assignments: {
        Row: {
          asignado_en: string | null
          id: string
          id_actividad: string
          id_trabajador: string
        }
        Insert: {
          asignado_en?: string | null
          id?: string
          id_actividad: string
          id_trabajador: string
        }
        Update: {
          asignado_en?: string | null
          id?: string
          id_actividad?: string
          id_trabajador?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_assignments_id_actividad_fkey"
            columns: ["id_actividad"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_assignments_id_trabajador_fkey"
            columns: ["id_trabajador"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      plots: {
        Row: {
          created_at: string | null
          estado: Database["public"]["Enums"]["plot_status"]
          id: string
          nombre: string
          superficie: number
          tipo_cultivo: Database["public"]["Enums"]["crop_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["plot_status"]
          id?: string
          nombre: string
          superficie: number
          tipo_cultivo: Database["public"]["Enums"]["crop_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["plot_status"]
          id?: string
          nombre?: string
          superficie?: number
          tipo_cultivo?: Database["public"]["Enums"]["crop_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          correo: string
          created_at: string | null
          id: string
          is_active: boolean | null
          nombre: string
          rol: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          correo: string
          created_at?: string | null
          id: string
          is_active?: boolean | null
          nombre: string
          rol?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          correo?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          nombre?: string
          rol?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          cantidad: number
          created_at: string | null
          disponible: boolean | null
          id: string
          id_parcela: string | null
          nombre: string
          tipo: Database["public"]["Enums"]["resource_type"]
          updated_at: string | null
        }
        Insert: {
          cantidad: number
          created_at?: string | null
          disponible?: boolean | null
          id?: string
          id_parcela?: string | null
          nombre: string
          tipo: Database["public"]["Enums"]["resource_type"]
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string | null
          disponible?: boolean | null
          id?: string
          id_parcela?: string | null
          nombre?: string
          tipo?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_id_parcela_fkey"
            columns: ["id_parcela"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          activo: boolean | null
          created_at: string | null
          especialidad: string
          id: string
          id_usuario: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          especialidad: string
          id?: string
          id_usuario: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          especialidad?: string
          id?: string
          id_usuario?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workers_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      activity_status: "pendiente" | "en progreso" | "completada"
      activity_type:
        | "siembra"
        | "cosecha"
        | "fertilizacion"
        | "riego"
        | "fumigacion"
      crop_type: "maiz" | "trigo" | "soja" | "girasol" | "otro"
      plot_status: "sembrado" | "cosechado" | "en preparacion"
      resource_type:
        | "maquinaria"
        | "fertilizantes"
        | "semillas"
        | "herramientas"
      user_role: "admin" | "gestor" | "trabajador"
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
    Enums: {
      activity_status: ["pendiente", "en progreso", "completada"],
      activity_type: [
        "siembra",
        "cosecha",
        "fertilizacion",
        "riego",
        "fumigacion",
      ],
      crop_type: ["maiz", "trigo", "soja", "girasol", "otro"],
      plot_status: ["sembrado", "cosechado", "en preparacion"],
      resource_type: [
        "maquinaria",
        "fertilizantes",
        "semillas",
        "herramientas",
      ],
      user_role: ["admin", "gestor", "trabajador"],
    },
  },
} as const
