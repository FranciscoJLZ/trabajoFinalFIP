// Mensaje de bienvenida
// Elija una opcion:
/**
 * 1. Ingresar menu sucursales
 * 2. Ingresar menu proveedores
 * 3. Salir
 */

import { Menu } from "./models/Menu";
import { Sucursal } from "./models/Sucursal";
import { Proveedor, Veterinaria } from "./models/Veterinaria";

/// Menu Sucursal
/**
 * 1. Ver Sucursales
 * 2. Crear Sucursal nueva
 * 3. <- Atras
 */

// 1. Menu ver sucursales
// a. Muestra listado de sucursales (seleccionables) -> options = { name: NOMBRESUCURSAL, value: IDSUCURSAL }[]
// b. <- Atras

// a. Al seleccionar una sucursal, se despliega el menu de la sucursal
// Ver clientes
// Editar sucursal (nombre, telefono)
// Cerrar sucursal
// <- Atras

/// Menu Proveedor
/**
 * 1. Ver Proveedores
 * 2. Crear Proveedor nuevo
 * 3. <- Atras
 */

// 1. Menu ver proveedores
// a. Muestra listado de proveedores (seleccionables) -> options = { name: NOMBREPROVEEDOR, value: IDPROVEEDOR }[]
// b. <- Atras

// a. Al seleccionar un proveedor, se despliega el menu del proveedor
// Ver proveedores
// Editar proveedor (nombre, telefono)
// Dar de baja proveedor
// <- Atras

export class MenuVeterinaria {
  private veterinaria: Veterinaria;

  constructor() {
    this.veterinaria = new Veterinaria();
  }

  public async menuPrincipal() {
    console.clear();

    const opciones = [
      { value: "sucursal", name: "Menu Sucursales" },
      { value: "proveedor", name: "Menu Proveedores" },
      { value: "salir", name: "Salir" },
    ];

    const opcion = await Menu.elegirOpcion(
      "Por favor elige una opcion",
      opciones
    );

    if (opcion === "sucursal") {
      this.subMenu("sucursal");
    } else if (opcion === "proveedor") {
      this.subMenu("proveedor");
    } else {
      console.log("Adios. Muchas gracias!");
      process.exit(0);
    }
  }

  private async subMenu(tipo: "sucursal" | "proveedor") {
    console.clear();

    const opciones = [
      {
        value: "ver",
        name: `Consultar ${tipo === "sucursal" ? "sucursales" : "proveedores"}`, //funciona como un if compacto :D
      },
      {
        value: "alta",
        name: `Dar de alta ${tipo === "sucursal" ? "sucursal" : "proveedor"}`,
      },
      { value: "salir", name: "Atras" },
    ];

    const opcion = await Menu.elegirOpcion(
      "Por favor elige una opcion",
      opciones
    );

    if (opcion === "alta") {
      this.subMenuAlta(tipo);
    } else if (opcion === "ver") {
      this.subMenuLista(tipo);
    } else {
      this.subMenu(tipo);
    }
  }

  private async subMenuLista(tipo: "sucursal" | "proveedor") {
    console.clear();
    let opciones = this.veterinaria.verTodos(tipo);
    if (opciones.length === 0) {
      // Avisar que no hay nada dado de alta
      console.log(`Aun no hay ${tipo}es para listar.`);
      // Preguntar si quiere dar de alta uno nuevo
      const confirmacion = await Menu.pedirConfirmacion(
        "Quieres dar de alta uno nuevo"
      );

      if (confirmacion) {
        // Afirmativo: Ir a menu de alta de entidadr
        this.subMenuAlta(tipo);
      } else {
        // Negativo: Volver al menu principal
        this.menuPrincipal();
      }
    } else {
      opciones.push({ value: "salir", name: "Atras" });
      const opcion = await Menu.elegirOpcion(
        "Por favor elige una opcion",
        opciones
      );

      if (opcion === "salir") {
        this.menuPrincipal();
      } else {
        const entidad = this.veterinaria.buscar(tipo, opcion);
        if (!entidad) {
          console.log("entidad no encontrada");
        } else {
          this.subMenuEdicion(entidad);
        }
      }
    }
  }

  private async subMenuAlta(tipo: "sucursal" | "proveedor") {
    console.log(
      `Crear ${tipo === "sucursal" ? "nueva sucursal" : "nuevo proveedor"}`
    );
    /*Carga nombre y num */
    const nombre = await Menu.pedirTexto("Nombre");
    const numero = await Menu.pedirNumero(
      `${tipo === "sucursal" ? "Numero" : "Telefono"}`
    );

    if (tipo === "sucursal") {
      const sucursal = new Sucursal(nombre, numero);
      this.veterinaria.agregar("sucursal", sucursal);
      console.log("Se ha creado la sucursal: ", sucursal);
    } else {
      const proveedor = new Proveedor(nombre, numero);
      this.veterinaria.agregar("proveedor", proveedor);
      console.log("Se ha creado el proveedir: ", proveedor);
    }

    const opciones = [
      {
        value: "alta",
        name: `Dar de alta ${
          tipo === "sucursal" ? "otra sucursal" : "otro proveedor"
        }`,
      },
      { value: "salir", name: "Volver al menu principal" },
    ];
    // Aca podria hacer opciones (Crear otro // Salir)
    const opcion = await Menu.elegirOpcion(
      "Que quieres hacer a continuacion",
      opciones
    );
    console.clear();

    if (opcion === "alta") {
      this.subMenuAlta(tipo);
    } else {
      this.menuPrincipal();
    }
  }
  /* seguir laburando menu edicion
   "" cliente y mascota 
   "" edicion de sucursales y proveedores
   "" alta y baja de mascotas y clientes
   "" se sigue viendo
*/
  private async subMenuEdicion(obj: Sucursal | Proveedor) {
    console.clear();
    console.log("Menu para editar", obj);

    const confirmacion = await Menu.pedirConfirmacion(
      "Quieres volver al menu principal?"
    );

    if (confirmacion) {
      this.menuPrincipal();
    }
  }
}

//---- index.ts

const sistema = new MenuVeterinaria();
sistema.menuPrincipal();
