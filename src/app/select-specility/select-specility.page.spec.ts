import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectSpecilityPage } from './select-specility.page';

describe('SelectSpecilityPage', () => {
  let component: SelectSpecilityPage;
  let fixture: ComponentFixture<SelectSpecilityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSpecilityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSpecilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
