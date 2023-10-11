import * as yup from 'yup';

export const validationSchema = [
yup.object({
    fullName: yup.string().required("Full name is required"), //fullName is the name of the fiel
    address1: yup.string().required("Address line 1 is required"),
    address2 : yup.string().required("Address line 1 is required"),
    city : yup.string().required(),
    state : yup.string().required(),
    zip : yup.string().required(),
    country : yup.string().required(),

}),
yup.object(), //thus validation is empty as it is for review the order where we dont have any field to validate
yup.object({
    nameOnCard : yup.string().required()
})
]