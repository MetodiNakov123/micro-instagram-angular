import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../data/data.service';
import { Image } from '../data/image';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-image-list',
  imports: [
    CommonModule,
    PaginationModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    RouterModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.css'
})

export class ImageListComponent implements OnInit{
  @ViewChild('scrollAnchor') scrollAnchor: any;

  title: string = "Micro Instagram";
  images: Image[] = [];
  currentPage: number = 1;
  limit: number = 10;
  totalItems: number = 5000;
  maxVisiblePageNumber: number = 5

  constructor(private dataService: DataService, private route: ActivatedRoute,
              private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) 
  {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPage = Number(params['page']) || 1;
      this.limit = Number(params['limit']) || 10;
      this.loadImages();
    });
  }

  loadImages(){
    this.dataService.getImages(this.currentPage, this.limit).subscribe({
      next: (data) => {
        this.images = data;
        this.scrollToTop();
      },
      error: (error) => {
        console.log('Error loading images!', error);
      }
    });
  }

  onPageChanged(event: any){
    this.currentPage = event.page;
    this.router.navigate(['/images'], { 
      queryParams: { page: this.currentPage, limit: this.limit } 
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            //this.loadImages();
          },
          error: (e) => {
            console.log('error: ', e);
            this.showSnackBar('Unsuccessful deletion!!!');
          },
          complete: () => {
            console.info('complete');
            this.images = this.images.filter(image => image.id !== item.id);
          }
        });
      }
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,       
      horizontalPosition: 'center', 
      verticalPosition: 'bottom'
    });
  }
}