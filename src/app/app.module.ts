import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MdToolbarModule,
         MdButtonModule,
         MdProgressSpinnerModule,
         MdProgressBarModule,
         MdCardModule,
         MdInputModule,
         MdDialogModule } from '@angular/material';

import { EmployeeService } from './employee-service/employee.service';
import { UserService } from './user-service/user.service';
import { CipherService } from './cipher-service/cipher.service';
import { SalaryService } from './salary-service/salary.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ReportComponent } from './report/report.component';
import { RegistrationComponent } from './registration/registration.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminUploadComponent } from './admin-upload/admin-upload.component';
import { HomeComponent } from './home/home.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

export const firebaseConfig = {
    apiKey: 'AIzaSyCyi-sODqrwUhgU2HO0lE-mhPDZn8co29Y',
    authDomain: 'donriversalary.firebaseapp.com',
    databaseURL: 'https://donriversalary.firebaseio.com',
    projectId: 'donriversalary',
    storageBucket: 'donriversalary.appspot.com',
    messagingSenderId: '64983734455'
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ReportComponent,
    RegistrationComponent,
    AdminComponent,
    AdminLoginComponent,
    AdminUploadComponent,
    HomeComponent,
    ErrorDialogComponent
  ],
  entryComponents: [
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: 'admin', component: AdminComponent},
      {path: '', component: HomeComponent},
      {path: 'report', component: ReportComponent},
      {path: 'registration', component: RegistrationComponent}
    ]),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MdToolbarModule,
    MdButtonModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    MdCardModule,
    MdInputModule,
    MdDialogModule
  ],
  providers: [SalaryService, CipherService, UserService, EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
