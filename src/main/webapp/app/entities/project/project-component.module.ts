import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventPlannerSharedModule } from 'app/shared/shared.module';
import { ProjectComponent } from './project.component';
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectUpdateComponent } from './project-update.component';
import { ProjectDeleteDialogComponent } from './project-delete-dialog.component';
import { ProjectCreateComponent } from './project-create.component';

@NgModule({
  imports: [EventPlannerSharedModule, RouterModule],
  exports: [ProjectCreateComponent],
  declarations: [ProjectComponent, ProjectDetailComponent, ProjectCreateComponent, ProjectUpdateComponent, ProjectDeleteDialogComponent],
  entryComponents: [ProjectDeleteDialogComponent],
})
export class ProjectComponentModule {}