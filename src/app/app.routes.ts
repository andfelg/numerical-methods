import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout';
import { BiseccionPage } from './pages/biseccion-page/biseccion-page';
import { NewtonPage } from './pages/newton-page/newton-page';
import { MainPage } from './pages/main-page/main-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export const routes: Routes = [

    {
        path: '',
        component: AppLayout,
        children: [
            {path: '', component: MainPage},
            {path: 'biseccion', component: BiseccionPage},
            {path: 'newton', component:NewtonPage},
        ]
    },

    {path: '**', component: NotFoundPage},
];
