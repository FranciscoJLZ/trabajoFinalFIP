export type TEntidad = "cliente" | "mascota" | "sucursal" | "proveedor";
export type TPreguntas = {
  name: string;
  type: "input" | "number" | "confirmation" | "list";
  message: string;
  choices?: string[] | { name: string; value: string; disabled?: boolean }[];
};
