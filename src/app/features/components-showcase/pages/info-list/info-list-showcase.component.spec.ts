import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';

import { InfoListShowcaseComponent } from './info-list-showcase.component';

describe('InfoListShowcaseComponent', () => {
  let fixture: ComponentFixture<InfoListShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoListShowcaseComponent, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoListShowcaseComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
