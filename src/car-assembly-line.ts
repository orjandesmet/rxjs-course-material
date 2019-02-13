export class CarAssemblyLine {

    private TIME_TO_CREATE_LINE = 6000;

    createCarOnLine(color: string) {
        console.log('CarAssemblyLine', `START_CREATING_CAR`, color);
        return new Promise(resolve => {
            setTimeout(() => resolve(), this.TIME_TO_CREATE_LINE);
        }).then(() => {
            console.log('CarAssemblyLine', 'FINISHED_CREATING_CAR', color);
        });
    }
}