export default function StyleTimeToExam(params) {
    const todayDate = Date.now();
    const dateWorkerCheck  = Date.parse(params.value);
    if (todayDate > dateWorkerCheck) {
        return { backgroundColor: '#f7ad97'};
    } else {
        return null;
    }

}
