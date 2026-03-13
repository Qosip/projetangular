import { Component, signal, OnInit, ElementRef, ViewChild, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);

  email = '';
  password = '';
  isConnecting = this.auth.loading;
  shake = signal(false);
  error = this.auth.error;

  @ViewChild('promptText') promptTextRef!: ElementRef<HTMLSpanElement>;

  ngOnInit() {
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
    if (!this.email.trim()) {
      this.triggerShake();
      return;
    }
    const name = this.email.trim().split('@')[0] || 'Operateur';
    this.auth.login(name);
  }

  private triggerShake() {
    this.shake.set(true);
    setTimeout(() => this.shake.set(false), 400);
  }
}
