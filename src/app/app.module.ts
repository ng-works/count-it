import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { counterReducer } from './store/reducers/counter.reducers'

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params
} from '@angular/router'
import { createFeatureSelector, ActionReducerMap } from '@ngrx/store'

import {
  routerReducer,
  RouterReducerState,
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store'
import { environment } from 'src/environments/environment'

interface RouterStateUrl {
  url: string
  queryParams: Params
  params: Params
}

interface RouterState {
  routerReducer: RouterReducerState<RouterStateUrl>
}

const reducers: ActionReducerMap<RouterState> = {
  routerReducer
}

const getRouterState = createFeatureSelector<
  RouterReducerState<RouterStateUrl>
>('routerReducer')

class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState
    const { queryParams } = routerState.root

    let state: ActivatedRouteSnapshot = routerState.root

    while (state.firstChild) {
      state = state.firstChild
    }

    const { params } = state

    return { url, queryParams, params }
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot({
      counters: counterReducer,
      routerReducer
    }),
    StoreRouterConnectingModule.forRoot(),
    environment.production ? [] : StoreDevtoolsModule.instrument()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
