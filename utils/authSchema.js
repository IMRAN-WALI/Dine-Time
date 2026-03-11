import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is Required")
    .email("Invalid Email Format"),

  password: Yup.string()
    .required("Password is Required")
    .min(6, "Password Must Be Atleast 6 Characters Long"),
});

export default validationSchema;
