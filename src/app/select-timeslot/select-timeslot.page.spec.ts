import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectTimeslotPage } from './select-timeslot.page';

describe('SelectTimeslotPage', () => {
  let component: SelectTimeslotPage;
  let fixture: ComponentFixture<SelectTimeslotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTimeslotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectTimeslotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
