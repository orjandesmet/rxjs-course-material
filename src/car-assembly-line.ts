import { timer } from 'rxjs';
import { tap } from 'rxjs/operators';

export class CarAssemblyLine {

    private TIME_TO_CREATE_LINE = 6000;

    createCarOnLine(color: string) {
        console.log('CarAssemblyLine', `START_CREATING_CAR`, color);
        return timer(this.TIME_TO_CREATE_LINE)
        .pipe(tap(() => {
            console.log('CarAssemblyLine', 'FINISHED_CREATING_CAR', color);
        }));
    }
}