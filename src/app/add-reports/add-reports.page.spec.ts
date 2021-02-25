import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddReportsPage } from './add-reports.page';

describe('AddReportsPage', () => {
  let component: AddReportsPage;
  let fixture: ComponentFixture<AddReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
