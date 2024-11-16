import { GeneradorID } from "./GeneradorID";
import { Cliente } from "./Cliente";

export class Mascota {
  private ID: string;
  private nombre: string;
  private especie: "perro" | "gato" | "exotico";
  public constructor(nombre: string, especie: "perro" | "gato" | "exotico") {
    this.nombre = nombre;
    this.ID = "";
    this.especie = especie;
  }
  public getEspecie() {
    return this.especie;
  }
  public getID() {
    return this.ID;
  }
  public getNombre() {
    return this.nombre;
  }
  public asignarID(ClienteID: string) {
    return (this.ID = ClienteID);
  }
  public setEspecie(especie: "perro" | "gato" | "exotico") {
    return (this.especie = especie);
  }
  public setNombre(nombre: string) {
    return (this.nombre = nombre);
  }
}

/*Ejemplo de instancia 
(Aprobado)
let paciente0 = new Mascota("Charly","gato"); */
