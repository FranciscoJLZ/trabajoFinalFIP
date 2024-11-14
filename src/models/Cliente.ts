import { GeneradorID } from "./GeneradorID";
import { Mascota } from "./Mascota";

export class Cliente {
  protected id: string;
  protected nombre: string;
  protected telefono: number;
  protected visitas: number;
  protected esVip: string;
  protected mascotas: Mascota[];

  public constructor(nombre: string, telefono: number) {
    this.id = GeneradorID.instancia.generarID();
    this.nombre = nombre;
    this.telefono = telefono;
    this.visitas = 0;
    this.esVip = "No";
    this.mascotas = [];
  }
  public getID() {
    return this.id;
  }
  public agregarVisita(): void {
    this.visitas = this.visitas + 1;
    if (this.visitas >= 5) {
      this.esVip = "Si";
    }
  }

  public agregarMascota(mascota: Mascota): void {
    this.mascotas.push(mascota);
    mascota.asignarID(this.id);
  }

  
  public bajaMascota(nombre: Mascota): void {
    this.mascotas = this.mascotas.filter((mascota) => mascota != nombre);
  }

  public modificarCliente(propiedadAModificar: string, valorNuevo: any) {
    if (propiedadAModificar == "nombre") {
      this.nombre = valorNuevo;
    } else {
      this.telefono = valorNuevo;
    }
  }
}
