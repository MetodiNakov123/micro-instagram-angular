import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
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
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-image-details',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './image-details.component.html',
  styleUrl: './image-details.component.css'
})

export class ImageDetailsComponent implements OnInit {
  imageDetails: FormGroup;

  constructor(private dataService: DataService, private route: ActivatedRoute, private snackBar: MatSnackBar,
              private dialog: MatDialog, private location: Location, private formBuilder: FormBuilder) 
  {
     this.imageDetails = this.formBuilder.nonNullable.group({
      albumId: 0,
      id: 0,
      title: ['', Validators.required],
      url: ['', [Validators.required, Validators.minLength(5)]],
      thumbnailUrl: ''
     })
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        untilDestroyed(this),
        switchMap(params => {
          const imageId = params.get('id') ?? '';
          console.log('id :', imageId);
          return this.dataService.getImageDetails(imageId)
            .pipe(
              tap(image => {
                console.log('image details: ', image);
                this.imageDetails.setValue(image)
                console.log('form group: ', this.imageDetails.value);
              }),
              catchError(error => {
                console.log('error: ', error);
                this.showSnackBar('Failed to load image details :(');
                return EMPTY;
              })
            )
        })
      ).subscribe();
  }

  onSubmit(){
      this.dataService.updateImage(this.imageDetails.value).pipe(
            untilDestroyed(this),
            tap(image => {
              console.log('Saved image: ', image);
              this.showSnackBar('Successfully saved!');
            }),
            catchError(error => {
              console.log('error: ', error);
              this.showSnackBar('Save failed!!!');
              return EMPTY;
            })
      ).subscribe();
  }

  deleteItem(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete?` }
    });

    dialogRef.afterClosed().pipe(
      untilDestroyed(this),
      filter(result => Boolean(result)),
      switchMap(() => this.dataService.deleteImage(this.imageDetails.get('id')?.value.toString())
          .pipe(
            tap(() => {
              console.log(`Deleted: ${this.imageDetails.value.title}`);
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

  get title(){
    return this.imageDetails.controls['title'];
  }

  get imageUrl(){
    return this.imageDetails.controls['url'];
  }
}
