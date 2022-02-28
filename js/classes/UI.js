import { eliminarCita, editarCita, DB } from '../funciones.js'
import { contenedorCitas } from '../selectores.js'

//Clase UI
class UI{
    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert', 'd-block', 'col-12');
        if (tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        divMensaje.textContent = mensaje;
        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'));
        setTimeout(()=>{
            divMensaje.remove();
        },2000)
    }

    mostrarCitas(){
        this.limpiarHtml(contenedorCitas);
        //Leer el contenido de la bd
        const objectStore = DB.transaction('citas').objectStore('citas');
        objectStore.openCursor().onsuccess = function(e){
            const cursor = e.target.result;
            if (cursor){
                    const {mascota,propietario,telefono,fecha,hora,sintomas,id} = cursor.value;
                const divCita = document.createElement('div');
                divCita.className = 'cita p-3';
                divCita.dataset.id = id;
                //Scripting de lo elementos de la cita
                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.className = 'cart-title font-weigth-bolder';
                mascotaParrafo.textContent = mascota;
                
                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML = `
                    <span class="font-weigth-bolder">Propietario: </span> ${propietario}
                `;
                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML = `
                    <span class="font-weigth-bolder">Telefono: </span> ${telefono}
                `;
                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `
                    <span class="font-weigth-bolder">Fecha: </span> ${fecha}
                `;
                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `
                    <span class="font-weigth-bolder">hora: </span> ${hora}
                `;
                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML = `
                    <span class="font-weigth-bolder">sintomas: </span> ${sintomas}
                `;
                //Boton para eliminar la cita
                const btnEliminar = document.createElement('button');
                btnEliminar.className = 'btn btn-danger mr-2';
                btnEliminar.innerHTML = `Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round"
                stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z">
                </path></svg>
                `;
                btnEliminar.onclick = ()=> eliminarCita(id);
                //Boton para editar la cita
                const btnEditar = document.createElement('button');
                btnEditar.className = 'btn btn-info mr-2';
                btnEditar.innerHTML = `Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" 
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" 
                stroke-linejoin="round" stroke-width="2" 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                </path></svg>
                `;
                const cita = cursor.value;
                btnEditar.onclick = ()=> editarCita(cita);
                //Agrega los parrafos al div
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);
                //Agrega las citas al html
                contenedorCitas.appendChild(divCita);
                //Avanza al siguiente elemento del cursor
                cursor.continue();
                }        
        }
    }

    limpiarHtml(dondeBorro){
        while (dondeBorro.firstChild){
            dondeBorro.removeChild(dondeBorro.firstChild)
        }
    }

}

export default UI;