import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { menuPrincipal, permiso, userUniminuto } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UniminutoService {

  // urlApiWallet: string = 'http://localhost/api_wallet';
  urlApiWallet: string = 'https://comunidad.uniminuto.edu/api_wallet';

  constructor(
    private http: HttpClient
  ) { }

  getDA(user: string, password: string) {
    let pass = btoa(password);
    // return this.http.get<userUniminuto>(`https://registros.uniminuto.edu/api_da/select/index.php?fn=da&correo=${user.trim()}`);
    return this.http.get<userUniminuto>(`https://comunidad.uniminuto.edu/api/login/index.php/${ user.trim() }/${ pass }`);
  }

  getDARectificacion(correo: string) {
    return this.http.get<userUniminuto>(`https://registros.uniminuto.edu/api_da/select/index.php?fn=da&correo=${correo}`);
  }

  getGraduados(documento: any, nacimiento: any) {
    let pass = btoa(nacimiento);
    return this.http.get<userUniminuto>(`https://webapi.uniminuto.edu/API/LDAP/AutenticarUsuario/${documento}/${pass}/GRADUADO`);
  }

  getPrograma(id: string) {
    return this.http.get(`https://zonaestudiantes.uniminuto.edu/ServiciosAPI/API/BannerEstudiante/ConsultarProgramas/${id}`);
  }

  getMenuOpts() {
    return this.http.get<menuPrincipal>('../assets/data/menu.json');
  }

  getImage(documento: any) {
    return this.http.get(`https://comunidad.uniminuto.edu/api/select/index.php/image/${documento}`);
  }

  getColaboradores(documento: any) {
    return this.http.get(`https://comunidad.uniminuto.edu/api/select/index.php/cargo/${documento}`);
  }

  getDatosEstudiante(id: any) {
    return this.http.get(`https://webapi.uniminuto.edu/API/Mobile/DatosPersonales?V_Id=${id}`);
  }

  getPermisos(documento: string) {
    return this.http.get(`${this.urlApiWallet}/modules/permisos.php?fn=obtenerPermisos&documento=${documento}`);
  }
}
