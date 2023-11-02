import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() {}

  async crearLlave(key: string, value: string){
    const llave = await Preferences.set({
      key,
      value
    });
    return llave;
  }

  async extraerLlave(llave: string) {
    return await Preferences.get({ key: llave});
  };

  async eliminarLlave(llave: string){
    await Preferences.remove({key: llave});
  }

  async limpiarLlaves(){
    await Preferences.clear();
  }
}
