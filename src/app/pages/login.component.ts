import { Component, signal, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  isConnecting = signal(false);
  shake = signal(false);
  error = signal('');

  @ViewChild('promptText') promptTextRef!: ElementRef<HTMLSpanElement>;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    // Typing effect for the terminal prompt
    const text = 'identification';
    let i = 0;
    const interval = setInterval(() => {
      if (this.promptTextRef?.nativeElement) {
        this.promptTextRef.nativeElement.textContent = text.slice(0, ++i);
      }
      if (i >= text.length) clearInterval(interval);
    }, 60);
  }

  connect() {
    this.error.set('');
    const em = this.email.trim();
    const pw = this.password.trim();

    if (!em) {
      this.triggerError('Veuillez entrer votre email');
      return;
    }
    if (!pw) {
      this.triggerError('Veuillez entrer votre mot de passe');
      return;
    }

    this.isConnecting.set(true);
    // Simulated auth — use email prefix as username
    setTimeout(() => {
      const username = em.split('@')[0];
      this.auth.login(username);
    }, 900);
  }

  private triggerError(msg: string) {
    this.error.set(msg);
    this.shake.set(true);
    setTimeout(() => this.shake.set(false), 400);
    setTimeout(() => this.error.set(''), 3000);
  }
}
