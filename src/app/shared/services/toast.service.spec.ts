import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty list of toasts', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('should add a toast when show() is called', () => {
    service.show('Test Message', 'success');
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Test Message');
    expect(toasts[0].type).toBe('success');
  });

  it('should increment id for each new toast', () => {
    service.show('Message 1');
    service.show('Message 2');
    const toasts = service.toasts();
    expect(toasts[0].id).toBe(0);
    expect(toasts[1].id).toBe(1);
  });

  it('should remove a toast when dismiss() is called', () => {
    service.show('Message 1');
    const id = service.toasts()[0].id;
    service.dismiss(id);
    expect(service.toasts().length).toBe(0);
  });

  it('should automatically dismiss a toast after the specified duration', () => {
    service.show('Auto Dismiss', 'info', 2000);
    expect(service.toasts().length).toBe(1);
    
    vi.advanceTimersByTime(2000);
    expect(service.toasts().length).toBe(0);
  });

  it('should default to error type and 4000ms duration', () => {
    service.show('Default');
    const toasts = service.toasts();
    expect(toasts[0].type).toBe('error');
    
    vi.advanceTimersByTime(3999);
    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(service.toasts().length).toBe(0);
  });
});
