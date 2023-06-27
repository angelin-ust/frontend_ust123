import { Component, ViewChild  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Addtocart } from 'src/app/modal/addtocart';
import { Menu } from 'src/app/modal/menu';
import { AuthenticateServiceService } from 'src/app/service/authenticate-service.service';
import { RestaurantService } from 'src/app/service/restaurant.service';
import { SharedmenuserviceService } from 'src/app/service/sharedmenuservice.service';
import { DialogComponent } from '../dialog/dialog.component';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-menuuser',
  templateUrl: './menuuser.component.html',
  styleUrls: ['./menuuser.component.css']
})
export class MenuuserComponent {
  @ViewChild('myModal') modalContent: any;
  quantity: number = 0;

  menu: Menu[] = [];
  restaurant!: String;
  restn: any;
  restname: any;
  cart!: Addtocart;
  cartarray:Addtocart[] = []
 showModal:boolean=false;
  useridd: string | null = null;
  username = localStorage.getItem('username');
  cartItem:Addtocart[] = [];
  constructor(private restService: RestaurantService,
    private router: Router, private route: ActivatedRoute,
    private sharedMenu: SharedmenuserviceService,
    private user: AuthenticateServiceService,private dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.restn = this.route.snapshot.params['restname'];
    this.restname = this.restn;
    this.fetchSpecificRestaurantMenu(this.restname);
    this.useridd = this.user.retrieveUserId();
  }

  fetchSpecificRestaurantMenu(restname: string) {
    this.restService.getAllMenu().subscribe(data => {
      this.menu = data.filter(menuItem => menuItem.restname === restname);
      console.log(this.menu);
    });
  }

  newmenu: Menu[] = [];
  
  
  
  addtocart(menuu: Menu) {
    console.log(this.useridd);
  
    if (this.useridd !== null) {
      this.cart = new Addtocart();
      this.cart.userid = parseInt(this.useridd);
      this.cart.prodid = menuu.mid;
      this.cart.prodname = menuu.mname;
      this.cart.mpic = menuu.mpic;
      this.cart.quantity = menuu.quantity;
      this.cart.price = menuu.mprice;
      this.cart.restname = menuu.restname;
      if (this.cart.restname) {
        localStorage.setItem('restaurantname', this.cart.restname);
      }
      this.cart.status = 'Added to Cart';
  
      console.log(this.cart);
      if (this.cart.prodname) {
        localStorage.setItem('prodname', this.cart.prodname);
      }
  
      this.restService.toCart(this.cart).subscribe(
        (data) => {
          // Create and open the dialog
          const dialogRef = this.dialog.open(DialogComponent, {
            data: 'Added to Cart',
            position: { bottom: '0', right: '0' }, // Customize the position here
            backdropClass: 'custom-dialog-backdrop',
          });
  
          dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            this.showModal = true;
          });
        },
        (error) => {
          const dialogRef = this.dialog.open(DialogComponent, {
            data: 'Failed to add. Try again',
            position: { bottom: '0', right: '0' }, // Customize the position here
            backdropClass: 'custom-dialog-backdrop',
          });
  
          dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
          });
        }
      );
    } else {
      alert('User ID is null. Unable to add to cart.');
    }
  }
  
}
