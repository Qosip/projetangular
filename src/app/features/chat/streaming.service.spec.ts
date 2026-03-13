import { TestBed } from '@angular/core/testing';
import { StreamingService } from './streaming.service';
import { ToastService } from '../../shared/services/toast.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('StreamingService', () => {
  let service: StreamingService;
  let toastServiceSpy: { show: any };

  beforeEach(() => {
    vi.useFakeTimers();
    const spy = { show: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        StreamingService,
        { provide: ToastService, useValue: spy }
      ]
    });
    service = TestBed.inject(StreamingService);
    toastServiceSpy = TestBed.inject(ToastService) as any;
    
    // Mock global fetch
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default states', () => {
    expect(service.isStreaming()).toBe(false);
    expect(service.streamingMessages()).toEqual({});
    expect(service.completedMessages()).toEqual([]);
  });

  it('should handle fetch failure', async () => {
    const onComplete = vi.fn();
    (fetch as any).mockRejectedValue({ name: 'TypeError', message: 'Failed to fetch' });

    service.startStream(1, onComplete);
    
    // Resolve promises
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalled());

    expect(toastServiceSpy.show).toHaveBeenCalledWith('Failed to fetch');
    expect(service.isStreaming()).toBe(false);
  });

  it('should handle non-ok response', async () => {
    const onComplete = vi.fn();
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500
    });

    service.startStream(1, onComplete);
    
    await vi.waitFor(() => expect(service.isStreaming()).toBe(false));

    expect(toastServiceSpy.show).toHaveBeenCalledWith('Erreur serveur: 500');
  });

  it('should trigger watchdog if no data received', async () => {
    const onComplete = vi.fn();
    const mockReader = {
      read: () => new Promise(() => {}) // Never resolves
    };
    const mockResponse = {
      ok: true,
      body: {
        getReader: () => mockReader
      }
    };
    (fetch as any).mockResolvedValue(mockResponse);

    service.startStream(1, onComplete);
    
    // Wait for the fetch promise to resolve and start the loop
    await vi.advanceTimersByTimeAsync(0); 
    
    // Advance timers by 10s (watchdog)
    vi.advanceTimersByTime(10000);
    
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Le serveur ne répond plus');
    expect(service.isStreaming()).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });

  it('should stop stream when stopStream is called', () => {
    (fetch as any).mockResolvedValue(new Promise(() => {}));
    service.startStream(1, () => {});
    
    expect(service.isStreaming()).toBe(true);
    
    service.stopStream();
    expect(service.isStreaming()).toBe(true); 
  });
});
