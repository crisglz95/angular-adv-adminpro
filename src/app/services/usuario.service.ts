import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { LoginForm } from '../interfaces/login-form.interface';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;


  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { 
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role
  }

  guardarLocalStorage(token: string, menu: any){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  googleInit(){
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '84961272060-br3niqs14nb1aep61rrpbknko0mourdf.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    })
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const {email, google, img = '', nombre, role, uid} = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        this.guardarLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm){
    
    return this.http.post(`${base_url}/usuarios`, formData)
                .pipe(
                  tap((resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );

  }

  actualizarPerfil(data: {email: string, nombre: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role
    }
    
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);

  }

  login(formData: LoginForm){

    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap((resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );

  }

  loginGoogle(token){

    return this.http.post(`${base_url}/login/google`, {token})
                .pipe(
                  tap((resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );

  }

  cargarUsuarios(desde: number = 0){
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
              .pipe(
                map(resp => {
                  const usuarios = resp.usuarios.map(
                    user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                  );
                  return { total: resp.total, usuarios };
                })
              )
  }

  eliminarUsuario(usuario: Usuario){
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers)
  }

  guardarUsuario(data: Usuario){
    
    return this.http.put(`${base_url}/usuarios/${data.uid}`, data, this.headers);

  }

}
