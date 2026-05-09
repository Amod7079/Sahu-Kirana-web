import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {
  type: 'privacy' | 'terms' = 'privacy';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      const path = url[0].path;
      if (path.includes('terms')) {
        this.type = 'terms';
      } else {
        this.type = 'privacy';
      }
    });
  }
}
