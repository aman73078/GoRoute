import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  signIn!: FormGroup;
  signUp!: FormGroup;

  mode: 'signin' | 'signup' = 'signin';
  authService: AuthService = inject(AuthService);
  constructor(private route:Router){
    this.signIn = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    this.signUp = new FormGroup({
      fullName: new FormControl(),
      password: new FormControl(),
      email: new FormControl(),
    });
  }

  get activeForm(): FormGroup{
    return this.mode === 'signin' ? this.signIn : this.signUp;
  }

  toggleMode() {
    this.mode = this.mode === 'signin' ? 'signup' : 'signin';
  }

  onSubmit(){
    console.log(this.activeForm);
    if(this.mode === 'signin'){
      const resp = this.authService.login({email:this.activeForm.value.email, password:this.activeForm.value.password});
      if(resp && resp.status){
        alert(resp.message);
        this.route.navigate(['overview/home']);

      }else{
        alert(resp.message);
      }
    }else{

    }
  }
}
