import { TEntidad, TPreguntas } from "../types";

import { Menu } from "../utils/Menu";
import { Veterinaria } from "../models/Veterinaria";
import { Sucursal } from "../models/Sucursal";
import { Cliente } from "../models/Cliente";
import { Mascota } from "../models/Mascota";
import { Proveedor } from "../models/Proveedor";

/**
 * Clase que representa el sistema de gestión de la veterinaria.
 * Permite gestionar las sucursales, proveedores, clientes y mascotas,
 * además de realizar consultas y actualizaciones de registros.
 */
export class Sistema {
  private veterinaria: Veterinaria;

  constructor() {
    this.veterinaria = new Veterinaria();
  }

  /**
   * Método que inicia el sistema, mostrando un mensaje de bienvenida y un efecto de carga.
   */
  public async comenzar(): Promise<void> {
    console.clear();
    console.log("Bienvenidos a Veterinaria Fresh 🩺");

    // Se usa este metodo de escritura asi
    // escribe en la misma linea.
    process.stdout.write("Cargando");

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // entonces los . se escriben a continuancion del mensaje "Cargando"
        process.stdout.write(" 🐈 ");
      }
    }

    // Una vez terminado se pasa al menu principal
    this.menuPrincipal();
  }

  /**
   * Método que muestra el menú principal del sistema y permite al usuario
   * seleccionar entre distintas operaciones (consultar, crear, salir).
   */
  private async menuPrincipal() {
    // Aca se declaran las opciones que se muestran
    // en la primera pantalla luego de ingresar al sistema.
    // Se suma la opción de salir
    const operacionesDisponibles = [
      { value: "consultar", name: "1. 🔍 Consultar registros" },
      { value: "crear", name: "2. 📄 Dar de alta regitros" },
      { value: "salir", name: "3. 🚪 Salir del sistema" },
    ];

    // Aca se declaran las opciones para que el usuario
    // seleccione sobre que tipo de entidad operar.
    // Se suma la opción de salir
    const tiposDisponibles = [
      { value: "sucursal", name: "🏢  Sucursales" },
      { value: "proveedor", name: "🛠️   Proveedores" },
      { value: "cliente", name: "👩  Clientes" },
      { value: "mascota", name: "🐕  Mascotas" },
      { value: "salir", name: "↩️   Atrás" },
    ];

    // Se inicia un bucle infinito para que siempre
    // el usuario vuelva al menu principal y no se
    // corte el programa.
    while (true) {
      // Limpieza de consola e impresion de titulo del menú.
      console.clear();
      console.log("MENU PRINCIPAL");
      console.log("///////////////////////////////////////////////////");

      // Se envian las opciones diponibles a la consola
      // y se espera que el usuario seleccione.
      const operacionSeleccionada = await Menu.elegirOpcion(
        "Selecciona que quieres hacer a continuacion",
        operacionesDisponibles
      );

      // Si la opcion seleccionada es salir,
      // se termina el programa.
      if (operacionSeleccionada === "salir") {
        console.log("¡Muchas gracias!. ¡Adios, vuelve pronto! 👋👋");
        process.exit(0);
      }

      // Si la opcion seleccionada es alguna opcion,
      // se envian los tipos de entidad disponibles a la consola,
      // y se espera que el usuario seleccione.
      const tipoSeleccionado = await Menu.elegirOpcion(
        `Que registros deseas ${operacionSeleccionada}`,
        tiposDisponibles
      );

      // Si en la segunda pantalla, el usuario
      // selecciona "Atrás", se vuelve a cargar el
      // menu principal (recursividad)
      if (tipoSeleccionado === "salir") {
        await this.menuPrincipal();
      }

      // Se declara una variable auxiliar para
      // guardar el resultado de las operaciones que realice
      // el usuario en otros menúes.
      let resultado = null;

      // Si la operacion elegida en la primer pantalla es Consultar
      if (operacionSeleccionada === "consultar") {
        // Se envia al usuario al menu consultar, y se guarda el resultado
        // en la variable auxiliar.
        resultado = await this.menuConsultar(tipoSeleccionado as TEntidad);

        // Como el menu consultar devuelve un objeto, donde se indica la accion que
        // selecciono el usuario en ese menu, junto con la entidad creada/consultada.
        // Entonces se chequea si la accion fue "consultar"
        if (resultado.accion === "consultar") {
          // Si es asi, se muestra el menu de edicion, indicando el tipo de
          // entidad en el que se esta operando, como asi la entidad seleccionada.
          // Como resultado.data puede ser null, se usa ! al final para indicarle
          // a TS que en esta parte, data nunca va a ser null, para que ignore
          // esa posibilidad (operador de afirmacion no nula).
          await this.menuEdicion(tipoSeleccionado as TEntidad, resultado.data!);
        }
      } else {
        // Si el usuario selecciono la opcion "Dar de alta", se envia
        // al usuario al menú de creación. En este caso, el resultado
        // del menu crear no se guarda, ya que una vez finalizado el
        // proceso de creación, se vuelve a cargar el menú principal.
        await this.menuCrear(tipoSeleccionado as TEntidad);
      }
    }
  }

  /**
   * Método que muestra el menú para consultar registros de una entidad específica.
   * Devuelve un objeto indicando la accion realizada y la entidad consultada/creada.
   */
  private async menuConsultar(
    tipo: TEntidad,
    asignacion: boolean = false
  ): Promise<{
    accion: "consultar" | "alta" | "salir";
    data: Sucursal | Proveedor | Cliente | Mascota | null;
  }> {
    // El menú consultar se utiliza desde dos puntos
    // de la aplicación:
    // 1. Cuando el usuario quiere consultar registros.
    // 2. Cuando el usuario crear un Cliente o una Mascota, luego
    // de cargar los datos, se pide que se asigne la instancia a su propietario.
    // Cliente -> Sucursal o Mascota -> Cliente -> Sucursal

    // El parametro asignación indica si el menu esta siendo usado para asignar
    // una relacion (dentro del menú creación) o consultando registros.

    // La variable mensaje cambia el titulo de acuerdo
    // al parametro asignación.
    const mensaje = asignacion
      ? `ASIGNAR ${tipo.toUpperCase()}`
      : `CONSULTAR ${tipo.toUpperCase()}`;

    // Limpieza condicional de la consola y se
    // muestra titulo del menú.
    if (!asignacion) {
      // Si es para asignar, se deja cola de menu anterior,
      // si no, se limpia lo anterior.
      console.clear();
    }
    console.log(mensaje);
    console.log("///////////////////////////////////////////////////");

    // Como los metodos ver y buscar de la clase Veterinaria pueden
    // arrojar un error, se envuelve la siguiente logica en un bloque
    // try/catch para manejar esos errores correctamente.
    try {
      // Convierto resultados al formato de opciones de consola y los
      // agrego a la lista de opciones
      const opciones = this.veterinaria.ver(tipo).map((item, index) => {
        return {
          value: item.getID(),
          name: `${index + 1}. ${item.getNombre()}`,
        };
      });

      // Agregamos opciones para dar de alta, y para volver atras.
      // Se agregan al final del listado de registros encontrados.
      opciones.push(
        { value: "alta", name: "📄 Crear un registro nuevo" },
        { value: "salir", name: "↩️  Atras" }
      );

      // Se envian las opciones a la consola,
      // y se espera que el usuario selecccione una.
      const opcion = await Menu.elegirOpcion(
        "Selecciona un registro",
        opciones
      );

      // Si la opcion seleccionada es "salir", retornamos
      // objeto con accion "salir" y data en null.
      if (opcion === "salir") {
        return { accion: "salir", data: null };
      }

      // Si la opcion seleccionada es "alta", retornamos
      // objeto con accion "alta" y en data, guardamos el resultado
      // del menu crear.
      if (opcion === "alta") {
        return {
          accion: "alta",
          // Es decir que se redirige al usuario al menu crear,
          // y una vez creada la entidad, se guarda en la propiedad
          // data y se devuelve el objeto.
          data: await this.menuCrear(tipo, asignacion),
        };
      }

      // Si la opcion seleccionada es "consultar", retornamos
      // objeto con accion "consultar" y en data, guardamos el resultado
      // del metodo de Veterinaria que busca una entidad.
      return {
        accion: "consultar",
        // Pasandole la id de lo que se busca, la cual
        // quedo guardada en opcion (Cuando el usuario seleeciona
        // un registro de la lista, la consola devuelve el valor del ID unico
        // en la variable opcion.)
        data: this.veterinaria.buscar(tipo, opcion),
      };
    } catch (error) {
      // Se fuerza error como una instancia de la clase Error,
      // para poder acceder a sus propiedades.
      if (error instanceof Error) {
        // Se agrega codigo ANSI para mostrar el mensaje en rojo.
        // \x1b[31m cambia el color a rojo
        // \x1b[0m vuelve al color predeterminado
        console.log(`\x1b[31m${error.message}\x1b[0m`);
        // Como los posibles errores de los metodos ver y buscar
        // son derivados de no encontrar un registro, se le presenta
        // al usuario la posibilidad de crear un registro nuevo del mismo
        // tipo que estaba consultado.
        // Por eso, se envia la pregunta a la consola, y se aguarda confirmacion
        const confirmacion = await Menu.pedirConfirmacion(
          "Desear crear un registro nuevo?"
        );

        // Si el usuario confirma la creacion, retornamos
        // objeto con accion "alta" y en data, guardamos el resultado
        // del menu crear.
        if (confirmacion) {
          return {
            accion: "alta",
            // Es decir que se redirige al usuario al menu crear,
            // y una vez creada la entidad, se guarda en la propiedad
            // data y se devuelve el objeto.
            data: await this.menuCrear(tipo, asignacion),
          };
        }

        // Si el usuario no confirma, debera ser redirigido al menu principal.
        // Pero en el caso de que este en un proceso de asignacion de relaciones
        // (Cliente -> Sucursal) o (Mascota -> Cliente -> Sucursal) se pide una
        // confirmacion extra, ya que al redirigirlo al menu principal perdera
        // todos los cambios que hizo hasta este punto.
        // Ejemplo: Si en la creacion de un cliente, no se le asigna una sucursal,
        // no se crea el cliente.
        if (asignacion) {
          // Entonces se envia la pregunta a la consola, y se aguarda confirmacion.
          // Como la pregunta es ¿estas seguro?, un Si pierde los cambios.
          const segundaConfirmacion = await Menu.pedirConfirmacion(
            "¿Estas seguro? Se perderan todos los cambios"
          );

          // Si el usuario contesta que no esta seguro, retornamos
          // objeto con accion "alta" y en data, guardamos el resultado
          // del menu crear.
          if (!segundaConfirmacion) {
            return {
              accion: "alta",
              // Es decir que se redirige al usuario al menu crear,
              // y una vez creada la entidad, se guarda en la propiedad
              // data y se devuelve el objeto.
              data: await this.menuCrear(tipo, asignacion),
            };
          }
        }
      }
      // Si no ocurrio nada de lo anterior, retornamos
      // objeto con accion "salir" y data en null, para volver
      // al menu principal.
      return { accion: "salir", data: null };
    }
  }

  /**
   * Muestra el menú para crear un nuevo registro de tipo específico.
   * Devuelve la nueva instancia creada.
   */
  private async menuCrear(
    tipo: TEntidad,
    asignacion: boolean = false
  ): Promise<Sucursal | Proveedor | Cliente | Mascota> {
    // Se crea diccionario que contiene las preguntas necesarias para obtener los datos
    // que necesita cada entidad para su constructor.
    // El formato de las preguntas coincide con lo solicitado por la clase Menu (Patron Facade).
    // Al ser un diccionario la key (propiedad) coincide con el tipo de entidad, y value (valor),
    // contiene las preguntas necesarias a realizar.
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

    // Aca se fuerza el tipado de las preguntas elegidas
    // para que lo acepte correctamente el metodo de la clase Menu

    // Al recibirse que tipo de instancia por parametro (sucursal | proveedor | cliente | mascota),
    // se utilizar para acceder al diccionario y obtener las preguntas necesarias para crear ese tipo de clase.
    // Se usa type assertion para que TS olvide cualquier inferencia de tipo que tenga (as unknown) y luego
    // se fuerza el tipo para que coincida con el que acepta la clase Menu (as TPreguntas).
    const preguntasTipo = preguntas[tipo] as unknown as TPreguntas;

    // Limpieza condicional de la consola y se
    // muestra titulo del menú.
    if (!asignacion) {
      // Si es para asignar, se deja cola de menu anterior,
      // si no, se limpia lo anterior.
      console.clear();
    }
    console.log(`CREAR NUEVO REGISTRO DE TIPO ${tipo.toUpperCase()}`);
    console.log("///////////////////////////////////////////////////");

    // Se envia el listado de preguntas a la consola, y se aguarda que el
    // usuario termine de contestar cada una de ellas, para luego almacenar
    // los valores ingresados en la variables respuesta.
    const respuestas = await Menu.listaPreguntas(preguntasTipo);

    // Impresion de pie de menú
    console.log("///////////////////////////////////////////////////");

    // Se envia las respuestas al metodo crear de la clase Veterinaria
    // con el formato { propiedad: valor } y se guarda la entidad creada
    // en una variable.
    const entidadCreada = this.veterinaria.crear(tipo, respuestas);

    // Si el tipo de entidad creada es de tipo Mascota:
    if (entidadCreada instanceof Mascota) {
      // Se pide al usuario que seleccione (o cree) un registro
      // de tipo Cliente (se envia al menu consultar y hace todo el ciclo).
      // Luego se guarda el resultado en la variable cliente.
      // Como menuConsultar devuelve un objeto se extrae la entidad de resultado.data
      // y se fuerza al tipo Cliente para acceder a sus metodos.
      const cliente = (await this.menuConsultar("cliente", true))
        .data as Cliente;
      // Chequeamos que cliente no este vacio
      if (cliente) {
        // y asignamos la Mascota recien creada a ese cliente seleccionado.
        cliente.agregarMascota(entidadCreada as Mascota);
      }
    }

    // Si el tipo de entidad creada es de tipo Cliente:
    if (entidadCreada instanceof Cliente) {
      // Se pide al usuario que seleccione (o cree) un registro
      // de tipo Sucursal (se envia al menu consultar y hace todo el ciclo).
      // Luego se guarda el resultado en la variable sucursal.
      // Como menuConsultar devuelve un objeto se extrae la entidad de resultado.data
      // y se fuerza al tipo Sucursal para acceder a sus metodos.
      const sucursal = (await this.menuConsultar("sucursal", true))
        .data as Sucursal;
      // Chequeamos que sucursal no este vacio
      if (sucursal) {
        // y asignamos el Cliente recien creado a esa sucursal seleccionada.
        sucursal.agregarCliente(entidadCreada as Cliente);
      }
    }

    // Si el tipo de entidad creada es de tipo Sucursal o Proveedor
    if (
      entidadCreada instanceof Sucursal ||
      entidadCreada instanceof Proveedor
    ) {
      // Se guarda en la clase veterinaria.
      this.veterinaria.guardar(tipo, entidadCreada);
    }

    // Se devuelve la instancia creada.
    return entidadCreada;
  }

  /**
   * Muestra el menú de edición para una entidad específica.
   * Permite al usuario editar propiedades de una entidad existente, eliminarla o registrar una visita.
   */
  private async menuEdicion(
    tipo: TEntidad,
    entidad: Sucursal | Proveedor | Cliente | Mascota
  ) {
    // Desde el diccionario de argumentos de la clase Veterinaria y utilizando
    // "tipo" como filtro, obtenemos un listado de las propiedades editables de
    // cada tipo de entidad, sumado a que tipo de valor necesita esa propiedad, y si
    // si tiene o no un conjunto de opciones de valores aceptados.

    const opciones = Veterinaria.argumentos[tipo].map((arg) => {
      // Una vez obtenido el listado de propiedades, se mapean y se tranforman
      // en un formato aceptado por la clase Menu para mostrarlos en consola.
      return {
        value: arg.nombre,
        name: `${arg.nombre.charAt(0).toUpperCase() + arg.nombre.slice(1)}`,
      };
    });

    // En el caso de que se este por editar una registro de tipo Cliente,
    // se agrega una opcion de registrar visita (se hace de manera manual,
    // ya que es un caso especial, y el unico en la aplicacion).
    if (entidad instanceof Cliente) {
      opciones.push({ value: "registrar", name: "➕ Registrar visita" });
    }

    // Se agregan a la cola de opciones, la opcion de eliminar
    // el registro y de volver hacia el menu anterior.
    opciones.push(
      { value: "eliminar", name: "❌ Eliminar registro" },
      { value: "salir", name: "↩️  Atras" }
    );

    // Se limpia la consola, y se imprime el encabezado
    // del menu.
    console.clear();
    console.log("///////////////////////////////////////////////////");
    console.log(`MENU PARA EDITAR ${tipo.toUpperCase()}: ${entidad.getID()}`);

    // Se imprime ficha del registro (ver comentarios en el metodo)
    this.imprimirFicha(tipo, entidad);

    // y se envian las opciones al usuario, para
    // que seleccione que dato del registro quiere modificar, sumado
    // a la opcion de eliminar y salir.
    const opcion = await Menu.elegirOpcion(
      "Que dato quieres modificar?",
      opciones
    );

    // Si la opcion es "salir", se retorna null
    // y se termina el metodo, volviendo al menu principal.
    if (opcion === "salir") {
      return null;
    }

    // Si el usuario eligio "registrar" se infiere que el registro
    // es de tipo Cliente (no se muestra la opcion en otro registro , aunque se podria sumar
    // dicha validacion en un refactoreo)
    if (opcion === "registrar") {
      // Se fuerza el tipo de entidad como Cliente, y se ejecuta el metodo
      // agregarVisita() el cual aumenta la propiedad visitas, y chequeas si es Vip o no.
      (entidad as Cliente).agregarVisita();
      // Se muestra un mensaje de exito.
      console.log("✅ Visita registrada exitosamente.");
    }

    // Si la opcion seleccionada es "eliminar"
    if (opcion === "eliminar") {
      // Se informa al usuario la repercucion de la accion,
      console.log(
        "⚠️ La siguiente accion borrara el registro seleccionado y todos los datos relacionados."
      );
      // y se solicita confirmacion:
      const confimacion = await Menu.pedirConfirmacion(
        "⛔ ¿Estas seguro que deseas eliminar el/los registro/s?"
      );

      // Si el usuario confirma la eliminacion
      if (confimacion) {
        // Se envia el id de la entidad a la clase Veterinaria
        // para que elimine el registro
        this.veterinaria.eliminar(tipo, entidad.getID());
        // y se retorna al menu principal.
        return null;
      }
    }

    // Si se llego a esta parte, es porque el usuario selecciono
    // modificar una propiedad del registro.
    // Entonces, se utiliza el valor de la opcion seleccionada, para
    // encontrar el arguemnto a editar en el diccionario de argumentos.
    const argumentoAEditar = Veterinaria.argumentos[tipo].find(
      (arg) => arg.nombre === opcion
    );

    // Se declara variable auxiliar para guardar momentaneamente
    // el nuevo valor ingresado por el usuario.
    let nuevoValor;

    // Si se encontro el argumento buscado y
    if (argumentoAEditar !== undefined) {
      // si el argumento es de tipo string,
      if (argumentoAEditar.tipo === "texto") {
        // se pide al usuario que ingrese el nuevo valor,
        // utilizando el metodo para tomar valores texto en la consola.
        nuevoValor = await Menu.pedirTexto(
          `Ingresa el nuevo valor para ${argumentoAEditar.nombre}`
        );
      } else if (argumentoAEditar.tipo === "numero") {
        // si el argumento es de tipo number,
        // se pide al usuario que ingrese el nuevo valor,
        // utilizando el metodo para tomar valores numericos en la consola.
        nuevoValor = await Menu.pedirNumero(
          `Ingresa el nuevo valor para ${argumentoAEditar.nombre}`
        );
      } else {
        // si el argumento es de tipo lista,
        // se pide al usuario que seleccione el nuevo valor,
        // utilizando el metodo para mostrar opciones elegibles en la consola.
        nuevoValor = await Menu.elegirOpcion(
          `Selecciona el nuevo valor para ${argumentoAEditar?.nombre}`,
          argumentoAEditar?.opciones!
        );
      }

      // Una vez que se tiene tanto el argumento que se esta
      // editando, como el nuevo valor ingresado por el usuario,
      // se llama al metodo editar de la clase Veterinaria, pasandole
      // la entidad, y un objeto que indica la propiedad a editar, y
      // el nuevo valor.
      this.veterinaria.editar(entidad, {
        propiedad: argumentoAEditar.nombre,
        valorNuevo: nuevoValor,
      });
    }

    // Se le consulta al usuario si quiere continuar editando
    const confimacion = await Menu.pedirConfirmacion(
      "🆗 ¿Desea continuar editando?"
    );

    // en caso afirmativo, se vuelve a cargar el menu edicion
    // pasandole el mismo tipo y entidad
    if (confimacion) {
      await this.menuEdicion(tipo, entidad);
    }

    // Si no se devuelve void, y se redirige al menu principal.
  }

  /**
   * Imprime la ficha detallada de una entidad, formateando la
   * información de la entidad para que sea mas legible.
   */
  private imprimirFicha(
    tipo: TEntidad,
    entidad: Sucursal | Proveedor | Cliente | Mascota
  ) {
    console.log("///////////////////////////////////////////////////");
    console.log(`Ficha de ${tipo.toUpperCase()}`);
    console.log("---------------------------------------------------");

    // Creamos una matriz de clave-valor con el metodo entries
    // del prototipo Object de JavaScript. Es decir que por cada clase
    // que pasemos vamos a obtener un resultado con el siguiente formato:
    // [ ["propiedad1", valor1], ["propiedad2", valor2 ], ["propiedad3", valor3] ].
    // Luego iteramos esa matriz con el bucle for..of usando una variable de tipo
    // array donde en la primera posicion se guarda el valor de la propiedad, y en 
    // la segunda posicion el valor -> const [propiedad, valor]
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
          console.log(`${propMayuscula.padEnd(15, " ")}: Sin registros`);
        } else {
          // Imprime titulo de la lista
          console.log(`${propMayuscula.padEnd(15, " ")}: `);
          valor.forEach((item) => {
            // Agrego 15 espacios en blanco para simular sangria izquierda.
            console.log(`${" ".repeat(15)}- ${item.getNombre()}`);
          });
        }
      } else {
        // Si no es array, se imprime en una sola linea.
        console.log(`${propMayuscula.padEnd(15, " ")}: ${valor}`);
      }
    }

    console.log("///////////////////////////////////////////////////");
  }
}
