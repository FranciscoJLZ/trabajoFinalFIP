import { Menu } from "../utils/Menu";
import { Veterinaria } from "../models/Veterinaria";
import { Sucursal } from "../models/Sucursal";
import { Cliente } from "../models/Cliente";
import { Mascota } from "../models/Mascota";
import { Proveedor } from "../models/Proveedor";

export type TEntidad = "cliente" | "mascota" | "sucursal" | "proveedor";
export type TPreguntas = {
  name: string;
  type: "input" | "number" | "confirmation" | "list";
  message: string;
  choices?: string[] | { name: string; value: string; disabled?: boolean }[];
};

export class Sistema {
  private veterinaria: Veterinaria;

  constructor() {
    this.veterinaria = new Veterinaria();
  }

  public async comenzar() {
    console.clear();
    console.log("Bienvenidos a Veterinaria Fresh");

    // Se usa este metodo de escritura asi
    // escribe en la misma linea.
    process.stdout.write("Cargando");

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        process.stdout.write(".");
      }
    }

    this.menuPrincipal();
  }

  // Muestra todas las opciones del sistema
  private async menuPrincipal() {
    let resultado = null;

    const operacionesDisponibles = [
      { value: "consultar", name: "1. Consultar registros" },
      { value: "crear", name: "2. Dar de alta regitros" },
      { value: "salir", name: "3. Salir del sistema" },
    ];

    const tiposDisponibles = [
      { value: "sucursal", name: "Sucursales" },
      { value: "proveedor", name: "Proveedores" },
      { value: "cliente", name: "Clientes" },
      { value: "mascota", name: "Mascotas" },
      { value: "salir", name: "<- Atras" },
    ];

    while (true) {
      console.clear();
      console.log("MENU PRINCIPAL");
      console.log("///////////////////////////////////////////////////");

      const operacionSeleccionada = await Menu.elegirOpcion(
        "Selecciona que quieres hacer a continuacion",
        operacionesDisponibles
      );

      if (operacionSeleccionada === "salir") {
        console.log("Muchas gracias. Adios");
        process.exit(0);
      }

      const tipoSeleccionado = await Menu.elegirOpcion(
        `Que registros deseas ${operacionSeleccionada}`,
        tiposDisponibles
      );

      if (tipoSeleccionado === "salir") {
        await this.menuPrincipal();
      }

      if (operacionSeleccionada === "consultar") {
        resultado = await this.menuConsultar(tipoSeleccionado as TEntidad);

        if (resultado.accion === "consultar") {
          await this.menuEdicion(tipoSeleccionado as TEntidad, resultado.data!);
        }
        // TODO: Si consulto y luego creo, me envia a menu edicion
        // cuando me deberia enviar a menu principal
        // if (entidad) {
        // }
      } else {
        resultado = await this.menuCrear(tipoSeleccionado as TEntidad);
      }
    }
  }

  private async menuConsultar(
    tipo: TEntidad,
    asignacion: boolean = false
  ): Promise<{
    accion: "consultar" | "alta" | "salir";
    data: Sucursal | Proveedor | Cliente | Mascota | null;
  }> {
    const mensaje = asignacion
      ? `ASIGNAR ${tipo.toUpperCase()}`
      : `CONSULTAR ${tipo.toUpperCase()}`;

    if (!asignacion) {
      console.clear();
    }
    console.log(mensaje);
    console.log("///////////////////////////////////////////////////");

    try {
      // Convierto resultados al formato de opciones de consola y los
      // agrego a la lista de opciones
      const opciones = this.veterinaria.ver(tipo);

      opciones.push(
        { value: "alta", name: "-> Crear un registro nuevo" },
        { value: "salir", name: "<- Atras" }
      );

      const opcion = await Menu.elegirOpcion(
        "Selecciona un registro",
        opciones
      );

      if (opcion === "salir") {
        return { accion: "salir", data: null };
      }

      if (opcion === "alta") {
        return {
          accion: "alta",
          data: await this.menuCrear(tipo, asignacion),
        };
      }

      return {
        accion: "consultar",
        data: this.veterinaria.buscar(tipo, opcion),
      };
    } catch (error) {
      if (error instanceof Error) {
        // Agregue codigo ANSI para mostrar el mensaje en rojo.
        // \x1b[31m cambia el color a rojo
        // \x1b[0m vuelve al color predeterminado
        console.log(`\x1b[31m${error.message}\x1b[0m`);
        const confirmacion = await Menu.pedirConfirmacion(
          "Desear crear un registro nuevo?"
        );

        if (confirmacion) {
          return {
            accion: "alta",
            data: await this.menuCrear(tipo, asignacion),
          };
        }

        if (asignacion) {
          const segundaConfirmacion = await Menu.pedirConfirmacion(
            "Estas seguro? Se perderan todos los cambios"
          );

          if (!segundaConfirmacion) {
            return {
              accion: "alta",
              data: await this.menuCrear(tipo, asignacion),
            };
          }
        }
      }
      return { accion: "salir", data: null };
    }
  }

  private async menuCrear(
    tipo: TEntidad,
    asignacion: boolean = false
  ): Promise<Sucursal | Proveedor | Cliente | Mascota> {
    const preguntas = {
      cliente: [
        { name: "nombre", type: "input", message: "Ingresa nombre: " },
        {
          name: "telefono",
          type: "number",
          message: "Ingresa nro de telefono: ",
        },
      ],
      mascota: [
        { name: "nombre", type: "input", message: "Ingresa nombre: " },
        {
          name: "especie",
          type: "list",
          message: "Ingresa especie: ",
          choices: [
            { value: "perro", name: "Perro" },
            { value: "gato", name: "Gato" },
            { value: "exotica", name: "Exotica" },
          ],
        },
      ],
      sucursal: [
        { name: "nombre", type: "input", message: "Ingresa nombre: " },
        {
          name: "numero",
          type: "number",
          message: "Ingresa numero: ",
        },
      ],
      proveedor: [
        { name: "nombre", type: "input", message: "Ingresa nombre: " },
        {
          name: "telefono",
          type: "number",
          message: "Ingresa nro de telefono: ",
        },
      ],
    };

    // Aca fuerzo el tipado de las preguntas elegidas
    // para que lo acepte correctamente el metodo de la clase Menu
    const preguntasTipo = preguntas[tipo] as unknown as TPreguntas;

    if (!asignacion) {
      console.clear();
    }
    console.log(`CREAR NUEVO REGISTRO DE TIPO ${tipo.toUpperCase()}`);
    console.log("///////////////////////////////////////////////////");
    const respuestas = await Menu.listaPreguntas(preguntasTipo);
    console.log("///////////////////////////////////////////////////");

    const entidadCreada = this.veterinaria.crear(tipo, respuestas) as
      | Sucursal
      | Proveedor
      | Cliente
      | Mascota;

    if (entidadCreada instanceof Mascota) {
      const cliente = (await this.menuConsultar("cliente", true))
        .data as Cliente;
      if (cliente) {
        cliente.agregarMascota(entidadCreada as Mascota);
      }
    }

    if (entidadCreada instanceof Cliente) {
      const sucursal = (await this.menuConsultar("sucursal", true))
        .data as Sucursal;
      if (sucursal) {
        sucursal.agregarCliente(entidadCreada as Cliente);
      }
    }

    if (
      entidadCreada instanceof Sucursal ||
      entidadCreada instanceof Proveedor
    ) {
      this.veterinaria.guardar(tipo, entidadCreada);
    }

    return entidadCreada;
  }

  private async menuEdicion(
    tipo: TEntidad,
    entidad: Sucursal | Proveedor | Cliente | Mascota
  ) {
    const opciones = Veterinaria.argumentos[tipo].map((arg) => {
      return {
        value: arg.nombre,
        name: `${arg.nombre.charAt(0).toUpperCase() + arg.nombre.slice(1)}`,
      };
    });

    if (entidad instanceof Cliente) {
      opciones.push({ value: "registrar", name: "Registrar visita" });
    }

    opciones.push(
      { value: "eliminar", name: "X Eliminar registro" },
      { value: "salir", name: "<- Atras" }
    );

    console.clear();
    console.log("///////////////////////////////////////////////////");
    console.log(`MENU PARA EDITAR ${tipo.toUpperCase()}: ${entidad.getID()}`);

    // Imprimir ficha

    this.imprimirFicha(tipo, entidad);

    const opcion = await Menu.elegirOpcion(
      "Que dato quieres modificar?",
      opciones
    );

    if (opcion === "salir") {
      return null;
    }

    if (opcion === "registrar") {
      (entidad as Cliente).agregarVisita();
      console.log("Visita registrada exitosamente.");
    }

    if (opcion === "eliminar") {
      console.log(
        "La siguiente accion borrara el registro seleccionado y todos los datos relacionados."
      );
      const confimacion = await Menu.pedirConfirmacion(
        "Estas seguro que deseas eliminar el/los registro/s?"
      );

      if (confimacion) {
        this.veterinaria.eliminar(tipo, entidad.getID());
        return null;
      }
    }

    const argumentoAEditar = Veterinaria.argumentos[tipo].find(
      (arg) => arg.nombre === opcion
    );

    let nuevoValor;

    if (argumentoAEditar !== undefined) {
      if (argumentoAEditar.tipo === "texto") {
        nuevoValor = await Menu.pedirTexto(
          `Ingresa el nuevo valor para ${argumentoAEditar.nombre}`
        );
      } else if (argumentoAEditar.tipo === "numero") {
        nuevoValor = await Menu.pedirNumero(
          `Ingresa el nuevo valor para ${argumentoAEditar.nombre}`
        );
      } else {
        nuevoValor = await Menu.elegirOpcion(
          `Selecciona el nuevo valor para ${argumentoAEditar?.nombre}`,
          argumentoAEditar?.opciones!
        );
      }

      this.veterinaria.editar(entidad, {
        propiedad: argumentoAEditar.nombre,
        valorNuevo: nuevoValor,
      });
    }

    const confimacion = await Menu.pedirConfirmacion(
      "Desea continuar editando?"
    );

    if (confimacion) {
      await this.menuEdicion(tipo, entidad);
    }
  }

  private imprimirFicha(
    tipo: TEntidad,
    entidad: Sucursal | Proveedor | Cliente | Mascota
  ) {
    console.log("///////////////////////////////////////////////////");
    console.log(`Ficha de ${tipo.toUpperCase()}`);
    console.log("---------------------------------------------------");

    for (const [propiedad, valor] of Object.entries(entidad)) {
      // Formateo de nombre de propiedad, pasando primer letra a mayuscula
      const propMayuscula =
        propiedad.charAt(0).toUpperCase() + propiedad.slice(1);

      // Usando los metodos del prototipo Array chequeo si el valor
      // de la propiedad es un arreglo.
      if (Array.isArray(valor)) {
        // Chequeo si el arreglo esta vacio
        if (valor.length === 0) {
          // Con padEnd hacemos que todas las propiedades, hasta los :
          // tengan la misma distancia.
          console.log(`${propMayuscula.padEnd(15, "")}: Sin registros`);
        } else {
          // Imprimo titulo de la lista
          console.log(`${propMayuscula.padEnd(15, "")}: `);
          valor.forEach((item) => {
            // Agrego 15 espacios en blanco para simular sangria izquierda.
            console.log(`${" ".repeat(15)}- ${item.getNombre()}`);
          });
        }
      } else {
        console.log(`${propMayuscula.padEnd(15, "")}: ${valor}`);
      }
    }

    console.log("///////////////////////////////////////////////////");
  }
}
