import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
  Type
} from '@angular/core'
import { DialogModule } from 'src/app/dialog/dialog.module';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DialogConfig } from 'src/app/dialog/dialog-config';
import { DialogInjector } from 'src/app/dialog/dialog-injector';
import { DialogRef } from 'src/app/dialog/dialog-ref';

@Injectable({
  providedIn: DialogModule,
})
export class DialogService {
  dialogComponentRef: ComponentRef<DialogComponent>

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  appendDialogComponentToBody(config: DialogConfig) {

    const map = new WeakMap();
    map.set(DialogConfig, config);

   // add the DialogRef to dependency injection
   const dialogRef = new DialogRef();
   map.set(DialogRef, dialogRef);

   // we want to know when somebody called the close mehtod
   const sub = dialogRef.afterClosed.subscribe(() => {
     // close the dialog
     this.removeDialogComponentFromBody();
     sub.unsubscribe();
   });

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    const componentRef = componentFactory.create(new DialogInjector(this.injector, map));
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.dialogComponentRef = componentRef;

    this.dialogComponentRef.instance.onClose.subscribe(() => {
      this.removeDialogComponentFromBody();
    });

    // return the dialogRef
    return dialogRef;

  }
  private removeDialogComponentFromBody() {
    this.appRef.detachView(this.dialogComponentRef.hostView);
    this.dialogComponentRef.destroy();
  }
  public open(componentType: Type<any>,config: DialogConfig) {
    const dialogRef = this.appendDialogComponentToBody(config);
    this.dialogComponentRef.instance.childComponentType = componentType;
    return dialogRef;
  }
}