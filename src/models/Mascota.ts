export class Mascota {
  private ID: string;
  private nombre: string;
  private especie: string[];
  private nuevaEspecie: string[];
  public constructor(nombre: string) {
    this.nombre = nombre;
    this.especie = ["Gato", "Perro", "Exótica"];
    this.nuevaEspecie = [];
    this.ID = "";
  }
  public getEspecie() {
    return this.especie;
  }
  public getID() {
    return this.ID;
  }
  public setEspecie(i: number) {
    this.nuevaEspecie.push(this.especie[i]);
  }
  public asignarID(ClienteID: string) {
    return (this.ID = ClienteID);
  }
}
