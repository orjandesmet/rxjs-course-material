import { Subject } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';

export class UIUpdater {

    factoryUpdate$ = new Subject<any[]>();
    assemblyLineUpdate$ = new Subject<any[]>();
    chassisUpdate$ = new Subject<any[]>();
    wheelsUpdate$ = new Subject<any[]>();
    steeringWheelUpdate$ = new Subject<any[]>();
    seatsUpdate$ = new Subject<any[]>();
    paintShopUpdate$ = new Subject<any[]>();
    carsLine$ = new Subject<{ color: string, chassisNr: string }>();
    updates: {[key: string]: Subject<any[]>} = {
        'CarFactory': this.factoryUpdate$,
        'CarAssemblyLine': this.assemblyLineUpdate$,
        'Chassis': this.chassisUpdate$,
        'Wheels': this.wheelsUpdate$,
        'SteeringWheel': this.steeringWheelUpdate$,
        'Seats': this.seatsUpdate$,
        'PaintShop': this.paintShopUpdate$,
    };

    constructor() {
        this.updateCarFactory();
        this.updateCarAssemblyLine();
        this.updateChassisLine();
        this.updateWheels();
        this.updateSteeringWheel();
        this.updateSeats();
        this.updatePaintShop();
    }

    update(target: string, ...status: any[]) {
        if (this.updates[target]) {
            this.updates[target].next(status);
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
            filter(status => status[0] === 'ERROR')
        ).subscribe(status => {
            factoryStatus.innerText = `ERROR: ${status[1]}`;
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
        const carsLine = document.getElementById('cars-line');
        this.assemblyLineUpdate$.subscribe(status => {
            assemblyLineStatus.innerText = status[0];
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

    private updateChassisLine() {
        const chassisStatus = document.getElementById('chassis__status');
        this.chassisUpdate$.subscribe(status => chassisStatus.innerText = status[0]);
    }

    private updateWheels() {
        const wheelsStatus = document.getElementById('wheels__status');
        this.wheelsUpdate$.pipe(filter(status => status[0] !== 'FINISHED')).subscribe(status => wheelsStatus.innerText = status[0]);
        this.wheelsUpdate$.pipe(filter(status => status[0] === 'FINISHED')).subscribe(status => wheelsStatus.innerText = `${status[0]}: ${status[1]}`);
    }

    private updateSteeringWheel() {
        const steeringWheelStatus = document.getElementById('steering-wheel__status');
        this.steeringWheelUpdate$.subscribe(status => steeringWheelStatus.innerText = status[0]);
    }

    private updateSeats() {
        const seatsStatus = document.getElementById('seats__status');
        this.seatsUpdate$.pipe(filter(status => status[0] === 'FINISHED')).subscribe(status => seatsStatus.innerText = status[0]);
        this.seatsUpdate$.pipe(filter(status => status[0] === 'FINISHED')).subscribe(status => seatsStatus.innerText = `${status[0]}: ${status[1]}`);
    }

    private updatePaintShop() {
        const paintShopStatus = document.getElementById('paint-shop__status');
        const paintShopColor = document.getElementById('paint-shop__color');
        this.paintShopUpdate$.subscribe(status => paintShopStatus.innerText = status[0]);
        this.paintShopUpdate$
        .pipe(filter(status => status[0] === 'STARTED'))
        .subscribe(status => paintShopColor.style.backgroundColor = status[1]);
    }
}