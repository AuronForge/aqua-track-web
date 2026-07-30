import { TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PageTitleService } from './page-title.service';

describe('PageTitleService', () => {
  let service: PageTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty title and subtitle', () => {
    expect(service.title()).toBe('');
    expect(service.subtitle()).toBe('');
    expect(service.toolbarContent()).toBeNull();
  });

  it('should set title and subtitle explicitly', () => {
    service.set('Dashboard', 'Overview');

    expect(service.title()).toBe('Dashboard');
    expect(service.subtitle()).toBe('Overview');
  });

  it('should reset subtitle to empty string when omitted', () => {
    service.set('Dashboard', 'Overview');
    service.set('Home');

    expect(service.title()).toBe('Home');
    expect(service.subtitle()).toBe('');
  });

  it('should set and clear toolbar content explicitly', () => {
    const template = {} as TemplateRef<unknown>;

    service.setToolbarContent(template);
    expect(service.toolbarContent()).toBe(template);

    service.setToolbarContent(null);
    expect(service.toolbarContent()).toBeNull();
  });
});
