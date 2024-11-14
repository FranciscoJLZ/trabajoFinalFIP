import { GeneradorID } from "./GeneradorID";
import { Cliente } from "./Cliente";
import { Mascota } from "./Mascota";
import { AnyARecord } from "dns";
import { stringify } from "querystring";

export class Sucursal {
    private listaPacientes: Mascota[];
    private listaClientes: Cliente[];
    private nombre: string;
    private numero: number;
    private IDSucursal: string
    public constructor(nombre: string, numero: number) {
        this.nombre = nombre;
        this.numero = numero;
        this.IDSucursal = GeneradorID.instancia.generarID();
        this.listaPacientes = [];
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
    //methods----
    public darAlta(altaMascota: Mascota): void {
        this.listaPacientes.push(altaMascota);
    }
    public darBaja(bajaMascota: Mascota): void {
        const iPaciente = this.listaPacientes.findIndex((Mascota) => Mascota.getNombre() === bajaMascota.getNombre());
    }
    public agregarCliente(nuevoCliente: Cliente) {
        this.listaClientes.push(nuevoCliente)
    }
    public eliminarCliente(bajaClinete: Cliente) {
        const iCliente = this.listaClientes.findIndex((Cliente) => Cliente.getID() === bajaClinete.getID());
    }
    public modificarDatosCliente(datoCliente: string, valorNuevo: any) {
        datoCliente.toLowerCase();
        if (datoCliente == "nombre") {
            Cliente.setNombre(valorNuevo);
        } else if (datoCliente == Cliente.getNumero()) {
            Cliente.setNumero(valorNuevo);
        }
        else {
            return console.error("el dato ingresado es invalido");
        }
    }
    public modificarDatosMascota(datoMascota: string, valorNuevo: any) {
        datoMascota.toLowerCase();
        if (datoMascota == "nombre") {
            Mascota.setNombre(valorNuevo);
        } else if (datoMascota == "especie" || "Especie") {
            if (valorNuevo === "perro" || "gato" || "exotico") {
                Mascota.setEspecie(valorNuevo);
            }
        } else {
            return console.error("iterador invalido");
        }
    }
    public ingresarIDCliente(ID: Cliente) {
        for (let i = 0; i < this.listaClientes.length; i++) {
            if (ID === this.listaClientes[i]) {
                return 
            } else {
                return console.error(`La ID ingresada(${ID}): Es inválida`);
            }
        }
    }
    public ingresarIDPaciente(ID: Cliente) {
        for (let i = 0; i < this.listaPacientes.length; i++) {
            if (ID === this.listaClientes[i]) {
                return 
            } else {
                return console.error(`La ID ingresada(${ID}): Es inválida`);
            }
        }
    }
}