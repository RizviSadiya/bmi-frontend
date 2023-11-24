import {
    FormGroup,
    ValidationErrors
} from '@angular/forms';

/**
 * Validates if at least one of the provided fields has a value.
 * Fields can only be of type number or string.
 * @param fields name of the form fields that should be checked
 */
export function atLeastOne(...fields: string[]) {
    return (fg: FormGroup): ValidationErrors | null => {
        return fields.some(fieldName => {
            const field = fg.get(fieldName).value;
            if (typeof field === 'number') return field && field >= 0 ? true : false;
            if (typeof field === 'string') return field && field.length > 0 ? true : false;
        })
            ? null
            : ({ atLeastOne: 'At least one field has to be provided.' } as ValidationErrors);
    };
}