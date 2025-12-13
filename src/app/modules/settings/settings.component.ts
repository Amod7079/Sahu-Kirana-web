import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingsService } from '../../core/services/settings.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
    settingsForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private settingsService: SettingsService,
        private snackBar: MatSnackBar
    ) {
        this.settingsForm = this.fb.group({
            shopName: ['', Validators.required],
            ownerName: [''],
            phone: ['', [Validators.pattern('^[0-9]{10}$')]],
            address: ['']
        });
    }

    ngOnInit(): void {
        const settings = this.settingsService.getShopSettings();
        this.settingsForm.patchValue(settings);
    }

    saveSettings(): void {
        if (this.settingsForm.valid) {
            this.settingsService.saveShopSettings(this.settingsForm.value);
            this.snackBar.open('Settings saved successfully!', 'Close', { duration: 3000 });
            // Ideally refresh the app title here if we had a shared layout service
        }
    }

    resetData(): void {
        if (confirm('Are you sure you want to delete ALL customers and transactions? This cannot be undone.')) {
            this.settingsService.clearApplicationData();
            this.snackBar.open('All data has been reset.', 'Close', { duration: 3000 });
            // Ideally reload or redirect
            window.location.reload();
        }
    }
}
