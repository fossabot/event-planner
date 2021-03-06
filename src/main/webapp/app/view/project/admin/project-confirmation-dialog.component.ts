import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProjectService } from 'app/entities/project/project.service';

import { Project } from 'app/shared/model/project.model';

@Component({
  templateUrl: './project-confirmation-dialog.component.html',
})
export class ProjectConfirmationDialogComponent {
  project?: Project;

  archive = false;
  delete = false;

  constructor(protected projectService: ProjectService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirm(id: number): void {
    if (this.archive) {
      this.projectService.archive(id).subscribe(() => {
        this.eventManager.broadcast('projectListModification');
        this.activeModal.close(true);
      });
    } else if (this.delete) {
      this.projectService.delete(id).subscribe(() => {
        this.eventManager.broadcast('projectListModification');
        this.activeModal.close(true);
      });
    }
  }
}
