import { GeneradorID } from "../utils/GeneradorID";
import { Cliente } from "./Cliente";

export class Mascota {
  // Al manejar todo desde 1 solo punto, todas las entidades tienen q tener un id unico
  private idPropio: string;
  private nombre: string;
  private especie: "perro" | "gato" | "exotico";
  private idCliente: string;
  public constructor(nombre: string, especie: "perro" | "gato" | "exotico") {
    this.idPropio = GeneradorID.instancia.generarID();
    this.nombre = nombre;
    this.especie = especie;
    this.idCliente = "";
  }

  public setCliente(idCliente: string) {
    this.idCliente = idCliente
  }

  public getCliente(){
    return this.idCliente
  }
  
  public getEspecie() {
    return this.especie;
  }
  public getID() {
    return this.idPropio;
  }
  public getNombre() {
    return this.nombre;
  }

  public setEspecie(especie: "perro" | "gato" | "exotico") {
    this.especie = especie;
  }
  public setNombre(nombre: string) {
    this.nombre = nombre;
  }
}

/*Ejemplo de instancia 
(Aprobado)
let paciente0 = new Mascota("Charly","gato"); */
