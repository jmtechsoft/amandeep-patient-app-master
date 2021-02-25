import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectLocationPage } from './select-location.page';

describe('SelectLocationPage', () => {
  let component: SelectLocationPage;
  let fixture: ComponentFixture<SelectLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
