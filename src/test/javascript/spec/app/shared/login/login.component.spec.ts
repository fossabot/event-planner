import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LoginService } from 'app/core/login/login.service';
import { LoginComponent } from 'app/shared/login/login.component';
import { EventPlannerTestModule } from '../../../test.module';
import { MockLoginService } from '../../../helpers/mock-login.service';
import { MockRouter } from '../../../helpers/mock-route.service';
import { MockActiveModal } from '../../../helpers/mock-active-modal.service';

describe('Component Tests', () => {
  describe('LoginComponent', () => {
    let comp: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let mockLoginService: MockLoginService;
    let mockRouter: MockRouter;
    let mockActiveModal: MockActiveModal;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [EventPlannerTestModule],
        declarations: [LoginComponent],
        providers: [
          FormBuilder,
          {
            provide: LoginService,
            useClass: MockLoginService,
          },
        ],
      })
        .overrideTemplate(LoginComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      comp = fixture.componentInstance;
      mockLoginService = TestBed.get(LoginService);
      mockRouter = TestBed.get(Router);
      mockActiveModal = TestBed.get(NgbActiveModal);
    });

    it('should authenticate the user', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        const credentials = {
          username: 'admin',
          password: 'admin',
        };

        comp.loginForm.patchValue({
          username: 'admin',
          password: 'admin',
        });
        mockLoginService.setResponse({});
        mockRouter.url = '/admin/metrics';

        // WHEN/
        comp.login();
        tick(); // simulate async

        // THEN
        expect(comp.authenticationError).toEqual(false);
        expect(mockActiveModal.closeSpy).toHaveBeenCalled();
        expect(mockLoginService.loginSpy).toHaveBeenCalledWith(credentials);
      })
    ));

    it('should empty the credentials upon cancel', () => {
      // GIVEN
      comp.loginForm.patchValue({
        username: 'admin',
        password: 'admin',
      });

      const expected = {
        username: '',
        password: '',
      };

      // WHEN
      comp.cancel();

      // THEN
      expect(comp.authenticationError).toEqual(false);
      expect(comp.loginForm.get('username')!.value).toEqual(expected.username);
      expect(comp.loginForm.get('password')!.value).toEqual(expected.password);
      expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('cancel');
    });

    it('should redirect user when register', () => {
      // WHEN
      comp.register();

      // THEN
      expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('to state register');
      expect(mockRouter.navigateSpy).toHaveBeenCalledWith(['/account/register']);
    });

    it('should redirect user when request password', () => {
      // WHEN
      comp.requestResetPassword();

      // THEN
      expect(mockActiveModal.dismissSpy).toHaveBeenCalledWith('to state requestReset');
      expect(mockRouter.navigateSpy).toHaveBeenCalledWith(['/account/reset', 'request']);
    });
  });
});
