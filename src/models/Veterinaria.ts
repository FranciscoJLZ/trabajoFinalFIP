import { type TEntidad } from "../types";

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

  /**
   * Argumentos requeridos para la creación de cada tipo de entidad.
   * @type {Record<string, { nombre: string; tipo: "texto" | "numero" | "lista"; opciones?: { value: string; name: string }[] }[]>}
   * @public
   * @static
   */
  public static readonly argumentos: Record<
    string,
    {
      nombre: string;
      tipo: "texto" | "numero" | "lista";
      opciones?: {
        value: string;
        name: string;
      }[];
      validar?:
        | ((entrada: string) => boolean | string)
        | ((
            valor: number | undefined
          ) => string | boolean | Promise<string | boolean>);
    }[]
  > = {
    sucursal: [
      {
        nombre: "nombre",
        tipo: "texto",
        validar: (entrada: string) => {
          if (typeof entrada === "string") {
            if (entrada.length > 0) {
              return true;
            } else {
              return "El nombre de la sucursal no puede estar vacio.";
            }
          } else {
            return "Debes ingresar un nombre válido.";
          }
        },
      },
      {
        nombre: "numero",
        tipo: "numero",
        validar: (entrada: number | undefined) => {
          if (typeof entrada === "number") {
            const largo = entrada.toString().length;

            if (largo >= 1 && largo <= 10) {
              return true;
            } else {
              return "El número debe tener entre 1 y 10 dígitos.";
            }
          } else {
            return "Debes ingresar un número válido.";
          }
        },
      },
    ],
    proveedor: [
      {
        nombre: "nombre",
        tipo: "texto",
        validar: (entrada: string) => {
          if (typeof entrada === "string") {
            if (entrada.length > 0) {
              return true;
            } else {
              return "El nombre del proveedor no puede estar vacio.";
            }
          } else {
            return "Debes ingresar un nombre válido.";
          }
        },
      },
      {
        nombre: "telefono",
        tipo: "numero",
        validar: (entrada: number | undefined) => {
          if (typeof entrada === "number") {
            const largo = entrada.toString().length;

            if (largo >= 1 && largo <= 10) {
              return true;
            } else {
              return "El número debe tener entre 1 y 10 dígitos.";
            }
          } else {
            return "Debes ingresar un número válido.";
          }
        },
      },
    ],
    cliente: [
      {
        nombre: "nombre",
        tipo: "texto",
        validar: (entrada: string) => {
          if (typeof entrada === "string") {
            if (entrada.length > 0) {
              return true;
            } else {
              return "El nombre del cliente no puede estar vacio.";
            }
          } else {
            return "Debes ingresar un nombre válido.";
          }
        },
      },
      {
        nombre: "telefono",
        tipo: "numero",
        validar: (entrada: number | undefined) => {
          if (typeof entrada === "number") {
            const largo = entrada.toString().length;

            if (largo >= 1 && largo <= 10) {
              return true;
            } else {
              return "El número debe tener entre 1 y 10 dígitos.";
            }
          } else {
            return "Debes ingresar un número válido.";
          }
        },
      },
    ],
    mascota: [
      {
        nombre: "nombre",
        tipo: "texto",
        validar: (entrada: string) => {
          if (typeof entrada === "string") {
            if (entrada.length > 0) {
              return true;
            } else {
              return "El nombre de la mascota no puede estar vacio.";
            }
          } else {
            return "Debes ingresar un nombre válido.";
          }
        },
      },
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

  /**
   * Diccionario de métodos setter para actualizar propiedades de cada tipo de entidad.
   * @type {Record<string, Record<string, (entidad: any, valor: any) => void>>}
   * @private
   * @static
   */
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

  /**
   * Devuelve una lista de entidades de un tipo específico.
   * @param {TEntidad} tipo - El tipo de entidad a listar (sucursal, proveedor, cliente, mascota).
   * @returns {Array<Sucursal | Proveedor | Cliente | Mascota>} - Una lista de entidades.
   * @throws {Error} - Lanza un error si no se encuentran registros del tipo solicitado.
   */
  public ver(tipo: TEntidad) {
    let resultado: Sucursal[] | Proveedor[] | Cliente[] | Mascota[] = [];

    if (tipo === "sucursal") {
      resultado = this.sucursales;
    }

    if (tipo === "proveedor") {
      resultado = this.proveedores;
    }

    if (tipo === "cliente") {
      resultado = this.sucursales.flatMap((sucursal) => {
        return sucursal.getClientes();
      });
    }

    if (tipo === "mascota") {
      resultado = this.sucursales.flatMap((sucursal) => {
        return sucursal.getClientes().flatMap((cliente) => {
          return cliente.getMascotas();
        });
      });
    }

    if (resultado.length === 0) {
      throw new Error(`No se han encontrado registros de tipo ${tipo}`);
    }

    return resultado;
  }

  /**
   * Busca una entidad específica por su ID.
   * @param {TEntidad} tipo - El tipo de entidad a buscar.
   * @param {string} id - El ID de la entidad a buscar.
   * @returns {Sucursal | Proveedor | Cliente | Mascota | null} - La entidad encontrada o `null` si no se encuentra.
   */
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

    if (!resultado) {
      throw new Error(`No se encontro ningún registro con id: ${id}`);
    }

    return resultado;
  }

  /**
   * Guarda una entidad de tipo sucursal o proveedor.
   * @param {TEntidad} tipo - El tipo de entidad a guardar (sucursal o proveedor).
   * @param {Sucursal | Proveedor} entidad - La entidad a guardar.
   */
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

  /**
   * Crea una nueva instancia de entidad a partir de los datos proporcionados.
   * @param {TEntidad} tipo - El tipo de entidad a crear.
   * @param {Record<string, any>} datos - Los datos para inicializar la entidad.
   * @returns {Sucursal | Proveedor | Cliente | Mascota} - La nueva entidad creada.
   */
  public crear(tipo: TEntidad, datos: Record<string, any>) {
    const Constructor = Veterinaria.constructores[tipo];
    // Aca se deberia agregar alguna validacion por si
    // un desarrollador fuerza algun tipo diferente.
    const argumentos = Veterinaria.argumentos[tipo].map(
      (arg) => datos[arg.nombre]
    );

    return new Constructor(...argumentos);
  }

  /**
   * Edita una propiedad de una entidad existente.
   * @param {Sucursal | Proveedor | Cliente | Mascota} entidad - La entidad a editar.
   * @param {{ propiedad: string; valorNuevo: any }} dato - El nombre de la propiedad a editar y su nuevo valor.
   */
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

  /**
   * Elimina una entidad por su ID.
   * @param {TEntidad} tipo - El tipo de entidad a eliminar.
   * @param {string} id - El ID de la entidad a eliminar.
   */
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
