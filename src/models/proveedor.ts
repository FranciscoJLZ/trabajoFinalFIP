import { GeneradorID } from "./GeneradorID";

export class Provedor {
    private ID: string;
    private Nombre: string;
    private Telefono: number;
    //-----
    public constructor(Nombre: string, Telefono: number){
        this.Nombre= Nombre;
        this.Telefono = Telefono;
        this.ID = GeneradorID.instancia.generarID();
    }
    //----
    getID(){
        return this.ID;
    }
    getNombre(){
        return this.Nombre;
    }
    getTelefono(){
        return this.Telefono;
    }
    //----
    setNombre(Nombre: string){
        return this.Nombre = Nombre;
    }
    setTelefono(Telefono: number){
        return this.Telefono = Telefono;
    }
    //Avisar en caso de requerir algún metodo----
}
