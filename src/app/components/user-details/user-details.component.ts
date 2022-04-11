import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  @Input() viewMode = false;
  @Input() currentUser: User = {
    name: '',
    address: '',
    email: ''
  };
  @Output() updatedItem = new EventEmitter<User>();
  @Output() shouldRefresh = new EventEmitter<boolean>();
  
  message = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getUser(this.route.snapshot.params["name"]);
    }
  }

  getUser(id: string): void {
    this.userService.get(id)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  // updatePublished(status: boolean): void {
  //   const data = {
  //     title: this.currentUser.name,
  //     address: this.currentUser.address,
  //     published: status
  //   };

  //   this.message = '';

  //   this.userService.update(this.currentUser.id, data)
  //     .subscribe({
  //       next: (res) => {
  //         console.log(res);
  //         // TODO
  //         // this.currentUser.email = status;
  //         this.message = res.message ? res.message : 'The status was updated successfully!';
  //       },
  //       error: (e) => console.error(e)
  //     });
  // }

  updateUser(): void {
    this.message = 'The user was updated successfully!';
    this.shouldRefresh.emit(true);
    this.updatedItem.emit(this.currentUser);

    this.userService.update(this.currentUser.name, this.currentUser)
      .subscribe({
        next: (res) => {
          console.log(res);
          // this.message = res.message ? res.message : 'This user was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }

  deleteUser(): void {
    this.userService.delete(this.currentUser.name)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/users']);
        },
        error: (e) => console.error(e)
      });
  }
}
