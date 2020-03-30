import {
  Component,
  Type,
  OnDestroy,
  AfterViewInit,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
  ChangeDetectorRef,
  ViewContainerRef,
} from '@angular/core'
import { InsertionDirective } from './insertion.directive'
import { Subject } from 'rxjs/internal/Subject';
import { DialogRef } from 'src/app/dialog/dialog-ref';
import { DialogConfig } from 'src/app/dialog/dialog-config';

@Component({
  selector: 'app-dialog',
  // templateUrl: './dialog.component.html',
  template:`<div class="overlay" (click)="onOverlayClicked($event)">
  <div class="dialog" (click)="onDialogClicked($event)">
  <div class="edit_header">
  <h2>{{dialogTitle}}</h2>
  <i class="fa fa-times" aria-hidden="true" (click)="onDialogClose()"></i>
</div>
      <ng-container #vc> </ng-container>
  </div>
</div>`,
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  public readonly _onClose = new Subject<any>()

  public componentRef: ComponentRef<any>
  public childComponentType: Type<any>
  public onClose = this._onClose.asObservable()
  

  public dialogTitle = ""

  // add this:
  // @ViewChild(InsertionDirective, { static: true ,read: InsertionDirective}) 
  // insertionPoint : InsertionDirective;
  // @ViewChild(InsertionDirective, {static: false})
  // insertionPoint: InsertionDirective
  // @ViewChild('parent', {static: true,read: ViewContainerRef})
  // parent: ViewContainerRef;

  @ViewChild('vc', {static: true,read: ViewContainerRef}) vc: ViewContainerRef;
  // and this:
  constructor(public componentFactoryResolver: ComponentFactoryResolver, public cd: ChangeDetectorRef,public dialog: DialogRef,public config: DialogConfig) { }


  onOverlayClicked(evt: MouseEvent) {
    // close the dialog
  }

  onDialogClicked(evt: MouseEvent) {
    evt.stopPropagation()
  }
  loadChildComponent(componentType: Type<any>) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    // let viewContainerRef = this.insertionPoint.viewContainerRef;
    // viewContainerRef.clear();
    this.componentRef = this.vc.createComponent(componentFactory);
    // this.componentRef = this.parent.createComponent(componentFactory);
  }
  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
  onDialogClose() {
    this.dialog.close('some value')
  }
  ngAfterViewInit() {
    if(this.config.data.dialogTitle){
      this.dialogTitle = this.config.data.dialogTitle;
    }
    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
  }
}