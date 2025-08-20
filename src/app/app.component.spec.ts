import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

import { AppComponent } from './app.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  template: '<div>Mock TopBar</div>'
})
class MockTopBarComponent {}

@Component({
  selector: 'app-snip-save',
  standalone: true,
  template: '<div>Mock SnipSave</div>'
})
class MockSnipSaveComponent {}

@Component({
  selector: 'app-snips-saved',
  standalone: true,
  template: '<div>Mock SnipsSaved</div>'
})
class MockSnipsSavedComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([])
      ]
    })
    .overrideComponent(AppComponent, {
      remove: { imports: [MockTopBarComponent, MockSnipSaveComponent, MockSnipsSavedComponent] },
      add: { imports: [MockTopBarComponent, MockSnipSaveComponent, MockSnipsSavedComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});