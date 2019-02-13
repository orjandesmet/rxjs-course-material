export class CarAssemblyLine {

    private TIME_TO_CREATE_LINE = 6000;

    createCarOnLine(color: string) {
        console.log('CarAssemblyLine', `START_CREATING_CAR`, color);
        // EX01: Replace this block to return a Promise
        let finished = false;
        var currentTime = new Date().getTime();
        while (!finished) {
            finished = currentTime + this.TIME_TO_CREATE_LINE < new Date().getTime();
        }
        // The following line should be executed when the Promise completes
        console.log('CarAssemblyLine', 'FINISHED_CREATING_CAR', color);
        // EX01: End
    }
}