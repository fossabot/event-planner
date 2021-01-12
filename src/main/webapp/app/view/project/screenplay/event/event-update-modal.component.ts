import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { EventUpdateComponent } from 'app/view/project/screenplay/event/event-update.component';

import * as moment from 'moment';

@Component({
  template: '',
})
export class EventUpdateModalComponent implements AfterViewInit, OnDestroy {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    combineLatest([this.activatedRoute.queryParams, this.activatedRoute.data]).subscribe((routeParams: any[]) => {
      let { startTime, endTime } = routeParams[0];
      const { section, event } = routeParams[1];

      if (startTime) {
        startTime = moment(startTime).toDate();
      }
      if (endTime) {
        endTime = moment(endTime).toDate();
      }

      this.modalRef = this.modalService.open(EventUpdateComponent, {
        beforeDismiss(): boolean {
          window.history.back();
          return true;
        },
      });

      (this.modalRef.componentInstance as EventUpdateComponent).updateForm(
        event || { sections: [section] },
        startTime || new Date(),
        endTime || new Date()
      );
    });
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}