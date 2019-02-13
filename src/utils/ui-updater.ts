import { Subject } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';

export class UIUpdater {

    factoryUpdate$ = new Subject<any[]>();
    assemblyLineUpdate$ = new Subject<any[]>();
    carsLine$ = new Subject<{ color: string, chassisNr: string }>();

    constructor() {
        this.updateCarFactory();
        this.updateCarAssemblyLine();
    }

    update(target: string, ...status: any[]) {
        switch (target) {
            case 'CarFactory':
                this.factoryUpdate$.next(status);
                break;
            case 'CarAssemblyLine':
                this.assemblyLineUpdate$.next(status);
                break;
        }
    }

    private updateCarFactory() {
        const factoryStatus = document.getElementById('factory__status');
        this.factoryUpdate$.pipe(
            filter(status => status[0] === 'STARTED' || status[0] === 'STOPPED')
        ).subscribe(status => {
            factoryStatus.innerText = status[0];
        });
        this.factoryUpdate$.pipe(
            filter(status => status[0] === 'NOT_RUNNING')
        ).subscribe(() => {
            alert('The factory is not running');
        });
        this.factoryUpdate$.pipe(
            filter(status => status[0] === 'ALREADY_RUNNING')
        ).subscribe(() => {
            alert('The factory is already running');
        });
    }

    private updateCarAssemblyLine() {
        const assemblyLineStatus = document.getElementById('assembly-line__status');
        const assemblyLineColor = document.getElementById('assembly-line__color');
        const carsLine = document.getElementById('cars-line');
        this.assemblyLineUpdate$.subscribe(status => {
            assemblyLineStatus.innerText = status[0];
        });
        this.assemblyLineUpdate$.pipe(
            filter(status => status[0] === 'START_CREATING_CAR')
        ).subscribe(color => {
            assemblyLineColor.innerText = color[1];
        });
        this.assemblyLineUpdate$.pipe(
            filter(status => status[0] === 'FINISHED_CREATING_CAR'),
            map(status => [{ color: status[1], chassisNr: status[2] }]),
            scan((acc, car) => acc.concat(car))
        ).subscribe(cars => {
            carsLine.innerHTML = cars.map(car => {
                return `<div class="car">
                <div class="background" style="background-color: ${car.color};">
                <div class="overlay"></div>
                </div>
                <span>${car.chassisNr}</span>
                </div>`;
            }).reduce((acc, current) => acc + current);
        });
    }
}