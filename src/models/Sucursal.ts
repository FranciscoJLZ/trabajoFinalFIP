import { GeneradorID } from "../utils/GeneradorID";
import { Cliente } from "./Cliente";
import { Mascota } from "./Mascota";
import { AnyARecord } from "dns";
import { stringify } from "querystring";

export class Sucursal {
  private id: string;
  private nombre: string;
  private numero: number;
  private clientes: Cliente[];
  public constructor(nombre: string, numero: number) {
    this.id = GeneradorID.instancia.generarID();
    this.nombre = nombre;
    this.numero = numero;
    this.clientes = [];
  }
  //getters----
  public getNombre(): string {
    return this.nombre;
  }
  public getNumero(): number {
    return this.numero;
  }
  public getID() {
    return this.id;
  }
  // JOSE: Agrego getter de clientes, para leerlos desde la clase veterinaria
  public getClientes() {
    return this.clientes;
  }
  //methods----
  public agregarCliente(nuevoCliente: Cliente) {
    this.clientes.push(nuevoCliente);
  }

  // JOSE: Fix: Modifico implentacion del metodo eliminar
  
  // public eliminarCliente(bajaCliente: Cliente) {
  //   const iCliente = this.clientes.findIndex(
  //     (cliente) => cliente.getID() === bajaCliente.getID()
  //   );
  // }

  public eliminarCliente(bajaCliente: Cliente) {
    this.clientes = this.clientes.filter(
      (cliente) => cliente.getID() !== bajaCliente.getID()
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

  // JOSE: Se agregan setter para modificar la clase sucursal
  // desde veterinaria
  public setNombre(nombre: string) {
    this.nombre = nombre;
  }

  public setNumero(numero: number) {
    this.numero = numero;
  }
}
