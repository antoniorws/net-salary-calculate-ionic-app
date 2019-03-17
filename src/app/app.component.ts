import { Component, ViewChildren, QueryList } from '@angular/core';

import { Platform, ActionSheetController, PopoverController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private router: Router,
    private toast: Toast
  ) {
    this.initializeApp();
    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
        // close action sheet
        try {
            const element = await this.actionSheetCtrl.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) {
        }

        // close popover
        try {
            const element = await this.popoverCtrl.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) {
        }

        this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
            if (outlet && outlet.canGoBack()) {
                outlet.pop();

            } else if (this.router.url === '/home') {
                if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
                    // this.platform.exitApp(); // Exit from app
                    navigator['app'].exitApp(); // work in ionic 4

                } else {
                    this.toast.show(
                        `Press back again to exit App.`,
                        '2000',
                        'center')
                        .subscribe(toast => {
                            // console.log(JSON.stringify(toast));
                        });
                    this.lastTimeBackPress = new Date().getTime();
                }
            }
        });
    });
  }
}
