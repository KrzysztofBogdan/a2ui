import * as ng from "@angular/core";
import * as c from "@angular/forms";
import {DateFormatter} from "./date-formatter";
import {DateDecorator} from "./date-picker-container.component";

const DATE_PICKER_VALUE_ACCESSOR: any = {
    provide: c.NG_VALUE_ACCESSOR,
    useExisting: ng.forwardRef(() => DatePickerComponent),
    multi: true
};

@ng.Component({
    selector: "date-picker",
    templateUrl: "/src/bootstrap/datepicker/date-picker.component.html",
    providers: [DATE_PICKER_VALUE_ACCESSOR]
})
export class DatePickerComponent implements c.ControlValueAccessor {

    @ng.Input("showWeeks") showWeeks: boolean;
    @ng.Input() minDate: Date;
    @ng.Input() maxDate: Date;

    @ng.Output("close") close: ng.EventEmitter<Date> = new ng.EventEmitter<Date>();

    private activeDate: Date;
    private isValid: boolean;

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    writeValue (value: any): void {
        if (value instanceof Date) {
            this.activeDate = new Date(value.getTime());
        } else if (value) {
            this.activeDate = DateFormatter.parse(value);
        }
    }

    activeDateToDateTime (format?: string): string {
        return this.activeDate ? DateFormatter.format(this.activeDate, format ? format : "yyyy-MM-dd") : null;
    }

    registerOnChange (fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched (fn: any): void {
        this.onTouched = fn;
    }

    setValid (valid: boolean): void {
        this.isValid = valid;
    }

    private onUpdate (value: DateDecorator): void {
        setTimeout(() => {
            this.writeValue(value.date);
            this.setValid(value.valid);
        }, 50);
    }

    private onDone (): void {
        this.onClose();
        this.onChange(this.activeDateToDateTime());
    }

    private onClose (): void {
        this.close.emit(this.activeDate);
    }

    private dateNotValid (): boolean {
        return this.activeDate === null || !this.isValid;
    }
}