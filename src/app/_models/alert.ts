export class Alert {

    private _alertType: number;
    private _alertText: string;
    private _alertConfirmed: boolean;

    constructor(
        alertType: number,
        alertText: string,
        alertConfirmed: boolean
    ) {
        this._alertType = alertType;
        this._alertText = alertText;
        this._alertConfirmed = alertConfirmed;
    }

    get alertType(): number {
        return this._alertType;
    }

    set alertType(val: number) {
        this._alertType = val;
    }

    get alertText(): string {
        return this._alertText;
    }

    set alertText(val: string) {
        this._alertText = val;
    }

    get alertConfirmed(): boolean {
        return this._alertConfirmed;
    }

    set alertConfirmed(val: boolean) {
        this._alertConfirmed = val;
    }

}
