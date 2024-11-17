import { GeneradorID } from "../utils/GeneradorID";

export class Proveedor {
  private id: string;
  private nombre: string;
  private telefono: number;
  //-----
  public constructor(Nombre: string, Telefono: number) {
    this.id = GeneradorID.instancia.generarID();
    this.nombre = Nombre;
    this.telefono = Telefono;
  }
  //----
  getID() {
    return this.id;
  }
  getNombre() {
    return this.nombre;
  }
  getTelefono() {
    return this.telefono;
  }
  //----
  setNombre(nombre: string) {
    this.nombre = nombre;
  }
  setTelefono(telefono: number) {
    this.telefono = telefono;
  }
  //Avisar en caso de requerir algún metodo----
}
