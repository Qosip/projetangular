import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentConversationsComponent } from './recent-conversations';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

describe('RecentConversationsComponent', () => {
  let component: RecentConversationsComponent;
  let fixture: ComponentFixture<RecentConversationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentConversationsComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RecentConversationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('chats', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display list of chats', () => {
    fixture.componentRef.setInput('chats', [
      { id: 1, title: 'Chat 1', models: [], created_at: new Date().toISOString() }
    ]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Chat 1');
  });
});
