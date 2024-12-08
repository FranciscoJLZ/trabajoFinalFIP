import * as fs from "fs";
import { Sucursal } from "../models/Sucursal";
import { Proveedor } from "../models/Proveedor";
import { Cliente } from "../models/Cliente";
import { Mascota } from "../models/Mascota";

/**
 * Clase utilitaria para centralizar todas las
 * operaciones con la base de datos simulada.
 */

export class Archivo {
  private static readonly carpeta = "src/db";

  private static readonly diccionario = {
    sucursal: {
      tabla: "sucursales.txt",
      encabezado: "Nombre,Numero,ID",
      constructor: Sucursal,
      tipos: {
        id: "string",
        nombre: "string",
        numero: "number",
      },
    },
    proveedor: {
      tabla: "proveedores.txt",
      encabezado: "Nombre,Telefono,ID",
      constructor: Proveedor,
      tipos: {
        id: "string",
        nombre: "string",
        telefono: "number",
      },
    },
    cliente: {
      tabla: "clientes.txt",
      encabezado: "Nombre,Telefono,ID,Visitas,VIP",
      constructor: Cliente,
      tipos: {
        id: "string",
        nombre: "string",
        telefono: "number",
        visitas: "number",
        vip: "string",
      },
    },
    mascota: {
      tabla: "mascotass.txt",
      encabezado: "Nombre,Especie,ID",
      constructor: Mascota,
      tipos: {
        id: "string",
        nombre: "string",
        especie: "string",
      },
    },
  };
  // Se modifica el acceso al contructor a privado
  // con el fin de bloquear cualquier instancia de la clase.
  private constructor() {}

  /**
   *
   * @param tipo
   * @param entidad
   */
  public static guardar(
    tipo: "sucursal" | "proveedor" | "cliente" | "mascota",
    entidad: any
  ) {
    const ruta = `${Archivo.carpeta}/${Archivo.diccionario[tipo].tabla}`;

    if (!fs.existsSync(ruta)) {
      Archivo.crear(ruta, Archivo.diccionario[tipo].encabezado);
    }

    // Transformar clase en formato CSV
    const registro = Archivo.convertirCSV(entidad, tipo);

    fs.appendFile(ruta, `\n${registro}`, (error) => {
      if (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
      }
    });
  }

  public static leer(tipo: "sucursal" | "proveedor" | "cliente" | "mascota") {
    // Armar ruta
    const ruta = `${Archivo.carpeta}/${Archivo.diccionario[tipo].tabla}`;
    // Chequear si existe el archivo
    if (!fs.existsSync(ruta)) {
      Archivo.crear(ruta, Archivo.diccionario[tipo].encabezado);
    }
    // Obtener constructor
    const Constructor = Archivo.diccionario[tipo].constructor as new (
      ...args: any[]
    ) => any;
    // Obtener tipos de datos
    const tipos = Archivo.diccionario[tipo].tipos as Record<string, string>;
    // Leer todo el archivo
    const data = fs.readFileSync(ruta, "utf-8");
    // Convertir archivo a array de filas y limpiar caracteres innecesarios
    const filas = data.split("\n").map((fila) => fila.trim());
    // Separar cada fila por la ","
    const matriz = filas.map((fila) => fila.split(","));
    // Generar columnas a partir del encabezado de cada entidad
    const columnas = Archivo.diccionario[tipo].encabezado
      .split(",")
      .map((columna) => columna.toLowerCase());
    // Mapear cada valor a una propiedad segun diccionario
    const resultados = matriz.slice(1).map((fila) => {
      const registro: Record<string, any> = {};
      columnas.forEach((columna, index) => {
        const valor = fila[index];
        const tipo = tipos[columna];
        registro[columna] = Archivo.convertirTipo(valor, tipo);
      });
      return new Constructor(...Object.values(registro));
    });
    // Chequear si hay filtro

    // Devolver resultados no filtrados
    return resultados;
  }

  /**
   *
   * @param ruta
   * @param encabezado
   */
  private static crear(ruta: string, encabezado: string) {
    // Chequear si existe la carpeta
    if (!fs.existsSync(Archivo.carpeta)) {
      // Si no, se crea
      fs.mkdirSync(Archivo.carpeta, { recursive: true });
    }

    // Crear tabla con encabezado que corresponda.
    fs.writeFile(ruta, encabezado, (error) => {
      if (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
      }
    });
  }

  /**
   *
   */
  private static convertirTipo(valor: string, tipo: string) {
    if (tipo === "number") {
      return isNaN(Number(valor)) ? 0 : Number(valor); // Conversión a número
    } else if (tipo === "boolean") {
      return valor.toLowerCase() === "true"; // Conversión a booleano
    } else {
      return valor || ""; // Dejar como string
    }
  }

  /**
   *
   * @param entidad
   * @returns
   */
  private static convertirCSV(
    entidad: any,
    tipo: "sucursal" | "proveedor" | "cliente" | "mascota"
  ) {
    // const propiedades = Object.keys(entidad);
    const propiedades = Archivo.diccionario[tipo].encabezado
      .split(",")
      .map((columna) => columna.toLowerCase());

    const fila = propiedades
      .map((propiedad) => {
        const valor = entidad[propiedad];

        return valor !== undefined && valor !== null ? String(valor) : "";
      })
      .join(",");

    return fila;
  }
}
