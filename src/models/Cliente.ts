import { GeneradorID } from "../utils/GeneradorID";
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
    // JOSE: Inicio visita en 1 porque entiendo que si se da
    // de alta el cliente en sistema es porque visito la Veterinaria.
    this.visitas = 1;
    this.esVip = "No";
    this.mascotas = [];
  }
  public getID() {
    return this.id;
  }
  // JOSE: Agrego getter de nombre, para leerlo desde la clase veterinaria
  public getNombre() {
    return this.nombre;
  }
  // JOSE: Agrego getter de mascotas, para leerlo desde la clase veterinaria
  public getMascotas() {
    return this.mascotas;
  }
  public agregarVisita(): void {
    this.visitas = this.visitas + 1;
    if (this.visitas >= 5) {
      this.esVip = "Si";
    }
  }

  setTelefono(telefono: number) {
    return (this.telefono = telefono);
  }

  setNombre(nombre: string) {
    return (this.nombre = nombre);
  }

  public agregarMascota(mascota: Mascota): void {
    this.mascotas.push(mascota);
    mascota.setCliente(this.id);
  }

  public modificarMascota(
    datoMascota: string,
    valorNuevo: any,
    mascota: Mascota
  ) {
    datoMascota.toLowerCase();
    if (datoMascota == "nombre") {
      mascota.setNombre(valorNuevo);
    } else if (datoMascota == "especie") {
      mascota.setEspecie(valorNuevo);
    } else {
      return console.log("el dato ingresado es invalido");
    }
  }

  public bajaMascota(nombre: Mascota): void {
    this.mascotas = this.mascotas.filter((mascota) => mascota != nombre);
  }
}
