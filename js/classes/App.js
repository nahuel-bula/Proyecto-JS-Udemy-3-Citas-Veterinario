import { formulario } from '../selectores.js'
import {datosCita, nuevaCita, crearDB} from '../funciones.js'


class App{
    constructor(){
        this.initApp();
    }

    initApp(){
        formulario.addEventListener('DOMContentLoaded', formulario.reset());
        formulario.addEventListener('input',datosCita);
        formulario.addEventListener('submit', nuevaCita);
        crearDB();

    }
}

export default App;