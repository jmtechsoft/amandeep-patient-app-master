import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayVideoPage } from './play-video.page';

describe('PlayVideoPage', () => {
  let component: PlayVideoPage;
  let fixture: ComponentFixture<PlayVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayVideoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
