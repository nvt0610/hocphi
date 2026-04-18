import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotEmptyBody', async: false })
export class IsNotEmptyBodyConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!value || typeof value !== 'object') return false;
    return Object.keys(value).length > 0;
  }

  defaultMessage() {
    return 'Dữ liệu gửi lên không được để trống';
  }
}

export function IsNotEmptyBody(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotEmptyBodyConstraint,
    });
  };
}
