
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'login',
    templateUrl: './login.html',
    styleUrl: './login.css',
    imports: [FormsModule]
})
export class Login {
    username ="";
    password = "";

    onSubmit() {
        console.log(`Login for user ${this.username} with password ${this.password}`);
    }
}