import {addCSRF} from "./helper";
import {config, httpRequest} from "./cps-portal-dao";

export default class IdleTimer {
    IDLE_timerID = undefined;

    constructor() {

        window.onload = this.resetTimer.bind(this);
        window.onmousemove = this.resetTimer.bind(this);
        window.onclick = this.resetTimer.bind(this);
        window.onkeypress = this.resetTimer.bind(this);

        this.setIDLE_timer();
    }

    setIDLE_timer() {
        this.IDLE_timerID = setTimeout(this.logOut, 7000000);
    }

    logOut() {
        alert("Вы отключены от сервера из-за бездействия");
        let _this = this;
        window.location.replace("http://srvyasutp5/cpsequip");
        // let tokenCPS = addCSRF({});
        // httpRequest(config.api.postLogOut, 'POST', tokenCPS).then((response) => {
        //     window.location.href = config.api.loginURL;
        //     _this.IDLE_timerID = undefined;
        // })
    }

    resetTimer() {
        clearTimeout(this.IDLE_timerID);
        this.setIDLE_timer();
    }
}
