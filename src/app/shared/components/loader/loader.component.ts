import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-overlay">
      <mat-spinner diameter="50"></mat-spinner>
      <div class="loader-text">Loading...</div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      background: rgba(255, 255, 255, 0.8);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    .loader-text {
      margin-top: 16px;
      font-size: 16px;
      color: #666;
    }
  `]
})
export class LoaderComponent {}

// Add this to your global styles (styles.scss) for full-page loader:
/*
.full-page-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
*/
