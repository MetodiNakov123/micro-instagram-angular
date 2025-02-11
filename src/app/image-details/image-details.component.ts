import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Image } from '../data/image';
import { DataService } from '../data/data.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Location } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY, filter, Observable, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-image-details',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './image-details.component.html',
  styleUrl: './image-details.component.css'
})

export class ImageDetailsComponent implements OnInit {
  imageDetails$: Observable<Image> = EMPTY;

  constructor(private dataService: DataService, private route: ActivatedRoute, 
              private snackBar: MatSnackBar, private dialog: MatDialog, private location: Location) 
  {}

  ngOnInit() {
    this.imageDetails$ = this.route.paramMap
      .pipe(
        switchMap(params => {
          const imageId = params.get('id') ?? '';
          console.log('id :', imageId);
          return this.dataService.getImageDetails(imageId)
            .pipe(
              tap(image => console.log('image details: ', image)),
              catchError(error => {
                console.log('error: ', error);
                this.showSnackBar('Failed to load image details :(');
                return EMPTY;
              })
            )
        })
      )
  }

  onSubmit(form: NgForm){
    console.log('in onSubmit: ', form.valid);

    if (form.valid){
      this.imageDetails$.pipe(
        untilDestroyed(this),
        switchMap(imageDetails => {
          return this.dataService.updateImage(imageDetails).pipe(
            tap(image => {
              console.log('Saved image: ', image);
              this.showSnackBar('Successfully saved!');
            }),
            catchError(error => {
              console.log('error: ', error);
              this.showSnackBar('Save failed!!!');
              return EMPTY;
            })
          )
        })
      ).subscribe();
    }
  }

  deleteItem(item: Image): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete?` }
    });

    dialogRef.afterClosed().pipe(
      untilDestroyed(this),
      filter(result => Boolean(result)),
      switchMap(() => this.dataService.deleteImage(item.id.toString())
          .pipe(
            tap(() => {
              console.log(`Deleted: ${item.title}`);
              this.showSnackBar("Successfully deleted!");
              this.goBack();
            }),
            catchError(error => {
              console.log('Error: ', error);
              this.showSnackBar('Unsuccessful deletion!!!');
              return EMPTY;
            })
          )
      )
    ).subscribe();
  }

  goBack() {
    this.location.back();
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,       
      horizontalPosition: 'center', 
      verticalPosition: 'bottom'
    });
  }
}
