import { type TEntidad } from "../interface/Sistema";

import { Sucursal } from "./Sucursal";
import { Proveedor } from "./Proveedor";
import { Cliente } from "./Cliente";
import { Mascota } from "./Mascota";

export class Veterinaria {
  private sucursales: Sucursal[];
  private proveedores: Proveedor[];

  private static readonly constructores: Record<
    string,
    new (...args: any[]) => Sucursal | Proveedor | Cliente | Mascota
  > = {
    sucursal: Sucursal,
    proveedor: Proveedor,
    cliente: Cliente,
    mascota: Mascota,
  };

  public static readonly argumentos: Record<
    string,
    {
      nombre: string;
      tipo: "texto" | "numero" | "lista";
      opciones?: { value: string; name: string }[];
    }[]
  > = {
    sucursal: [
      {
        nombre: "nombre",
        tipo: "texto",
      },
      { nombre: "numero", tipo: "numero" },
    ],
    proveedor: [
      { nombre: "nombre", tipo: "texto" },
      { nombre: "telefono", tipo: "numero" },
    ],
    cliente: [
      { nombre: "nombre", tipo: "texto" },
      { nombre: "telefono", tipo: "numero" },
    ],
    mascota: [
      { nombre: "nombre", tipo: "texto" },
      {
        nombre: "especie",
        tipo: "lista",
        opciones: [
          { value: "perro", name: "Perro" },
          { value: "gato", name: "Gato" },
          { value: "exotica", name: "Exotica" },
        ],
      },
    ],
  };

  private static setters: Record<
    string,
    Record<string, (entidad: any, valor: any) => void>
  > = {
    sucursal: {
      nombre: (entidad, valor) => entidad.setNombre(valor),
      numero: (entidad, valor) => entidad.setNumero(valor),
    },
    proveedor: {
      nombre: (entidad, valor) => entidad.setNombre(valor),
      telefono: (entidad, valor) => entidad.setTelefono(valor),
    },
    cliente: {
      nombre: (entidad, valor) => entidad.setNombre(valor),
      telefono: (entidad, valor) => entidad.setTelefono(valor),
    },
    mascota: {
      nombre: (entidad, valor) => entidad.setNombre(valor),
      especie: (entidad, valor) => entidad.setEspecie(valor),
    },
  };

  constructor() {
    this.sucursales = [];
    this.proveedores = [];
  }

  public ver(tipo: TEntidad) {
    let resultado: { value: string; name: string }[] = [];

    if (tipo === "sucursal") {
      resultado = this.sucursales.map((sucursal, index) => {
        return {
          value: sucursal.getID(),
          name: `${index + 1}. ${sucursal.getNombre()}`,
        };
      });
    }

    if (tipo === "proveedor") {
      resultado = this.proveedores.map((proveedor, index) => {
        return {
          value: proveedor.getID(),
          name: `${index + 1}. ${proveedor.getNombre()}`,
        };
      });
    }

    // Al listar clientes por nombre se puede repetir, code smells ja
    if (tipo === "cliente") {
      resultado = this.sucursales.flatMap((sucursal, sucIndex) => {
        return sucursal.getClientes().map((cliente, cliIndex) => {
          return {
            value: cliente.getID(),
            name: `${sucIndex + cliIndex + 1}. ${cliente.getNombre()}`,
          };
        });
      });
    }

    // Al listar mascotas con nombre se pueden repetir, code smells ja
    if (tipo === "mascota") {
      resultado = this.sucursales.flatMap((sucursal, sucIndex) => {
        return sucursal.getClientes().flatMap((cliente, cliIndex) => {
          return cliente.getMascotas().map((mascota, masIndex) => {
            return {
              value: mascota.getID(),
              name: `${
                sucIndex + cliIndex + masIndex + 1
              }. ${mascota.getNombre()}`,
            };
          });
        });
      });
    }

    if (resultado.length === 0) {
      throw new Error(`No se han encontrado registros de tipo ${tipo}`);
    } else {
      return resultado;
    }
  }

  public buscar(tipo: TEntidad, id: string) {
    let resultado: Sucursal | Proveedor | Cliente | Mascota | null = null;
    if (tipo === "sucursal") {
      resultado = this.sucursales.find((s) => s.getID() === id) ?? null;
    }
    if (tipo === "proveedor") {
      resultado = this.proveedores.find((p) => p.getID() === id) ?? null;
    }
    if (tipo === "cliente") {
      resultado =
        this.sucursales
          .flatMap((sucursal) => sucursal.getClientes())
          .find((c) => c.getID() === id) ?? null;
    }
    if (tipo === "mascota") {
      resultado =
        this.sucursales
          .flatMap((sucursal) => sucursal.getClientes())
          .flatMap((cliente) => cliente.getMascotas())
          .find((m) => m.getID() === id) ?? null;
    }

    return resultado;
  }

  public guardar(tipo: TEntidad, entidad: Sucursal | Proveedor) {
    if (tipo === "sucursal" && entidad instanceof Sucursal) {
      this.sucursales.push(entidad);
      return;
    }

    if (tipo === "proveedor" && entidad instanceof Proveedor) {
      this.proveedores.push(entidad);
      return;
    }
  }

  public crear(tipo: TEntidad, datos: Record<string, any>) {
    const Constructor = Veterinaria.constructores[tipo];
    // Aca se deberia agregar alguna validacion por si
    // un desarrollador fuerza algun tipo diferente.
    const argumentos = Veterinaria.argumentos[tipo].map(
      (arg) => datos[arg.nombre]
    );

    return new Constructor(...argumentos);
  }

  public editar(
    entidad: Sucursal | Proveedor | Cliente | Mascota,
    dato: { propiedad: string; valorNuevo: any }
  ) {
    // Extraigo key desde el nombre del constructor
    // para ahorrar un parametro tipo.
    // Por ejemplo: Sucursal -> "sucursal"
    const tipo = entidad.constructor.name.toLowerCase();

    // Con el tipo obtengo del diccionario estatico el metodo setter
    // que corresponda.
    const metodoSetter = Veterinaria.setters[tipo][dato.propiedad];

    // Llamo al metodo setter registrado en el diccionario
    // estatico de Veterinaria.
    // Por ejemplo, si recibo para editar una instancia de Mascota
    // y el dato recibido por parametro es { propiedad: "especie", valorNuevo: "gato"}
    // lo que se ejecuta es entidad.setEspecie(valorNuevo).
    // TODO: Como en el diccionario estatico el valorNuevo es de tipo any seria
    // conveniente arrojar excepciones en cada metodo setter de cada clase con
    // el fin de chequear que valorNuevo corresponda con el tipo esperado en cada
    // metodo setter.
    metodoSetter(entidad, dato.valorNuevo);
  }

  public eliminar(tipo: TEntidad, id: string) {
    if (tipo === "sucursal") {
      this.sucursales = this.sucursales.filter(
        (sucursal) => sucursal.getID() != id
      );
    }

    if (tipo === "proveedor") {
      this.proveedores = this.proveedores.filter(
        (proveedor) => proveedor.getID() != id
      );
    }

    if (tipo === "cliente") {
      this.sucursales.forEach((sucursal) => {
        const clientes = sucursal.getClientes();
        const clienteBuscado = clientes.find(
          (cliente) => cliente.getID() === id
        );

        if (clienteBuscado) {
          sucursal.eliminarCliente(clienteBuscado);
        }
      });
    }

    if (tipo === "mascota") {
      this.sucursales.forEach((sucursal) => {
        const clientes = sucursal.getClientes();
        clientes.forEach((cliente) => {
          const mascotas = cliente.getMascotas();
          const mascotaBuscada = mascotas.find(
            (mascota) => mascota.getID() === id
          );

          if (mascotaBuscada) {
            cliente.bajaMascota(mascotaBuscada);
          }
        });
      });
    }
  }
}
