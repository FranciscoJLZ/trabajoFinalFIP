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

  // Aca estamos esperando por parametro un string para luego agregarlo a un array que esta
  // declarado para guardar objetos de tipo Mascota, entonces por parametro tendrias
  // que esperar un objeto de tipo Mascota.
  // Tambien, al solo efecto de hacer mas robusto el codigo, agregaria un chequeo de que
  // el objeto a agregar ya no este agregado.
  public agregarMascota(mascota: string): void {
    this.mascotas.push(mascota);
  }

  // Aca pasa lo mismo, estas tratando a mascota como si fuera de tipo string, y es
  // de tipo Mascota.
  // Despues de eso, deberias acceder a un metodo getter de mascota para comparar
  // con el parametro que vas a utilizar para filtrar, por ejemplo:
  // this.mascotas.filter((mascota) => mascota.getNombre() !=== nombre)
  // Tambien comprar por nombre puede ser problematico, en caso de que un cliente
  // tenga dos mascotas que se llamen iguales. Le sugeri a FZ que agregue un id unico
  // a la clase Mascota para este tipo de casos.
  public bajaMascota(nombre: string): void {
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
