export class Mascota {
  // 1. Yo aca podria un id que sirva para identificar a la mascota.
  // Si bien la consigna no lo solicita, nos puede servir para identificar
  // la mascota en caso de que un cliente registre mas de una mascota en la Veterinaria y tambien para eliminar
  // una mascota de un cliente.
  // Entonces, la propiedad id se deberia generar con el GeneradorID como en la clase Cliente.
  private ID: string;
  private nombre: string;
  // Esta parte mucho no la entendi. Por que hay dos propiedades especie?
  // Creo que usaste una para guardar las opciones que tiene el sistema para especie.
  // Los problemas que le veo a esto, son:
  // 1 -> Cada instancia esta guardando en memoria
  // el array que inicias en el constructor (this.especie = ["Gato", "Perro", "Exótica"];)
  // 2 -> A la propiedad nuevaEspecie la hiciste de tipo array, y sumado al metodo
  // setEspecie, una Mascota puede tener mas de una especie, en el caso
  // de que alguien de afuera llame mas de una vez al metodo setEspecie. Tambien, si yo
  // paso un i mayor a especie.length se rompe el metodo.
  private especie: string[];
  private nuevaEspecie: string[];
  // Una solucion que te propongo, y aprovechando lo hermoso que es TypeScript es usar los
  // Union Types. Entonces:
  // La clase deberia tener solo una propiedad privada especie (no es necesario tener nuevaEspecia)
  // y en el tipo de especie usamos los Union Types para limitar los valores que puede albergar esa propiedad.
  // Por ejemplo, si vos quisieras tener una propiedad que solo pueda tener los valores 1 o 2 podrias declarar algo asi:
  // private miPropiedad: 1 | 2 <-- Es decir que miPropiedad es de tipo 1 o 2, no acepta otro tipo.
  // Tambien podes decir que miPropiedad solo pueda valer 1 o una cadena de texto especifica, por ejemplo:
  // private miPropiedad: 1 | "miTextoEspecifico"
  // Entonces en este caso, seria:
  // private especie: "Perro" | "Gato" | "Exótica"
  // Asi, desde afuera, TypeScript no te deja ingresar nigun otro valor que los declarados.
  // En cuanto al id del cliente, yo crearia un propiedad idCliente de tipo string donde se guardaria el Id del cliente.
  // private idCliente: string;
  // Como en el mundo real, una mascota no se va a ir a dar de alta sola a la veterinaria (salvo que sea rescatada? ya estoy estirando mucho el uso jaja)
  // siempre vamos a saber el id del cliente, por eso, podemos esperar que al momento de la creacion de la mascota tengamos el id del cliente.
  // Entonces, yo modificaria el contructor para que recibiera por parametro el nombre, la especie de la mascota y el id del cliente:
  // public constructor(nombre: string, especie: "Perro" | "Gato" | "Exótica", idCliente: string) { <implementacion> }
  // Despues habria que hacer el getter de idCliente para uso exterior y setEspecie no seria necesario por que la especie se setea
  // al momento de creacion y no cambiaria.
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
