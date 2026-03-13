import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: any;

  beforeEach(async () => {
    vi.useFakeTimers();
    authServiceSpy = {
      loading: signal(false),
      error: signal(''),
      login: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login with username extracted from email', () => {
    component.email = 'john.doe@test.com';
    component.connect();
    expect(authServiceSpy.login).toHaveBeenCalledWith('john.doe');
  });

  it('should trigger shake if email is empty', () => {
    component.email = '';
    component.connect();
    expect(component.shake()).toBe(true);
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should clear shake after timeout', async () => {
    component.email = '';
    component.connect();
    expect(component.shake()).toBe(true);
    
    vi.advanceTimersByTime(400);
    expect(component.shake()).toBe(false);
  });
});
