import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root',
})
export class AuthService{
    users: any = [
        {id:1, username:'aman1234', email:'aman@gmail.com', password:'aman1234'},
    ]

    token:string = 'AMAN-TRIPATHI';

    login(param:any){
        const user = this.users.find((user:any) => user.email === param.email && user.password === param.password) ?? {};
        if(!user && !Object.keys(user).length){
            return {data:null, status:false, message:"User is not valid"};
        }else{
            localStorage.setItem('token', this.token);
            return {data:user, status:true, message:"User loggedin successfully."};
        };
    };

    logOut(){
        localStorage.removeItem('token');
    };

    getToken(){
        return localStorage.getItem('token');
    }

    authentication(){
        console.log(this.getToken());
        
        return !!this.getToken();
    }
}