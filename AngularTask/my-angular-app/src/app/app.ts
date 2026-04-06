import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-angular2');
  message: string = "Hello from Parent Component!";
  
  student = {
    name: "Shehryar",
    rollNo: 604
  };
}