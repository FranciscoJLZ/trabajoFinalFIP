import { GeneradorID } from "./GeneradorID";
import { Sucursal } from "./Sucursal";

export class Proveedor {
  private id: string;
  private nombre: string;
  private telefono: number;

  constructor(nombre: string, telefono: number) {
    this.id = GeneradorID.instancia.generarID();
    this.nombre = nombre;
    this.telefono = telefono;
  }

  public getID() {
    return this.id;
  }

  public getNombre() {
    return this.nombre;
  }

  public getTelefono() {
    return this.telefono;
  }
}

export class Veterinaria {
  private sucursales: Sucursal[];
  private proveedores: Proveedor[];

  constructor() {
    this.sucursales = [];
    this.proveedores = [];
  }

  public verTodos(tipo: "sucursal" | "proveedor") {
    let resultado: { value: string; name: string }[];

    if (tipo === "sucursal") {
      resultado = this.sucursales.map((sucursal) => {
        return { value: sucursal.getID(), name: sucursal.getNombre() };
      });
    } else {
      resultado = this.proveedores.map((proveedor) => {
        return { value: proveedor.getID(), name: proveedor.getNombre() };
      });
    }
    return resultado;
  }

  public agregar(tipo: "sucursal" | "proveedor", obj: Sucursal | Proveedor) {
    if (tipo === "sucursal" && obj instanceof Sucursal) {
      const sucEncontrada = this.sucursales.find(
        (s) => s.getID() === obj.getID()
      );
      if (sucEncontrada) {
        return `La sucursal ${sucEncontrada.getID()} ya existe.`;
      }

      this.sucursales.push(obj);

      return obj;
    } else if (tipo === "proveedor" && obj instanceof Proveedor) {
      const provEncontrado = this.proveedores.find(
        (p) => p.getID() === obj.getID()
      );

      if (provEncontrado) {
        return `El proveedor ${provEncontrado.getID()} ya existe.`;
      }

      this.proveedores.push(obj);

      return obj;
    } else {
      return "ERROR. Debe indicar el tipo correcto de la entidad que esta creando.";
    }
  }

  public buscar(tipo: "sucursal" | "proveedor", id: string) {
    let result: Sucursal | Proveedor | null = null;
    if (tipo === "sucursal") {
      result = this.sucursales.find((s) => s.getID() === id) ?? null;
    }
    if (tipo === "proveedor") {
      result = this.proveedores.find((p) => p.getID() === id) ?? null;
    }

    return result;
  }
}
