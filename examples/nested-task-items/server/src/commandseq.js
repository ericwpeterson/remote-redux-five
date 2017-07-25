const TRANSACTION_STATES = {
    'IDLE' : 0,
    'BUSY' : 1
};

//This little helper class allows us to multiplex the handle location
export default function CommandSequencer()  {
    this.resolveQ = [];
    this.transactionState = TRANSACTION_STATES.IDLE;
}

CommandSequencer.prototype.onReceive = function() {
    this.transactionState = TRANSACTION_STATES.IDLE;

    if (this.resolveQ.length) {
        var resolve = this.resolveQ.shift();
        //gotta do this immediately
        this.transactionState = TRANSACTION_STATES.BUSY;
        resolve();
    }
}

CommandSequencer.prototype.requestWrite = function() {
    if ( this.transactionState !== TRANSACTION_STATES.IDLE ) {
        var p =  new Promise((resolve, reject) => {
            this.resolveQ.push(resolve);
        });
        return p;
    } else {
        return new Promise((resolve, reject) => {
            //gotta do this immediately
            this.transactionState = TRANSACTION_STATES.BUSY;
            resolve();
        });
    }
}
