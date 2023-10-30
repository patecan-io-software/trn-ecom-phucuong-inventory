import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from 'class-validator'

export const isNullOrUndefined = (val) => val === null || val === undefined

@ValidatorConstraint({ name: 'isNonNegative', async: false })
export class ValidateNonNegative implements ValidatorConstraintInterface {
	validate(val: number, args: ValidationArguments) {
		return val >= 0
	}

	defaultMessage(args: ValidationArguments) {
		// here you can provide default error message if validation failed
		return 'Value must be equal or greater than 0'
	}
}
