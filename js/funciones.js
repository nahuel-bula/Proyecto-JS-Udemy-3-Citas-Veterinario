import UI from './classes/UI.js'
import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from './selectores.js'
//Modo edicion
let editando = false;
//IndexedDB
export let DB;

const ui = new UI();

//Objeto con informacion de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

//Funciones

//Agrega datos al objeto de la cita
export function datosCita(e){
    citaObj[e.target.name]=e.target.value;
}

//Valida y agrega una nueva cita a la clase de citas
export function nuevaCita(e){
    e.preventDefault();
    //Extrae la informacion de la cita
    const {mascota,propietario,telefono,fecha,hora,sintomas} = citaObj;
    //Validacion
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }
    if (editando){
        //Edita la cita
        //Editar en indexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        //Habilitar objectStore
        const objectStore = transaction.objectStore('citas');
        //Edita el objeto a la db
        objectStore.put(citaObj);
        transaction.oncomplete = function(){
            ui.imprimirAlerta('Editado correctamente');
            //Cambiar texto del boton
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
            editando = false;
        }
    }else{
        //Crea una cita nueva
        citaObj.id = Date.now();
        ui.imprimirAlerta('Se agregó correctamente');
        //Agregar a indexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        //Habilitar objectStore
        const objectStore = transaction.objectStore('citas');
        //Agregar el objeto a la db
        objectStore.add(citaObj);
        transaction.oncomplete = function(){
            ui.imprimirAlerta('Se agregó correctamente a IndexedDB')
        }
    }
    //Reinicio objeto
    reiniciarObjeto();
    //Reinicio formulario
    formulario.reset();
    //Mostrar las citas
    ui.mostrarCitas();
}

export function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

//Elimina una cita
export function eliminarCita(id){
    //Eliminar de indexedDB
    const transaction = DB.transaction(['citas'], 'readwrite');
    //Habilitar objectStore
    const objectStore = transaction.objectStore('citas');
    //Eliminar el objeto a la db
    objectStore.delete(id);
    transaction.oncomplete = function(){
        ui.imprimirAlerta('La cita se eliminó correctamente');
        ui.mostrarCitas();
    }
}

//Carga los datos y el modo edicion

export function editarCita(cita){
    const {mascota,propietario,telefono,fecha,hora,sintomas} = cita;
    //Cargar los campos
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;
    //Cargar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = cita.id;
    //Cambiar texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}

export function crearDB(){
    const crearDB = window.indexedDB.open('citas',1);
    crearDB.onsuccess = function(){
        DB = crearDB.result;
        //Mostrar citas al cargar la pagina
        ui.mostrarCitas();
    }
    //definir schema
    crearDB.onupgradeneeded = function(e){
        const db = e.target.result;
        const objectStore = db.createObjectStore('citas',{
            keyPath: 'id',
            autoincrement: true
        })
        
        objectStore.createIndex('mascota','mascota',{ unique: false });
        objectStore.createIndex('propietario','propietario',{ unique: false });
        objectStore.createIndex('telefono','telefono',{ unique: false });
        objectStore.createIndex('fecha','fecha',{ unique: false });
        objectStore.createIndex('hora','hora',{ unique: false });
        objectStore.createIndex('sintomas','sintomas',{ unique: false });
        objectStore.createIndex('id','id',{ unique: true });
    }
    


}