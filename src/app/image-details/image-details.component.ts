import { Component, OnInit, inject } from '@angular/core';
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
  imageDetails: Image | undefined;
  imageId: string = '';

  constructor(private dataService: DataService, private route: ActivatedRoute, 
              private snackBar: MatSnackBar, private dialog: MatDialog, private location: Location) 
  {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.imageId = params.get('id') ?? '';
      this.getImageDetails(this.imageId);
    });
  }

  getImageDetails(id: string){
    this.dataService.getImageDetails(id).subscribe({
      next: (data) => {
        this.imageDetails = data;
      },
      error: (error) => {
        console.log('error: ', error);
        this.showSnackBar('Failed to load image details :(');
      }
    });
  }

  onSubmit(form: NgForm){
    console.log('in onSubmit: ', form.valid);

    if (this.imageDetails && form.valid){
      this.dataService.updateImage(this.imageDetails).subscribe({
        next: (v) => {
          console.log('next: ', v);
          this.showSnackBar('Successfully saved!');
        },
        error: (e) => {
          console.log('error: ', e);
          this.showSnackBar('Save failed!!!');
        },
        complete: () => console.info('complete') 
      });
    }
  }

  deleteItem(item: Image): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteImage(item.id.toString()).subscribe({
          next: (v) => {
            console.log(`Deleted: ${item.title}`);
            this.showSnackBar("Successfully deleted!");
            this.goBack();
          },
          error: (e) => {
            console.log('error: ', e);
            this.showSnackBar('Unsuccessful deletion!!!');
          },
          complete: () => console.info('complete')
        });
      }
    });
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
