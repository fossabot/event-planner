import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { EventPlannerTestModule } from '../../../test.module';
import { RoleComponent } from 'app/entities/role/role.component';
import { RoleService } from 'app/entities/role/role.service';
import { Role } from 'app/shared/model/role.model';

describe('Component Tests', () => {
  describe('Role Management Component', () => {
    let comp: RoleComponent;
    let fixture: ComponentFixture<RoleComponent>;
    let service: RoleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [RoleComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: of({
                defaultSort: 'name,asc',
              }),
              queryParamMap: of(
                convertToParamMap({
                  page: '1',
                  size: '1',
                  sort: 'name,desc',
                })
              ),
            },
          },
        ],
      })
        .overrideTemplate(RoleComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RoleComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RoleService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Role('AAA')],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.roles && comp.roles[0]).toEqual(jasmine.objectContaining({ name: 'AAA' }));
    });

    it('should load a page', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Role('AAA')],
            headers,
          })
        )
      );

      // WHEN
      comp.loadPage(1);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.roles && comp.roles[0]).toEqual(jasmine.objectContaining({ name: 'AAA' }));
    });

    it('should calculate the sort attribute for an id', () => {
      // WHEN
      comp.ngOnInit();
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['name,desc']);
    });
  });
});