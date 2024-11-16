import { GeneradorID } from "./GeneradorID";
import { Cliente } from "./Cliente";
import { Mascota } from "./Mascota";
import { AnyARecord } from "dns";
import { stringify } from "querystring";

export class Sucursal {
  private listaClientes: Cliente[];
  private nombre: string;
  private numero: number;
  private IDSucursal: string;
  public constructor(nombre: string, numero: number) {
    this.nombre = nombre;
    this.numero = numero;
    this.IDSucursal = GeneradorID.instancia.generarID();
    this.listaClientes = [];
  }
  //getters----
  public getNombre(): string {
    return this.nombre;
  }
  public getNumero(): number {
    return this.numero;
  }
  public getID() {
    return this.IDSucursal;
  }
  // JOSE: Agrego getter de clientes, para leerlos desde la clase veterinaria
  public getClientes() {
    return this.listaClientes;
  }
  //methods----
  public agregarCliente(nuevoCliente: Cliente) {
    this.listaClientes.push(nuevoCliente);
  }
  public eliminarCliente(bajaClinete: Cliente) {
    const iCliente = this.listaClientes.findIndex(
      (Cliente) => Cliente.getID() === bajaClinete.getID()
    );
  }

  public modificarDatos(
    datoCliente: string,
    valorNuevo: any,
    cliente: Cliente
  ) {
    datoCliente.toLowerCase();
    if (datoCliente == "nombre") {
      cliente.setNombre(valorNuevo);
    } else if (datoCliente == "telefono") {
      cliente.setTelefono(valorNuevo);
    } else {
      return console.log("el dato ingresado es invalido");
    }
  }
}
